import {
  access,
  mkdir,
  readFile,
  readdir,
  unlink,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { authorizeUser } from "@/lib/authentication";
import { MIN_ASSET_ROLE_ACCESS } from "@/lib/protectedassets";
import CarouselEditor from "@/app/admin/components/CarouselEditor";

type CarouselEditorState = {
  images: string[];
  message?: string;
};

const carouselDir = path.join(process.cwd(), "public", "photocarousel");
const orderFilePath = path.join(
  process.cwd(),
  "src",
  "app",
  "(site)",
  "data",
  "photocarousel.json"
);

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
    return [];
  }
}

function mergeOrder(order: string[], files: string[]): string[] {
  const fileSet = new Set(files);
  const ordered = order.filter((file) => fileSet.has(file));
  const orderedSet = new Set(ordered);
  const remaining = files
    .filter((file) => !orderedSet.has(file))
    .sort((a, b) => a.localeCompare(b));
  return [...ordered, ...remaining];
}

async function loadCarouselImages(): Promise<string[]> {
  const files = await listDiskImages();
  const order = await readOrder();
  return mergeOrder(order, files);
}

async function saveOrder(images: string[]): Promise<void> {
  await mkdir(path.dirname(orderFilePath), { recursive: true });
  const unique = Array.from(new Set(images));
  await writeFile(orderFilePath, JSON.stringify(unique, null, 2) + "\n", "utf-8");
}

export default async function CarouselPage() {
  await authorizeUser(MIN_ASSET_ROLE_ACCESS.EDIT_CAROUSEL);
  const images = await loadCarouselImages();

  const updateCarousel = async (
    _prevState: CarouselEditorState,
    formData: FormData
  ): Promise<CarouselEditorState> => {
    "use server";
    const actionType = String(formData.get("actionType") || "").trim();

    if (actionType === "add") {
      const file = formData.get("photo");
      if (!(file instanceof File) || file.size === 0) {
        return {
          images: await loadCarouselImages(),
          message: "Choose a photo to upload.",
        };
      }

      const sanitized = sanitizeFilename(file.name || "carousel-image");
      if (!sanitized) {
        return {
          images: await loadCarouselImages(),
          message: "Only JPG, PNG, and WebP files are allowed.",
        };
      }

      const finalName = await ensureUniqueFilename(sanitized);
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(path.join(carouselDir, finalName), buffer);

      const current = await loadCarouselImages();
      const withoutNew = current.filter((name) => name !== finalName);
      const next = [...withoutNew, finalName];
      await saveOrder(next);
      return {
        images: next,
        message: `Added ${finalName}.`,
      };
    }

    const filename = String(formData.get("filename") || "").trim();
    const safeFilename = path.basename(filename);
    if (!safeFilename || safeFilename !== filename || !isImageFile(safeFilename)) {
      return {
        images: await loadCarouselImages(),
        message: "Invalid filename.",
      };
    }

    if (actionType === "delete") {
      try {
        await unlink(path.join(carouselDir, safeFilename));
      } catch {
        // ignore missing files
      }
      const current = await loadCarouselImages();
      const next = current.filter((name) => name !== safeFilename);
      await saveOrder(next);
      return {
        images: next,
        message: `Deleted ${safeFilename}.`,
      };
    }

    if (actionType === "move") {
      const direction = String(formData.get("direction") || "").trim();
      const current = await loadCarouselImages();
      const index = current.indexOf(safeFilename);
      if (index === -1) {
        return {
          images: current,
          message: "Photo not found.",
        };
      }

      const next = [...current];
      if (direction === "up" && index > 0) {
        [next[index - 1], next[index]] = [next[index], next[index - 1]];
      } else if (direction === "down" && index < next.length - 1) {
        [next[index + 1], next[index]] = [next[index], next[index + 1]];
      }

      await saveOrder(next);
      return {
        images: next,
        message: "Updated carousel order.",
      };
    }

    return { images: await loadCarouselImages() };
  };

  return (
    <>
      <header className="mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">
          Photo Carousel
        </h2>
        <p className="text-gray-600">
          Add, remove, and reorder photos shown on the homepage carousel.
        </p>
      </header>
      <CarouselEditor initialImages={images} updateCarousel={updateCarousel} />
    </>
  );
}
