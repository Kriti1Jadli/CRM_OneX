"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function CustomerDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined" && id) {
      const raw = window.localStorage.getItem("customers");
      if (raw) {
        const customers = JSON.parse(raw);
        const found = customers.find(c => c.id === id);
        setCustomer(found);
      }
    }
  }, [id]);

  const deleteCustomer = () => {
    if (!window.confirm("Are you sure you want to delete this customer?")) {
      return;
    }
    const raw = window.localStorage.getItem("customers");
    const existing = raw ? JSON.parse(raw) : [];
    const filtered = existing.filter((customer) => customer.id !== id);
    window.localStorage.setItem("customers", JSON.stringify(filtered));
    router.push("/customers/view-customer");
  };

  const formatValue = (label, value) => (
    <div>
      <p className="text-xs uppercase tracking-[0.2em] text-black/50">{label}</p>
      <p>{value || "—"}</p>
    </div>
  );

  if (!customer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-rose-100 p-6 md:p-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-rose-700">Customer Details</h1>
              <p className="mt-2 text-sm text-black/70">Loading customer details...</p>
            </div>
            <Link href="/customers/view-customer" className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700">
              Back to List
            </Link>
          </div>
          <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center text-black/70 shadow-sm">
            <p className="text-lg font-semibold">Customer not found.</p>
            <p className="mt-2">The customer with ID {id} does not exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-rose-100 p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-rose-700">Customer Details</h1>
            <p className="mt-2 text-sm text-black/70">Detailed view of customer application.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/customers/create" className="rounded-full border border-rose-300 bg-white px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50">
              Create New
            </Link>
            <button
              type="button"
              onClick={deleteCustomer}
              className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
            >
              Delete Customer
            </button>
            <Link href="/customers/view-customer" className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700">
              Back to List
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-black">{customer.formData.companyName || "Untitled Company"}</h2>
              <p className="mt-2 text-sm text-black/70">ID: {customer.id} • Status: {customer.status} • Submitted: {new Date(customer.submittedAt).toLocaleString()}</p>
            </div>
            <div className="rounded-3xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
              Pending Approval
            </div>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-2">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold text-black">Account Info</h3>
              <div className="mt-4 grid gap-4 text-sm text-black/80">
                {formatValue("Company Name", customer.formData.companyName)}
                {formatValue("Customer Type", customer.formData.customerType)}
                {formatValue("Region", customer.formData.regionName)}
                {formatValue("PSS Name", customer.formData.pssName)}
                {formatValue("Website", customer.formData.websiteUrl)}
                {formatValue("Industry", customer.formData.industryType)}
                {formatValue("PAN Number", customer.formData.panNumber)}
                {formatValue("GST Number", customer.formData.gstNumber)}
                {formatValue("CIN/LLPIN", customer.formData.cinLlpIn)}
                {formatValue("MSME Number", customer.formData.msmeNumber)}
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold text-black">Primary Contacts</h3>
              <div className="mt-4 grid gap-4 text-sm text-black/80">
                {formatValue("Primary SPOC", customer.formData.contactPerson1)}
                {formatValue("Job Title", customer.formData.jobTitle1)}
                {formatValue("Phone", customer.formData.customerSpocNumber1)}
                {formatValue("Email", customer.formData.customerSpocEmail1)}
                {formatValue("Department", customer.formData.department1)}
                {formatValue("Secondary SPOC", customer.formData.contactPerson2)}
                {formatValue("Job Title", customer.formData.jobTitle2)}
                {formatValue("Phone", customer.formData.customerSpocNumber2)}
                {formatValue("Email", customer.formData.customerSpocEmail2)}
                {formatValue("Department", customer.formData.department2)}
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-2">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold text-black">Service Selection</h3>
              <div className="mt-4 space-y-3 text-sm text-black/80">
                {Object.entries(customer.serviceConfig)
                  .filter(([_key, cfg]) => cfg.enabled)
                  .map(([key, cfg]) => {
                    const names = { sms: "SMS Gateway", whatsapp: "WhatsApp API", voice: "Voice & IVR", rcs: "RCS Messaging" };
                    return (
                      <div key={key} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                        <div className="flex items-center justify-between gap-3 text-sm font-bold text-black">
                          <span>{names[key]}</span>
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">Selected</span>
                        </div>
                        <div className="mt-2 text-xs text-black/70">
                          <p>{key === "voice" ? `Minutes: ${cfg.minutes}` : `Volume: ${cfg.volume}`}</p>
                          <p>Pricing: {cfg.pricing}</p>
                        </div>
                      </div>
                    );
                  })}
                {Object.values(customer.serviceConfig).every((cfg) => !cfg.enabled) && <p className="text-sm text-black/70">No services selected.</p>}
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold text-black">Billing & Agreement</h3>
              <div className="mt-4 grid gap-4 text-sm text-black/80">
                {formatValue("Plan Type", customer.formData.planType)}
                {formatValue("Invoicing Period", customer.formData.invoicingPeriod)}
                {formatValue("Agreement Status", customer.formData.agreementStatus)}
                {formatValue("Agreement Date", customer.formData.agreementDate)}
                {formatValue("Payment Term", customer.formData.agreedPaymentTerm)}
                {formatValue("MRR", customer.formData.mrr)}
                {formatValue("PDC/BG", customer.formData.pdcBg)}
                {formatValue("Approved Credit Limit", customer.formData.approvedCreditLimit)}
                {formatValue("Channel Partner", customer.formData.channelPartner)}
                {formatValue("Account Validity", customer.formData.accountValidity)}
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-2">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold text-black">KYC Documentation</h3>
              <div className="mt-4 space-y-3 text-sm text-black/80">
                {customer.files.incorporation ? (
                  <div className="rounded-2xl bg-emerald-50 p-4">
                    <p className="font-semibold text-black">Certificate of Incorporation</p>
                    <p className="text-xs text-black/70">{customer.files.incorporation}</p>
                  </div>
                ) : (
                  <p className="text-sm text-black/70">Certificate of Incorporation not uploaded</p>
                )}
                {customer.files.gst ? (
                  <div className="rounded-2xl bg-amber-50 p-4">
                    <p className="font-semibold text-black">GST Certificate</p>
                    <p className="text-xs text-black/70">{customer.files.gst}</p>
                  </div>
                ) : (
                  <p className="text-sm text-black/70">GST Certificate not uploaded</p>
                )}
                {customer.files.business ? (
                  <div className="rounded-2xl bg-rose-50 p-4">
                    <p className="font-semibold text-black">Business Registration Document</p>
                    <p className="text-xs text-black/70">{customer.files.business}</p>
                  </div>
                ) : (
                  <p className="text-sm text-black/70">Business registration document not uploaded</p>
                )}
                {customer.files.tax ? (
                  <div className="rounded-2xl bg-rose-50 p-4">
                    <p className="font-semibold text-black">Tax Document</p>
                    <p className="text-xs text-black/70">{customer.files.tax}</p>
                  </div>
                ) : (
                  <p className="text-sm text-black/70">Tax document not uploaded</p>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold text-black">Registration Details</h3>
              <div className="mt-4 grid gap-4 text-sm text-black/80">
                {formatValue("Document Number", customer.businessReg.documentNumber)}
                {formatValue("Expiry Date", customer.businessReg.expiryDate)}
                {formatValue("GST Number", customer.formData.gstNumber)}
                {formatValue("Tax ID / PAN", customer.taxInfo.taxId)}
                {formatValue("Tax Issuance Date", customer.taxInfo.issuanceDate)}
                {formatValue("Submitted At", new Date(customer.submittedAt).toLocaleString())}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}