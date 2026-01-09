export default async function Dashboard() {
  // Hardcoded data
  const stats = [
    { title: "Users", value: 1200 },
    { title: "Orders", value: 320 },
    { title: "Revenue", value: "$15,400" },
    { title: "Feedbacks", value: 85 },
  ];

  return (
    <>
      <header className="mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">Welcome, Admin</h2>
        <p className="text-gray-600">Here&apos;s an overview of your dashboard.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
          >
            <h3 className="text-gray-500">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-800 mt-2">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <section className="mt-10">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Recent Orders
        </h3>
        <table className="w-full bg-white rounded-lg shadow overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left">Order ID</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-3">1001</td>
              <td className="p-3">Alice</td>
              <td className="p-3">$120</td>
              <td className="p-3">Completed</td>
            </tr>
            <tr className="border-b">
              <td className="p-3">1002</td>
              <td className="p-3">Bob</td>
              <td className="p-3">$85</td>
              <td className="p-3">Pending</td>
            </tr>
            <tr className="border-b">
              <td className="p-3">1003</td>
              <td className="p-3">Charlie</td>
              <td className="p-3">$45</td>
              <td className="p-3">Cancelled</td>
            </tr>
          </tbody>
        </table>
      </section>
    </>
  );
}
