import { readdir } from "node:fs/promises";
import path from "node:path";
import { notFound } from "next/navigation";
import Banner from "../../components/Banner";
import EventGallery from "../components/EventGallery";

export const dynamic = "force-dynamic";

const eventsDir = path.join(process.cwd(), "public", "events");
const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);

function isImageFile(filename: string): boolean {
  return allowedExtensions.has(path.extname(filename).toLowerCase());
}

async function loadEventImages(eventName: string): Promise<string[] | null> {
  const safeName = path.basename(eventName);
  if (!safeName || safeName !== eventName || safeName.includes("..")) {
    return null;
  }
  try {
    const files = await readdir(path.join(eventsDir, safeName));
    return files.filter(isImageFile).sort((a, b) => a.localeCompare(b));
  } catch {
    return null;
  }
}

export default async function EventDetailPage({
  params,
}: {
  params: { event: string };
}) {
  const eventName = decodeURIComponent(params.event);
  const images = await loadEventImages(eventName);

  if (!images) {
    notFound();
  }

  return (
    <>
      <Banner
        imagename="/HeroBG.png"
        title={eventName}
        subtitle="Tap a photo to view it larger."
      />
      <EventGallery eventName={eventName} images={images} />
    </>
  );
}
