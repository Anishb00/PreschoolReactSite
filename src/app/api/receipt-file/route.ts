import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { readFile } from "fs/promises";
import { authorizeUser } from "@/lib/authentication";
import { MIN_ASSET_ROLE_ACCESS } from "@/lib/protectedassets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const OUTPUT_PATH = path.join(process.cwd(), "documents", "filled_reciept.pdf");

export async function GET(_req: NextRequest) {
  await authorizeUser(MIN_ASSET_ROLE_ACCESS.GENERATE_RECIEPTS);

  try {
    const bytes = await readFile(OUTPUT_PATH);
    // Convert to a plain ArrayBuffer (NextResponse does not accept SharedArrayBuffer)
    const pdfArrayBuffer = new Uint8Array(bytes).buffer;
    return new NextResponse(pdfArrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="filled_reciept.pdf"',
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "filled_reciept.pdf could not be read from the server." },
      { status: 404 }
    );
  }
}
