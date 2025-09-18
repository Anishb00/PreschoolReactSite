// Dashboard.jsx

import React from "react";
import {LogoutButton} from "@/app/admin/home/logout";
import {auth} from "@/lib/auth";
import { headers } from 'next/headers';
import { redirect } from "next/navigation";
import {PROJECT_PERMISSION_CODES} from "@/lib/permissions"


export default async function Dashboard() {

  const session = await auth.api.getSession({
      headers: await headers() // you need to pass the headers object.
  })

  if (!session){
    redirect("/admin")
  }
  const user = session?.user;

  // const data = await auth.api.userHasPermission({
  //   body: {
  //     userId: user.id, //the user id
  //     permissions: {
  //       project: [PROJECT_PERMISSION_CODES.VIEW_DASHBOARD], // This must match the structure in your access control
  //     },
  //   },
  // });

  // if (!data.success){
  //   redirect("/admin")
  // }


  // Hardcoded data
  const stats = [
    { title: "Users", value: 1200 },
    { title: "Orders", value: 320 },
    { title: "Revenue", value: "$15,400" },
    { title: "Feedbacks", value: 85 },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col p-4">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <nav className="flex flex-col gap-4">
          <a href="#" className="hover:text-gray-300">Home</a>
          <a href="#" className="hover:text-gray-300">Analytics</a>
          <a href="#" className="hover:text-gray-300">Orders</a>
          <a href="#" className="hover:text-gray-300">Settings</a>
          <a href="/admin/test" className="hover:text-gray-300">Test</a>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">
        {/* Top header */}
        <header className="mb-6">
          <h2 className="text-3xl font-semibold text-gray-800">Welcome, Admin</h2>
          <p className="text-gray-600">Here's an overview of your dashboard.</p>
        </header>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
            >
              <h3 className="text-gray-500">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-800 mt-2">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Example table */}
        <section className="mt-10">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Orders</h3>
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
          <LogoutButton/>
        </section>
      </main>
    </div>
  );
}
