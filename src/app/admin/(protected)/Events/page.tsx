import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { authorizeUser } from "@/lib/authentication";
import { MIN_ASSET_ROLE_ACCESS } from "@/lib/protectedassets";
import EventEditor from "@/app/admin/components/EventEditor";

type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  end?: string;
};

type EventEditorState = {
  events: CalendarEvent[];
};

const eventsFilePath = path.join(
  process.cwd(),
  "src",
  "app",
  "(site)",
  "Calendar",
  "data",
  "events.json"
);

async function loadEvents(): Promise<CalendarEvent[]> {
  try {
    const data = await readFile(eventsFilePath, "utf-8");
    const parsed = JSON.parse(data) as CalendarEvent[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    try {
      await saveEvents([]);
    } catch {
      // ignore write failures
    }
    return [];
  }
}

async function saveEvents(events: CalendarEvent[]): Promise<void> {
  await writeFile(eventsFilePath, JSON.stringify(events, null, 2) + "\n", "utf-8");
}

export default async function EventsPage() {
  await authorizeUser(MIN_ASSET_ROLE_ACCESS.EDIT_CALENDAR);
  const events = await loadEvents();

  const upsertEvent = async (
    _prevState: EventEditorState,
    formData: FormData
  ): Promise<EventEditorState> => {
    "use server";
    const actionType = String(formData.get("actionType") || "upsert").trim();
    const eventId = String(formData.get("eventId") || "").trim();
    const title = String(formData.get("title") || "").trim();
    const date = String(formData.get("date") || "").trim();
    const end = String(formData.get("end") || "").trim();
    if (actionType === "delete") {
      if (!eventId) {
        return { events: await loadEvents() };
      }
      const currentEvents = await loadEvents();
      const nextEvents = currentEvents.filter((event) => event.id !== eventId);
      await saveEvents(nextEvents);
      return { events: nextEvents };
    }
    if (!title || !date) {
      return { events: await loadEvents() };
    }
    if (end && end <= date) {
      return { events: await loadEvents() };
    }

    const currentEvents = await loadEvents();
    const eventIndex = currentEvents.findIndex((event) => event.id === eventId);
    const payload = { title, date, ...(end ? { end } : {}) };

    if (eventId && eventIndex !== -1) {
      const nextEvent = {
        ...currentEvents[eventIndex],
        ...payload,
      };
      if (!end) {
        delete nextEvent.end;
      }
      currentEvents[eventIndex] = nextEvent;
    } else {
      const id = `evt_${crypto.randomUUID()}`;
      currentEvents.push({ id, ...payload });
    }

    await saveEvents(currentEvents);
    return { events: currentEvents };
  };

  return (
    <>
      <header className="mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">
          Calendar Events
        </h2>
        <p className="text-gray-600">Create or edit calendar events.</p>
      </header>
      <EventEditor initialEvents={events} upsertEvent={upsertEvent} />
    </>
  );
}
