export default function DailyRoutine() {
  return (
    <section className="bg-gray-100 p-2 md:p-20">
      <h3 className="mb-6 text-3xl font-semibold text-[#3B1FA8]">
        Daily Routine
      </h3>
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-[#FFCC00] text-left text-gray-900">
            <tr>
              <th className="px-4 py-3 font-semibold">Time</th>
              <th className="px-4 py-3 font-semibold">Activity</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["9:00 AM", "Morning Circle & Calendar Time"],
              ["9:30 AM", "Learning Centers & Table Activities"],
              ["10:30 AM", "Snack & Outdoor Play"],
              ["11:30 AM", "Enrichment (Music/Art)"],
              ["12:00 PM", "Lunch Time"],
              ["1:00 PM", "Nap / Quiet Reading"],
              ["2:30 PM", "Afternoon Group Play & Review"],
              ["3:30 PM", "Dismissal / Aftercare"],
            ].map(([time, activity], idx) => (
              <tr key={idx} className="border-t">
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
