"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function ContactDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined" && id) {
      const raw = window.localStorage.getItem("customers");
      if (raw) {
        const customers = JSON.parse(raw);
        const found = customers.find((item) => item.id === id);
        setCustomer(found);
      }
    }
  }, [id]);

  const formatValue = (label, value) => (
    <div className="space-y-1">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="text-sm text-slate-900">{value || "—"}</p>
    </div>
  );

  if (!customer) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 md:p-10">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Contact Details</h1>
                <p className="mt-2 text-sm text-slate-500">Customer contact details could not be found.</p>
              </div>
              <button
                type="button"
                onClick={() => router.push("/contacts")}
                className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              >
                Back to Contacts
              </button>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
            <p className="text-lg font-semibold">Contact record not found.</p>
            <p className="mt-2">The requested contact ID does not exist or has been removed.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{customer.formData.companyName || "Untitled Company"}</h1>
              <p className="mt-2 text-sm text-slate-500">Contact ID: {customer.id}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/contacts" className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50">
                Back to Contacts
              </Link>
              <Link href="/customers/view-customer" className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700">
                View Customer
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Primary Contact</h2>
            <div className="mt-4 grid gap-4">
              {formatValue("Primary SPOC", customer.formData.contactPerson1)}
              {formatValue("Job Title", customer.formData.jobTitle1)}
              {formatValue("Phone", customer.formData.customerSpocNumber1)}
              {formatValue("Email", customer.formData.customerSpocEmail1)}
              {formatValue("Department", customer.formData.department1)}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Secondary Contact</h2>
            <div className="mt-4 grid gap-4">
              {formatValue("Secondary SPOC", customer.formData.contactPerson2)}
              {formatValue("Job Title", customer.formData.jobTitle2)}
              {formatValue("Phone", customer.formData.customerSpocNumber2)}
              {formatValue("Email", customer.formData.customerSpocEmail2)}
              {formatValue("Department", customer.formData.department2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
