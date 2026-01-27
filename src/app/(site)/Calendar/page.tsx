import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import Banner from "../components/Banner";
import Calendar from "./components/Calendar";

type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  end?: string;
};

export const dynamic = "force-dynamic";

export default async function Programs() {
  const eventsFilePath = path.join(
    process.cwd(),
    "public",
    "_dynamic",
    "calendar_events.json"
  );
  let events: CalendarEvent[] = [];
  try {
    const data = await readFile(eventsFilePath, "utf-8");
    const parsed = JSON.parse(data) as CalendarEvent[];
    if (Array.isArray(parsed)) {
      events = parsed;
    }
  } catch {
    try {
      await writeFile(eventsFilePath, "[]\n", "utf-8");
    } catch {
      // ignore write failures
    }
    events = [];
  }

  return (
    <>
      <Banner
        imagename="/HeroBG.png"
        title="Calendar"
        subtitle="Stay up to date with important holidays, closures, and events throughout the school year."
      />
      <Calendar events={events} />
    </>
  );
}
