"use client";

import { useState } from "react";

type RoutinePage = {
  title: string;
  rows: [string, string][];
};

const routinePages: RoutinePage[] = [
  {
    title: "Caterpillar & Butterfly",
    rows: [
      ["8:30 - 9:15", "Art & Craft, Cutting, Coloring, Free Play"],
      ["9:15 - 9:30", "Clean Up, Story, Dance, Yoga (Friday)"],
      ["9:30 - 10:30", "Restroom, Snack, Circle Time, Worksheet"],
      ["10:30 - 11:30", "Outdoor Play"],
      ["11:30 - 12:30", "Hand Wash, Lunchtime, Bathroom, Reading Book"],
      ["12:30 - 2:30", "Nap"],
      ["2:30 - 3:00", "Clean Up, Snack, Bathroom"],
      ["3:00 - 4:00", "Circle Time, Worksheet, Learn to Read Words"],
      ["4:00 - 5:00", "Outdoor Play"],
      ["5:00 - 6:00", "Coloring, Free Choice, Dismissal Time"],
    ],
  },
  {
    title: "Chrysalis & Rainbow",
    rows: [
      ["8:30 - 9:20", "Art & Craft, Free Play"],
      ["9:20 - 10:30", "Snack, Outdoor Play, Bathroom"],
      ["10:30 - 11:00", "Circle Time, Story, Music and Dance"],
      ["11:00 - 11:30", "Worksheet, Art & Craft"],
      ["11:30 - 12:00", "Lunch, Rhymes, Story"],
      ["12:00 - 12:30", "Bathroom (Diaper Change)"],
      ["12:30 - 2:45", "Nap, Bathroom"],
      ["2:45 - 3:45", "Snack, Worksheet, Circle Time"],
      ["3:45 - 5:00", "Outdoor Play"],
      ["5:00 - 6:00", "Art & Craft, Free Choice"],
    ],
  },
  {
    title: "Sunshine",
    rows: [
      ["8:30 - 9:15", "Art & Craft, Cutting, Coloring, Free Play"],
      ["9:15 - 9:30", "Clean Up, Hand Wash, Snack"],
      ["9:30 - 10:30", "Outdoor Play, Bathroom"],
      ["10:30 - 11:30", "Circle Time, Story, Music, Dance & Worksheet"],
      ["11:30 - 12:30", "Lunch Time, Bathroom, Book"],
      ["12:30 - 2:30", "Nap"],
      ["2:30 - 3:15", "Clean Up, Snack, Bathroom"],
      ["3:15 - 4:00", "Worksheet, Story, Rhymes, Dance"],
      ["4:00 - 5:00", "Outdoor Play"],
      [
        "5:00 - 6:00",
        "Coloring, Play-Doh, Dry Erase Board, Free Play, Dismissal Time",
      ],
    ],
  },
];

export default function DailyRoutine() {
  const [activePage, setActivePage] = useState(0);
  const routine = routinePages[activePage];

  return (
    <section className="bg-gray-100 p-2 md:p-20">
      <h3 className="mb-6 text-3xl font-semibold text-[#3B1FA8]">
        Daily Routine
      </h3>

      <div className="mb-4 flex flex-wrap gap-2">
        {routinePages.map((page, index) => (
          <button
            key={page.title}
            onClick={() => setActivePage(index)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              index === activePage
                ? "bg-[#3B1FA8] text-white"
                : "bg-white text-[#3B1FA8] hover:bg-[#EEE8FF]"
            }`}
            aria-current={index === activePage ? "page" : undefined}
          >
            {page.title}
          </button>
        ))}
      </div>

      <h4 className="mb-3 text-lg font-semibold text-[#3B1FA8]">
        {routine.title}
      </h4>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-[#FFCC00] text-left text-gray-900">
            <tr>
              <th className="px-4 py-3 font-semibold">Time</th>
              <th className="px-4 py-3 font-semibold">Activity</th>
            </tr>
          </thead>
          <tbody>
            {routine.rows.map(([time, activity], idx) => (
              <tr key={`${time}-${idx}`} className="border-t">
                <td className="px-4 py-2">{time}</td>
                <td className="px-4 py-2">{activity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
