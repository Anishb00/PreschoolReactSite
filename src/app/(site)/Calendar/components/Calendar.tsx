import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";

export default function Calendar() {
  const events = [
    { title: "Winter Break", date: "2025-12-23" },
    { title: "Parent-Teacher Conference", date: "2025-11-14" },
    { title: "Spring Festival", date: "2026-03-25" },
  ];

  return (
    <section className="flex flex-col gap-10 px-1 py-20 md:flex-row md:justify-center">
      {/* Calendar View */}
      <div className="lg:w-1/2">
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={"https://fullcalendar.io/api/demo-feeds/events.json"}
        />
      </div>

      {/* List View */}
      <div className="lg:w-1/2">
        <FullCalendar
          plugins={[listPlugin]}
          initialView="listMonth"
          events={"https://fullcalendar.io/api/demo-feeds/events.json"}
        />
      </div>
    </section>
  );
}
