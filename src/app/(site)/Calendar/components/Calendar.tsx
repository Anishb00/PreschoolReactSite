"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";

type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  end?: string;
};

type CalendarProps = {
  events: CalendarEvent[];
};

export default function Calendar({ events }: CalendarProps) {
  const calendarEvents = events.map((event) => {
    if (!event.end) {
      return event;
    }
    const endDate = new Date(`${event.end}T00:00:00`);
    endDate.setDate(endDate.getDate() + 1);
    const endExclusive = endDate.toISOString().split("T")[0];
    return { ...event, end: endExclusive };
  });
  const listEvents = events.map((event) => {
    if (!event.end) {
      return event;
    }
    const startLabel = new Date(`${event.date}T00:00:00`).toLocaleString(
      "en-US",
      { month: "short", day: "numeric" }
    );
    const endLabel = new Date(`${event.end}T00:00:00`).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
    });
    return {
      ...event,
      end: undefined,
      title: `${event.title} (${startLabel} - ${endLabel})`,
    };
  });

  return (
    <section className="calendar-wrapper flex flex-col gap-10 px-2 py-20 min-[1200px]:flex-row min-[1200px]:justify-center">
      {/* Calendar View */}
      <div className="min-[1200px]:w-1/2">
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={calendarEvents}
        />
      </div>

      {/* List View */}
      <div className="min-[1200px]:w-1/2">
        <FullCalendar
          plugins={[listPlugin]}
          initialView="listMonth"
          events={listEvents}
          displayEventTime={false}
        />
      </div>
    </section>
  );
}
