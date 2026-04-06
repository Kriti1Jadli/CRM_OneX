"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Contacts() {
  const router = useRouter();
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
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:flex md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Contacts</h1>
            <p className="mt-2 text-sm text-slate-500">Browse contact records created from company applications.</p>
          </div>
        </div>

        {customers.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
            <p className="text-lg font-semibold">No contacts available yet.</p>
            <p className="mt-2">Create a customer account first and then return here to view their contacts.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-slate-600 text-sm uppercase tracking-wide">
                <tr>
                  <th className="p-4">Contact ID</th>
                  <th className="p-4">Company Name</th>
                  <th className="p-4">Primary SPOC</th>
                  <th className="p-4">Primary Email</th>
                  <th className="p-4">Primary Phone</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-t border-slate-200 hover:bg-slate-50 transition cursor-pointer"
                    onClick={() => router.push(`/contacts/${customer.id}`)}
                  >
                    <td className="p-4 text-blue-600 font-medium">{customer.id}</td>
                    <td className="p-4 text-slate-900 font-semibold">{customer.formData.companyName || "Untitled Company"}</td>
                    <td className="p-4 text-slate-700">{customer.formData.contactPerson1 || "—"}</td>
                    <td className="p-4 text-slate-700">{customer.formData.customerSpocEmail1 || "—"}</td>
                    <td className="p-4 text-slate-700">{customer.formData.customerSpocNumber1 || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
