"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "../../../../components/ui/Button";
import Card from "../../../../components/ui/Card";

export default function ViewCustomer() {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-rose-100 p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        <Card className="mb-8 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-rose-700">View Customers</h1>
            <p className="mt-2 text-sm text-black/70">Review all submitted customer applications. Click on a row to view details.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" href="/customers/create">
              Create New
            </Button>
            {/* <Button variant="primary" href="/customers">
              Customer List
            </Button> */}
          </div>
        </Card>

        {customers.length === 0 ? (
          <Card className="p-10 text-center text-black/70">
            <p className="text-lg font-semibold">No customers found.</p>
            <p className="mt-2">Create a new customer application to view details here.</p>
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-100 text-black/70 text-sm uppercase tracking-wide">
                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">Company Name</th>
                  <th className="p-4">Services</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Submitted At</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => {
                  const activeServices = Object.entries(customer.serviceConfig)
                    .filter(([_key, cfg]) => cfg.enabled)
                    .map(([key]) => key.toUpperCase())
                    .join(", ");
                  return (
                    <tr
                      key={customer.id}
                      onClick={() => router.push(`/customers/view-customer/${customer.id}`)}
                      className="border-t border-gray-200 hover:bg-gray-50 transition cursor-pointer"
                    >
                      <td className="p-4 text-blue-600 hover:underline">
                        {customer.id}
                      </td>
                      <td className="p-4 text-black/80 font-medium">
                        {customer.formData.companyName || "Untitled Company"}
                      </td>
                      <td className="p-4">
                        {activeServices ? (
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold tracking-wide text-blue-700">
                            {activeServices}
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold tracking-wide text-gray-500">
                            None
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                          {customer.status || "Pending"}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {new Date(customer.submittedAt).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        )}
      </div>
    </div>
  );
}
