"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
export default function Customers() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const raw = window.localStorage.getItem("customers");
      if (raw) {
        setCustomers(JSON.parse(raw));
      }
    }
  }, []);

  return (
    <div className="flex flex-col gap-6 p-6 bg-slate-50 min-h-screen">

      {/* PAGE TITLE */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Customer Pipeline</h1>
          <p className="text-sm text-slate-500">Manage onboarding progress, approvals, and service selections in one place.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:shadow-lg hover:-translate-y-0.5">Filter</button>
          <button className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:shadow-lg hover:-translate-y-0.5">Export</button>
          <Link href="/customers/create" className="rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:from-indigo-700 hover:to-blue-600 transition">+ New Lead</Link>
        </div>
      </div>

      {/* INFO CARDS */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[
          { label: "Pending Approvals", value: "24", color: "text-amber-500" },
          { label: "New Customers (24h)", value: "156", color: "text-blue-600" },
          { label: "Avg Onboarding Time", value: "4.2 hrs", color: "text-emerald-600" },
          { label: "Compliance Rate", value: "98.5%", color: "text-indigo-600" },
        ].map((card) => (
          <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <p className="text-sm text-slate-500 uppercase tracking-wide">{card.label}</p>
            <h2 className={`mt-2 text-3xl font-bold ${card.color}`}>{card.value}</h2>
          </div>
        ))}
      </div>

      {/* SEARCH + ACTION BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <input
            type="text"
            placeholder="Search by customer, ID, service..."
            className="w-full md:w-1/2 rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <div className="flex flex-wrap gap-2">
            <button className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition">Filter</button>
            <button className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition">Export</button>
            <Link href="/customers/create" className="rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-md hover:from-indigo-700 hover:to-blue-600 transition">+ New Lead</Link>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-100 text-slate-600 text-sm uppercase tracking-wide">
            <tr>
              <th className="p-4">Customer Details</th>
              <th className="p-4">Services</th>
              <th className="p-4">Presales</th>
              <th className="p-4">Legal</th>
              <th className="p-4">Finance</th>
              <th className="p-4">Onboarding</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {customers.length > 0 ? (
              customers.map((customer) => {
                const activeServices = Object.entries(customer.serviceConfig)
                  .filter(([_key, cfg]) => cfg.enabled)
                  .map(([key]) => key.toUpperCase())
                  .join(", ");
                return (
                  <tr key={customer.id} className="border-t border-slate-200 hover:bg-slate-50 transition">
                    <td className="p-4">
                      <p className="font-semibold text-slate-900">{customer.formData.companyName || "Untitled Company"}</p>
                      <p className="text-sm text-slate-500">ID: {customer.id}</p>
                    </td>
                    <td className="p-4">
                      {activeServices ? (
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold tracking-wide text-blue-700">
                          {activeServices}
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold tracking-wide text-slate-500">
                          None
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-green-600 font-bold">✔</td>
                    <td className="p-4 text-yellow-500 font-bold">⏳</td>
                    <td className="p-4 text-slate-400 font-bold">○</td>
                    <td className="p-4 text-slate-400 font-bold">○</td>
                    <td className="p-4">
                      <Link
                        href={`/customers/view-contact/${customer.id}`}
                        className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700 transition"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr className="border-t border-slate-200 bg-slate-50">
                <td colSpan={7} className="p-8 text-center text-slate-500">
                  No customers found. Create a new lead to start the pipeline.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}