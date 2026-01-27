'use server';

import {
  access,
  mkdir,
  readFile,
  readdir,
  unlink,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";

export type CarouselEntry = {
  file: string;
  inCarousel: boolean;
};

export type CarouselEditorState = {
  entries: CarouselEntry[];
  message?: string;
};

const carouselDir = path.join(process.cwd(), "public", "photocarousel");
const orderFilePath = path.join(carouselDir, "photocarousel.json");

const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);

function isImageFile(filename: string): boolean {
  return allowedExtensions.has(path.extname(filename).toLowerCase());
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function sanitizeFilename(value: string): string | null {
  const base = path.basename(value);
  if (!base) {
    return null;
  }
  const ext = path.extname(base).toLowerCase();
  if (!allowedExtensions.has(ext)) {
    return null;
  }
  const stem = path
    .basename(base, ext)
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/_+/g, "_")
    .trim();
  const safeStem = stem || "carousel";
  return `${safeStem}${ext}`;
}

async function ensureUniqueFilename(filename: string): Promise<string> {
  const ext = path.extname(filename);
  const stem = path.basename(filename, ext);
  let candidate = filename;
  let counter = 1;
  while (await fileExists(path.join(carouselDir, candidate))) {
    candidate = `${stem}-${counter}${ext}`;
    counter += 1;
  }
  return candidate;
}

async function listDiskImages(): Promise<string[]> {
  try {
    const files = await readdir(carouselDir);
    return files.filter(isImageFile);
  } catch {
    return [];
  }
}

async function readOrder(): Promise<string[]> {
  try {
    const data = await readFile(orderFilePath, "utf-8");
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((item) => typeof item === "string" && isImageFile(item));
  } catch {
    try {
      await saveOrder([]);
    } catch {
      // ignore write failures
    }
    return [];
  }
}

export async function loadCarouselImages(): Promise<CarouselEntry[]> {
  const files = await listDiskImages();
  const order = await readOrder();
  const included = order.filter((f) => files.includes(f));

  // rewrite order if it referenced missing files
  if (included.length !== order.length) {
    await saveOrder(included);
  }

  const includedSet = new Set(included);
  const excluded = files.filter((f) => !includedSet.has(f)).sort((a, b) => a.localeCompare(b));

  return [
    ...included.map((file) => ({ file, inCarousel: true })),
    ...excluded.map((file) => ({ file, inCarousel: false })),
  ];
}

async function saveOrder(images: string[]): Promise<void> {
  await mkdir(path.dirname(orderFilePath), { recursive: true });
  const unique = Array.from(new Set(images));
  await writeFile(orderFilePath, JSON.stringify(unique, null, 2) + "\n", "utf-8");
}

export async function updateCarousel(
  _prevState: CarouselEditorState,
  formData: FormData
): Promise<CarouselEditorState> {
  const actionType = String(formData.get("actionType") || "").trim();

  if (actionType === "add") {
    const file = formData.get("photo");
    if (!(file instanceof File) || file.size === 0) {
      return {
        entries: await loadCarouselImages(),
        message: "Choose a photo to upload.",
      };
    }

    const sanitized = sanitizeFilename(file.name || "carousel-image");
    if (!sanitized) {
      return {
        entries: await loadCarouselImages(),
        message: "Only JPG, PNG, and WebP files are allowed.",
      };
    }

    const finalName = await ensureUniqueFilename(sanitized);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(carouselDir, finalName), buffer);

    const currentEntries = await loadCarouselImages();
    const currentIncluded = currentEntries.filter((e) => e.inCarousel).map((e) => e.file);
    const withoutNew = currentIncluded.filter((name) => name !== finalName);
    const nextOrder = [...withoutNew, finalName];
    await saveOrder(nextOrder);
    revalidatePath("/");
    return {
      entries: await loadCarouselImages(),
      message: `Added ${finalName}.`,
    };
  }

  const filename = String(formData.get("filename") || "").trim();
  const safeFilename = path.basename(filename);
  if (!safeFilename || safeFilename !== filename || !isImageFile(safeFilename)) {
    return {
      entries: await loadCarouselImages(),
      message: "Invalid filename.",
    };
  }

  if (actionType === "delete") {
    try {
      await unlink(path.join(carouselDir, safeFilename));
    } catch {
      // ignore missing files
    }
    const currentEntries = await loadCarouselImages();
    const nextOrder = currentEntries
      .filter((e) => e.inCarousel && e.file !== safeFilename)
      .map((e) => e.file);
    await saveOrder(nextOrder);
    revalidatePath("/");
    return {
      entries: await loadCarouselImages(),
      message: `Deleted ${safeFilename}.`,
    };
  }

  if (actionType === "toggle") {
    const include = String(formData.get("include") || "").trim() === "1";
    const filesOnDisk = await listDiskImages();
    if (!filesOnDisk.includes(safeFilename)) {
      return {
        entries: await loadCarouselImages(),
        message: "Photo not found.",
      };
    }

    const currentOrder = (await readOrder()).filter((f) => filesOnDisk.includes(f));
    let nextOrder = currentOrder.filter((f) => f !== safeFilename);
    if (include) {
      nextOrder.push(safeFilename); // append to end
    }

    await saveOrder(nextOrder);
    revalidatePath("/");
    return {
      entries: await loadCarouselImages(),
      message: include
        ? `Added ${safeFilename} to carousel.`
        : `Removed ${safeFilename} from carousel.`,
    };
  }

  if (actionType === "move") {
    const direction = String(formData.get("direction") || "").trim();
    const filesOnDisk = await listDiskImages();
    const currentIncluded = (await readOrder()).filter((f) => filesOnDisk.includes(f));
    const index = currentIncluded.indexOf(safeFilename);
    if (index === -1) {
      return {
        entries: await loadCarouselImages(),
        message: "Photo not found or not in carousel.",
      };
    }

    const next = [...currentIncluded];
    if (direction === "up" && index > 0) {
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
    } else if (direction === "down" && index < next.length - 1) {
      [next[index + 1], next[index]] = [next[index], next[index + 1]];
    }

    await saveOrder(next);
    revalidatePath("/");
    return {
      entries: await loadCarouselImages(),
      message: "Updated carousel order.",
    };
  }

  return { entries: await loadCarouselImages() };
}
