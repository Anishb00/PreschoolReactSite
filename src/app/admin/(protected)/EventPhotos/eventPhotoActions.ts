"use server";

import { access, mkdir, readdir, readFile, rm, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";

export type EventPhotoEntry = {
  event: string;
  count: number;
};

export type EventPhotoEditorState = {
  events: EventPhotoEntry[];
  message?: string;
};

export type EventAlbumState = {
  event: string;
  images: string[];
  message?: string;
};

const eventsDir = path.join(process.cwd(), "public", "events");
const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const orderFilePath = path.join(eventsDir, "events-order.json");

function isImageFile(filename: string): boolean {
  return allowedExtensions.has(path.extname(filename).toLowerCase());
}

async function ensureEventsDir(): Promise<void> {
  await mkdir(eventsDir, { recursive: true });
}

export async function listEventFolders(): Promise<string[]> {
  await ensureEventsDir();
  const dirents = await readdir(eventsDir, { withFileTypes: true });
  return dirents.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
}

async function listEventImages(eventName: string): Promise<string[]> {
  try {
    const files = await readdir(path.join(eventsDir, eventName));
    return files.filter(isImageFile).sort((a, b) => a.localeCompare(b));
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
    return parsed.filter((item) => typeof item === "string" && isSafeName(item));
  } catch {
    try {
      await saveOrder([]);
    } catch {
      // ignore write failures
    }
    return [];
  }
}

async function saveOrder(events: string[]): Promise<void> {
  await ensureEventsDir();
  const unique = Array.from(new Set(events));
  await writeFile(orderFilePath, JSON.stringify(unique, null, 2) + "\n", "utf-8");
}

function sanitizeEventName(value: string): string | null {
  const cleaned = value
    .replace(/[\\/]/g, " ")
    .replace(/[^a-zA-Z0-9 _-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!cleaned) {
    return null;
  }
  return cleaned.slice(0, 80);
}

function isSafeName(value: string): boolean {
  if (!value) return false;
  if (value.includes("..")) return false;
  return path.basename(value) === value;
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
  const safeStem = stem || "event-photo";
  return `${safeStem}${ext}`;
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function ensureUniqueFilename(eventName: string, filename: string): Promise<string> {
  const ext = path.extname(filename);
  const stem = path.basename(filename, ext);
  let candidate = filename;
  let counter = 1;
  while (await fileExists(path.join(eventsDir, eventName, candidate))) {
    candidate = `${stem}-${counter}${ext}`;
    counter += 1;
  }
  return candidate;
}

export async function loadEventPhotos(): Promise<EventPhotoEntry[]> {
  const folders = await listEventFolders();
  const order = await readOrder();
  const ordered = order.filter((name) => folders.includes(name));
  const remainder = folders
    .filter((name) => !ordered.includes(name))
    .sort((a, b) => a.localeCompare(b));
  const nextOrder = [...ordered, ...remainder];

  if (nextOrder.length !== order.length) {
    await saveOrder(nextOrder);
  }

  const entries = await Promise.all(
    nextOrder.map(async (event) => ({
      event,
      count: (await listEventImages(event)).length,
    }))
  );
  return entries;
}

export async function updateEventPhotos(
  _prevState: EventPhotoEditorState,
  formData: FormData
): Promise<EventPhotoEditorState> {
  const actionType = String(formData.get("actionType") || "").trim();

  if (actionType === "create-event") {
    const rawName = String(formData.get("eventName") || "").trim();
    const eventName = sanitizeEventName(rawName);
    if (!eventName) {
      return { events: await loadEventPhotos(), message: "Enter an event name." };
    }
    await ensureEventsDir();
    if (!isSafeName(eventName)) {
      return { events: await loadEventPhotos(), message: "Invalid event name." };
    }
    await mkdir(path.join(eventsDir, eventName), { recursive: true });
    const currentOrder = await readOrder();
    if (!currentOrder.includes(eventName)) {
      await saveOrder([...currentOrder, eventName]);
    }
    revalidatePath("/Events");
    return { events: await loadEventPhotos(), message: `Created ${eventName}.` };
  }

  if (actionType === "delete-event") {
    const eventName = String(formData.get("eventName") || "").trim();
    if (!isSafeName(eventName)) {
      return { events: await loadEventPhotos(), message: "Invalid event selected." };
    }
    try {
      await rm(path.join(eventsDir, eventName), { recursive: true, force: true });
    } catch {
      // ignore delete failures
    }
    const nextOrder = (await readOrder()).filter((name) => name !== eventName);
    await saveOrder(nextOrder);
    revalidatePath("/Events");
    revalidatePath(`/Events/${encodeURIComponent(eventName)}`);
    return { events: await loadEventPhotos(), message: `Deleted ${eventName}.` };
  }

  if (actionType === "move-event") {
    const eventName = String(formData.get("eventName") || "").trim();
    const direction = String(formData.get("direction") || "").trim();
    if (!isSafeName(eventName)) {
      return { events: await loadEventPhotos(), message: "Invalid event selected." };
    }
    const folders = await listEventFolders();
    const currentOrder = (await readOrder()).filter((name) => folders.includes(name));
    const remainder = folders
      .filter((name) => !currentOrder.includes(name))
      .sort((a, b) => a.localeCompare(b));
    const workingOrder = [...currentOrder, ...remainder];
    const index = workingOrder.indexOf(eventName);
    if (index === -1) {
      return { events: await loadEventPhotos(), message: "Event not found." };
    }
    if (direction === "up" && index > 0) {
      [workingOrder[index - 1], workingOrder[index]] = [
        workingOrder[index],
        workingOrder[index - 1],
      ];
    } else if (direction === "down" && index < workingOrder.length - 1) {
      [workingOrder[index + 1], workingOrder[index]] = [
        workingOrder[index],
        workingOrder[index + 1],
      ];
    }
    await saveOrder(workingOrder);
    revalidatePath("/Events");
    return { events: await loadEventPhotos(), message: "Updated event order." };
  }

  return { events: await loadEventPhotos() };
}

export async function loadEventAlbum(eventName: string): Promise<string[] | null> {
  if (!isSafeName(eventName)) {
    return null;
  }
  const folders = await listEventFolders();
  if (!folders.includes(eventName)) {
    return null;
  }
  return listEventImages(eventName);
}

export async function updateEventAlbum(
  _prevState: EventAlbumState,
  formData: FormData
): Promise<EventAlbumState> {
  const actionType = String(formData.get("actionType") || "").trim();
  const eventName = String(formData.get("eventName") || "").trim();
  if (!isSafeName(eventName)) {
    return { event: eventName, images: [], message: "Invalid event selected." };
  }

  if (actionType === "upload") {
    const files = formData
      .getAll("photo")
      .filter((item) => item instanceof File && item.size > 0) as File[];
    if (files.length === 0) {
      return {
        event: eventName,
        images: await listEventImages(eventName),
        message: "Choose photo(s) to upload.",
      };
    }

    const added: string[] = [];
    await mkdir(path.join(eventsDir, eventName), { recursive: true });
    for (const file of files) {
      const sanitized = sanitizeFilename(file.name || "event-photo");
      if (!sanitized) {
        return {
          event: eventName,
          images: await listEventImages(eventName),
          message: "Only JPG, PNG, and WebP files are allowed.",
        };
      }
      const finalName = await ensureUniqueFilename(eventName, sanitized);
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(path.join(eventsDir, eventName, finalName), buffer);
      added.push(finalName);
    }

    revalidatePath("/Events");
    revalidatePath(`/Events/${encodeURIComponent(eventName)}`);
    const summary =
      added.length === 1 ? `Added ${added[0]}.` : `Added ${added.length} photos.`;
    return {
      event: eventName,
      images: await listEventImages(eventName),
      message: summary,
    };
  }

  if (actionType === "delete") {
    const filename = String(formData.get("filename") || "").trim();
    const safeFilename = path.basename(filename);
    if (!safeFilename || safeFilename !== filename || !isImageFile(safeFilename)) {
      return {
        event: eventName,
        images: await listEventImages(eventName),
        message: "Invalid filename.",
      };
    }
    try {
      await unlink(path.join(eventsDir, eventName, safeFilename));
    } catch {
      // ignore missing files
    }
    revalidatePath("/Events");
    revalidatePath(`/Events/${encodeURIComponent(eventName)}`);
    return {
      event: eventName,
      images: await listEventImages(eventName),
      message: `Deleted ${safeFilename}.`,
    };
  }

  return { event: eventName, images: await listEventImages(eventName) };
}
