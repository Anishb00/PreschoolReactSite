import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { mkdir, readdir, stat, writeFile, unlink } from "fs/promises";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DOCS_DIR = path.join(process.cwd(), "documents");

function sanitizeFilename(name: string): string {
  return name.replace(/[/\\]+/g, "_").trim();
}

export async function GET() {
  await mkdir(DOCS_DIR, { recursive: true });
  const entries = await readdir(DOCS_DIR);
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(DOCS_DIR, entry);
      const stats = await stat(fullPath);
      if (stats.isDirectory()) {
        return null;
      }
      return {
        name: entry,
        size: stats.size,
        modified: stats.mtime.toISOString(),
      };
    })
  );
  return NextResponse.json({ files: files.filter(Boolean) });
}

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file");
  const overrideName = sanitizeFilename(String(form.get("name") ?? ""));
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "file is required" }, { status: 400 });
  }
  const filename = overrideName || sanitizeFilename(file.name);
  if (!filename) {
    return NextResponse.json({ error: "Invalid filename." }, { status: 400 });
  }

  await mkdir(DOCS_DIR, { recursive: true });
  const arrayBuffer = await file.arrayBuffer();
  await writeFile(path.join(DOCS_DIR, filename), Buffer.from(arrayBuffer));

  return NextResponse.json({ message: "Saved", name: filename });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const filename = sanitizeFilename(searchParams.get("name") ?? "");
  if (!filename) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  try {
    await unlink(path.join(DOCS_DIR, filename));
    return NextResponse.json({ message: "Deleted", name: filename });
  } catch (err) {
    return NextResponse.json({ error: "Unable to delete file." }, { status: 400 });
  }
}
