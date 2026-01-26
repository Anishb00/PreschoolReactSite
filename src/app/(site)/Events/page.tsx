import Link from "next/link";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import Banner from "../components/Banner";

export const dynamic = "force-dynamic";

type EventSummary = {
  name: string;
  count: number;
  cover?: string;
};

const eventsDir = path.join(process.cwd(), "public", "events");
const orderFilePath = path.join(eventsDir, "events-order.json");
const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);

function isImageFile(filename: string): boolean {
  return allowedExtensions.has(path.extname(filename).toLowerCase());
}

async function loadEvents(): Promise<EventSummary[]> {
  try {
    const dirents = await readdir(eventsDir, { withFileTypes: true });
    const folders = dirents.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
    let order: string[] = [];
    try {
      const data = await readFile(orderFilePath, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        order = parsed.filter((item) => typeof item === "string");
      }
    } catch {
      order = [];
    }
    const ordered = order.filter((name) => folders.includes(name));
    const remainder = folders.filter((name) => !ordered.includes(name)).sort((a, b) => a.localeCompare(b));
    const list = [...ordered, ...remainder];
    const summaries = await Promise.all(
      list.map(async (name) => {
        try {
          const files = await readdir(path.join(eventsDir, name));
          const images = files.filter(isImageFile);
          return {
            name,
            count: images.length,
            cover: images[0],
          };
        } catch {
          return { name, count: 0 };
        }
      })
    );
    return summaries.sort((a, b) => a.name.localeCompare(b.name));
  } catch {
    return [];
  }
}

export default async function EventsPage() {
  const events = await loadEvents();

  return (
    <>
      <Banner
        imagename="/HeroBG.png"
        title="Event Photos"
        subtitle="Browse highlights from our community events and celebrations."
      />
      <section className="mx-auto w-full max-w-5xl px-4 py-16">
        {events.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
            No event albums have been added yet.
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => {
              const href = `/Events/${encodeURIComponent(event.name)}`;
              return (
                <Link
                  key={event.name}
                  href={href}
                  className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:flex-row sm:items-center"
                >
                  <div className="h-24 w-full overflow-hidden rounded-lg bg-gray-100 sm:h-20 sm:w-32">
                    {event.cover ? (
                      <img
                        src={`/events/${encodeURIComponent(event.name)}/${encodeURIComponent(event.cover)}`}
                        alt={`${event.name} cover`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                        No preview
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {event.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {event.count} {event.count === 1 ? "photo" : "photos"}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-[#3B1FA8]">
                    View album →
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
