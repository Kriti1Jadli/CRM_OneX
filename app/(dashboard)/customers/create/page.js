"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

function FormField({ label, type = "text", value, onChange, options }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-bold mb-2 text-black">{label}</label>
      {type === "select" ? (
        <select
          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition duration-200 shadow-sm hover:shadow-md"
          value={value}
          onChange={onChange}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition duration-200 shadow-sm hover:shadow-md"
          type={type}
          value={value}
          onChange={onChange}
        />
      )}
    </div>
  );
}

function FormSection({ title, children }) {
  return (
    <div className="mb-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-rose-700 border-b-2 border-rose-200 pb-2">{title}</h2>
      {children}
    </div>
  );
}

const initialFormData = {
  accountManagerName: "",
  regionName: "",
  pssName: "",
  customerType: "",
  companyName: "",
  clientLocation: "",
  contactPerson1: "",
  jobTitle1: "",
  customerSpocNumber1: "",
  customerSpocEmail1: "",
  department1: "",
  contactPerson2: "",
  jobTitle2: "",
  customerSpocNumber2: "",
  customerSpocEmail2: "",
  department2: "",
  websiteUrl: "",
  industryType: "",
  panNumber: "",
  gstNumber: "",
  cinLlpIn: "",
  msmeNumber: "",
  planType: "",
  invoicingPeriod: "",
  agreementStatus: "",
  agreementDate: "",
  agreedPaymentTerm: "",
  mrr: "",
  pdcBg: "",
  approvedCreditLimit: "",
  channelPartner: "",
  accountValidity: "",
};

export default function CreateAccount() {
  const router = useRouter();
  const [formData, setFormData] = useState(initialFormData);
  const [serviceConfig, setServiceConfig] = useState({
    sms: { enabled: false, volume: "10k-100k", pricing: "prepaid" },
    whatsapp: { enabled: false, volume: "10k-100k", pricing: "payg" },
    voice: { enabled: false, minutes: "<5k", pricing: "payg" },
    rcs: { enabled: false, volume: "10k-100k", pricing: "prepaid" },
  });
  const [showForm, setShowForm] = useState(true);
  const [step, setStep] = useState(1);
  const [businessReg, setBusinessReg] = useState({ documentNumber: "", expiryDate: "" });
  const [taxInfo, setTaxInfo] = useState({ taxId: "", issuanceDate: "" });
  const [businessFile, setBusinessFile] = useState(null);
  const [gstFile, setGstFile] = useState(null);
  const [incorporationFile, setIncorporationFile] = useState(null);
  const [taxFile, setTaxFile] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const activeStepIndex = step - 1;

  const generateCustomerId = () => {
    if (typeof window === "undefined") {
      return `CUST-${Date.now()}`;
    }

    const stored = window.localStorage.getItem("customers") || "[]";
    const customers = JSON.parse(stored);
    const existingIds = new Set(customers.map((customer) => customer.id));

    const createId = () => {
      const randomPart = typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID().split("-")[0].toUpperCase()
        : Math.random().toString(36).slice(2, 8).toUpperCase();
      return `CUST-${randomPart}-${Date.now().toString().slice(-5)}`;
    };

    let id = createId();
    while (existingIds.has(id)) {
      id = createId();
    }

    return id;
  };

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const updateServiceConfig = (service, field, value) => {
    setServiceConfig((prev) => ({
      ...prev,
      [service]: {
        ...prev[service],
        [field]: value,
      },
    }));
  };

  const toggleService = (service) => {
    setServiceConfig((prev) => ({
      ...prev,
      [service]: {
        ...prev[service],
        enabled: !prev[service].enabled,
      },
    }));
  };

  const handleNextStep = (event) => {
    event.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }
  };

  const handlePrevStep = () => {
    if (step === 4) {
      setStep(3);
      return;
    }
    if (step === 3) {
      setStep(2);
      return;
    }
    if (step === 2) {
      setStep(1);
      return;
    }
  };

  const handleFileChange = (section) => (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (section === "business") {
      setBusinessFile(file);
    } else if (section === "gst") {
      setGstFile(file);
    } else if (section === "incorporation") {
      setIncorporationFile(file);
    } else {
      setTaxFile(file);
    }
  };

  const handleProceedToKyc = () => {
    const selectedServices = Object.values(serviceConfig).filter((cfg) => cfg.enabled).length;
    if (!selectedServices) {
      alert("Please enable at least one service before proceeding to KYC.");
      return;
    }
    setStep(3);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (step === 1) {
      const allFilled = Object.values(formData).every((value) => value.trim() !== "");
      if (!allFilled) {
        alert("Please fill all fields before proceeding to the next step.");
        return;
      }
      setStep(2);
      return;
    }

    if (step === 2) {
      handleProceedToKyc();
      return;
    }

    if (step === 3) {
      setStep(4);
      return;
    }

    if (step === 4) {
      const id = generateCustomerId();
      const payload = {
        id,
        formData,
        serviceConfig,
        businessReg,
        taxInfo,
        files: {
          business: businessFile?.name || null,
          gst: gstFile?.name || null,
          incorporation: incorporationFile?.name || null,
          tax: taxFile?.name || null,
        },
        status: "Pending Approval",
        submittedAt: new Date().toISOString(),
      };
      if (typeof window !== "undefined") {
        const existing = JSON.parse(window.localStorage.getItem("customers") || "[]");
        window.localStorage.setItem("customers", JSON.stringify([...existing, payload]));
      }
      setShowSuccessPopup(true);
      setTimeout(() => {
        setShowSuccessPopup(false);
        router.push("/customers/view-customer");
      }, 1500);
      return;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-rose-100 p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        {showSuccessPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 px-4 py-6">
            <div className="w-full max-w-md rounded-[28px] border border-rose-100 bg-white p-6 text-center shadow-2xl">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-black">Application Sent</h2>
              <p className="mt-2 text-sm text-black/70">Your application has been sent for approval. Redirecting to view contact page...</p>
            </div>
          </div>
        )}
        <div className="mb-8 rounded-2xl border border-rose-200 bg-white p-6 shadow-sm sticky top-0 z-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-rose-700">Create CPaaS Account</h1>
              {/* <p className="mt-2 text-black-600">Form is now visible below inside the pipeline section.</p> */}
            </div>
          </div>

          <div className="mt-6 flex gap-3 text-sm font-bold text-black">
            {[
              "Account Selection",
              "Service Selection",
              "KYC & Docs",
              "Review & Approval",
            ].map((stepName, idx) => {
              const isActive = idx === activeStepIndex;
              const isCompleted = idx < activeStepIndex;
              return (
                <div key={stepName} className="flex items-center gap-2 cursor-pointer" onClick={() => setStep(idx + 1)}>
                  <span
                    className={`h-7 w-7 rounded-full flex items-center justify-center ${isActive ? "bg-rose-600 text-white" : isCompleted ? "bg-emerald-500 text-white" : "bg-gray-200 text-black"}`}
                  >
                    {idx + 1}
                  </span>
                  <span className="font-bold text-black">{stepName}</span>
                  {idx < 3 && <span className="h-px w-6 bg-gray-300" />}
                </div>
              );
            })}
          </div>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="rounded-2xl border border-rose-200 bg-gradient-to-br from-gray-50 to-white p-8 shadow-xl transition-all">
            {step === 1 && (
              <>
                <FormSection title="Details of the Engagement">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <FormField label="ACCOUNT MANAGER NAME" value={formData.accountManagerName} onChange={handleChange("accountManagerName")} />
                    <FormField label="REGION NAME" value={formData.regionName} onChange={handleChange("regionName")} />
                    <FormField label="PSS NAME" value={formData.pssName} onChange={handleChange("pssName")} />
                  </div>
                </FormSection>

                <FormSection title="Client Information">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      label="CUSTOMER TYPE"
                      type="select"
                      value={formData.customerType}
                      onChange={handleChange("customerType")}
                      options={[
                        { value: "", label: "Select Customer Type" },
                        { value: "government", label: "Government" },
                        { value: "proprietorship", label: "Proprietorship" },
                        { value: "aggregator", label: "Aggregator" },
                        { value: "enterprise", label: "Enterprise" },
                      ]}
                    />
                    <FormField label="COMPANY NAME" value={formData.companyName} onChange={handleChange("companyName")} />
                    <FormField label="CLIENT LOCATION" value={formData.clientLocation} onChange={handleChange("clientLocation")} />
                    <FormField label="CONTACT PERSON NAME (SPOC 1)" value={formData.contactPerson1} onChange={handleChange("contactPerson1")} />
                    <FormField label="JOB TITLE" value={formData.jobTitle1} onChange={handleChange("jobTitle1")} />
                    <FormField label="CUSTOMER SPOC NUMBER" value={formData.customerSpocNumber1} onChange={handleChange("customerSpocNumber1")} />
                    <FormField label="CUSTOMER SPOC EMAIL ID" type="email" value={formData.customerSpocEmail1} onChange={handleChange("customerSpocEmail1")} />
                    <FormField label="DEPARTMENT" value={formData.department1} onChange={handleChange("department1")} />
                    <FormField label="CONTACT PERSON NAME (SPOC 2)" value={formData.contactPerson2} onChange={handleChange("contactPerson2")} />
                    <FormField label="JOB TITLE" value={formData.jobTitle2} onChange={handleChange("jobTitle2")} />
                    <FormField label="CUSTOMER SPOC NUMBER" value={formData.customerSpocNumber2} onChange={handleChange("customerSpocNumber2")} />
                    <FormField label="CUSTOMER SPOC EMAIL ID" type="email" value={formData.customerSpocEmail2} onChange={handleChange("customerSpocEmail2")} />
                    <FormField label="DEPARTMENT" value={formData.department2} onChange={handleChange("department2")} />
                    <FormField label="WEBSITE URL" type="url" value={formData.websiteUrl} onChange={handleChange("websiteUrl")} />
                    <FormField label="INDUSTRY TYPE" value={formData.industryType} onChange={handleChange("industryType")} />
                    <FormField label="PAN NUMBER" value={formData.panNumber} onChange={handleChange("panNumber")} />
                    <FormField label="GST NUMBER" value={formData.gstNumber} onChange={handleChange("gstNumber")} />
                    <FormField label="CIN/LLPIN" value={formData.cinLlpIn} onChange={handleChange("cinLlpIn")} />
                    <FormField label="MSME NUMBER" value={formData.msmeNumber} onChange={handleChange("msmeNumber")} />
                  </div>
                </FormSection>

                <FormSection title="Billing Information">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      label="PLAN TYPE"
                      type="select"
                      value={formData.planType}
                      onChange={handleChange("planType")}
                      options={[
                        { value: "", label: "Select Plan Type" },
                        { value: "prepaid", label: "Prepaid" },
                        { value: "postpaid", label: "Postpaid" },
                      ]}
                    />
                    <FormField label="INVOICING PERIOD (In Days)" value={formData.invoicingPeriod} onChange={handleChange("invoicingPeriod")} />
                    <FormField label="AGREEMENT STATUS" value={formData.agreementStatus} onChange={handleChange("agreementStatus")} />
                    <FormField label="AGREEMENT DATE" type="date" value={formData.agreementDate} onChange={handleChange("agreementDate")} />
                    <FormField label="AGREED PAYMENT TERM" value={formData.agreedPaymentTerm} onChange={handleChange("agreedPaymentTerm")} />
                    <FormField label="MRR (Monthly Recurring Revenue)" value={formData.mrr} onChange={handleChange("mrr")} />
                    <FormField label="PDC/BG (in INR)" value={formData.pdcBg} onChange={handleChange("pdcBg")} />
                    <FormField label="APPROVED CREDIT LIMIT" value={formData.approvedCreditLimit} onChange={handleChange("approvedCreditLimit")} />
                    <FormField label="CHANNEL PARTNER" value={formData.channelPartner} onChange={handleChange("channelPartner")} />
                    <FormField label="ACCOUNT VALIDITY" value={formData.accountValidity} onChange={handleChange("accountValidity")} />
                  </div>
                </FormSection>
              </>
            )}

            {step === 2 && (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-4">
                  <FormSection title="Service & Pricing">
                    <div className="space-y-4">
                      {[
                        {
                          key: "sms",
                          label: "SMS Services",
                          subtitle: "Global A2P Messaging",
                          options: ["10k-100k", "100k-500k", "500k+"],
                          pricingOptions: ["prepaid", "postpaid"],
                        },
                        {
                          key: "whatsapp",
                          label: "WhatsApp Business",
                          subtitle: "Rich Conversations & Media",
                          options: ["10k-100k", "100k-500k", "500k+"],
                          pricingOptions: ["pay-as-you-go", "committed"],
                        },
                        {
                          key: "voice",
                          label: "Voice Services",
                          subtitle: "Programmable Voice & VoIP",
                          options: ["<5k", "5k-20k", ">20k"],
                          pricingOptions: ["pay-as-you-go", "committed"],
                        },
                        {
                          key: "rcs",
                          label: "RCS Messaging",
                          subtitle: "Rich Communication Services",
                          options: ["10k-100k", "100k-500k", "500k+"],
                          pricingOptions: ["prepaid", "postpaid"],
                        },
                      ].map((item) => {
                        const current = serviceConfig[item.key];
                        const isSms = item.key === "sms";
                        return (
                          <div
                            key={item.key}
                            className={`rounded-3xl border p-5 ${isSms ? "border-rose-200 bg-rose-50 shadow-sm" : "border-gray-200 bg-gray-50"}`}
                          >
                            <div className="flex items-center justify-between gap-4">
                              <div>
                                <h3 className="text-lg font-bold text-black">{item.label}</h3>
                                <p className="text-sm font-bold text-black">{item.subtitle}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => toggleService(item.key)}
                                aria-label={current.enabled ? "Disable service" : "Enable service"}
                                className={`relative inline-flex h-9 min-w-[100px] rounded-full px-2 transition duration-200 shadow-sm focus:outline-none focus:ring-3 focus:ring-rose-200 ${current.enabled ? "bg-rose-600" : "bg-rose-100"}`}
                              >
                                <span className={`absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow ${current.enabled ? "translate-x-4" : "-translate-x-4"} transition-transform duration-200`} />
                              </button>
                            </div>

                            {current.enabled && (
                              <div className={`mt-5 rounded-3xl border p-5 bg-white ${isSms ? "border-rose-100 shadow-sm" : "border-rose-100"}`}>
                                <div className="grid gap-4 md:grid-cols-2">
                                  <label className="block text-sm font-bold text-black">
                                    {item.key === "voice" ? "Estimated Minutes / Month" : "Estimated Monthly Volume"}
                                    <select
                                      value={item.key === "voice" ? current.minutes : current.volume}
                                      onChange={(e) => updateServiceConfig(item.key, item.key === "voice" ? "minutes" : "volume", e.target.value)}
                                      className="mt-3 w-full rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                                    >
                                      {item.options.map((op) => (
                                        <option key={op} value={op}>
                                          {op}
                                        </option>
                                      ))}
                                    </select>
                                  </label>

                                  <label className="block text-sm font-bold text-black">
                                    Pricing Model
                                    <div className="mt-3 flex flex-wrap gap-3">
                                      {item.pricingOptions.map((priceType) => (
                                        <button
                                          key={priceType}
                                          type="button"
                                          onClick={() => updateServiceConfig(item.key, "pricing", priceType)}
                                          className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${current.pricing === priceType ? "bg-rose-600 border-rose-600 text-white" : "bg-white border-rose-200 text-black hover:bg-rose-50"}`}
                                        >
                                          {priceType[0].toUpperCase() + priceType.slice(1)}
                                        </button>
                                      ))}
                                    </div>
                                  </label>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </FormSection>
                </div>

                <div className="space-y-4">
                  <div className="rounded-xl border border-black-200 bg-white p-4">
                    <h3 className="mb-2 text-lg font-bold text-black">Selection Summary</h3>
                    {Object.entries(serviceConfig)
                      .filter(([_key, cfg]) => cfg.enabled)
                      .map(([key, cfg]) => {
                        const names = { sms: "SMS Services", whatsapp: "WhatsApp", voice: "Voice Services", rcs: "RCS Messaging" };
                        return (
                          <div key={key} className="mb-2 rounded-lg border border-gray-100 p-3 bg-gray-50">
                            <div className="flex justify-between text-sm font-bold text-black">
                              <span>{names[key]}</span>
                              <span className="text-rose-600">Active</span>
                            </div>
                            <div className="text-xs font-bold text-black">
                              <p>Tier: {cfg.volume || cfg.minutes}</p>
                              <p>Billing: {cfg.pricing}</p>
                            </div>
                          </div>
                        );
                      })}
                    <div className="mt-4 border-t border-gray-200 pt-3 text-sm font-bold text-black">
                      <p className="font-semibold text-black">Estimated Base</p>
                      <p>$467.00 +</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleProceedToKyc}
                    className="w-full rounded-lg bg-blue-600 px-3 py-2 text-white font-semibold hover:bg-blue-700 transition"
                  >
                    Confirm & Proceed
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-lg font-bold text-black">1. Certificate of Incorporation</p>
                      <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-800">NO EXPIRY / IN PROGRESS</span>
                      <p className="mt-2 text-sm text-black/70">Upload your Certificate of Incorporation issued by government authorities.</p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <FormField
                      label="DOCUMENT NUMBER"
                      value={businessReg.documentNumber}
                      onChange={(e) => setBusinessReg((prev) => ({ ...prev, documentNumber: e.target.value }))}
                    />
                    <FormField
                      label="EXPIRY DATE"
                      type="date"
                      value={businessReg.expiryDate}
                      onChange={(e) => setBusinessReg((prev) => ({ ...prev, expiryDate: e.target.value }))}
                    />
                  </div>

                  <div className="mt-6 rounded-3xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-black/70">
                    <label className="mx-auto flex max-w-xs cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl bg-white px-6 py-8 text-black shadow-sm hover:border-rose-300">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-700">↑</span>
                      <span className="font-semibold">Upload Certificate of Incorporation</span>
                      <span className="text-xs">PDF, JPG or PNG (max. 10MB)</span>
                      <input type="file" accept="application/pdf,image/png,image/jpeg" onChange={handleFileChange("incorporation")} className="hidden" />
                    </label>
                  </div>

                  {incorporationFile && (
                    <div className="mt-4 rounded-xl bg-rose-50 p-4 text-sm text-black">
                      <p className="font-semibold">{incorporationFile.name}</p>
                      <p className="text-xs text-black/70">{(incorporationFile.size / 1024 / 1024).toFixed(1)} MB · Uploaded just now</p>
                    </div>
                  )}
                </div>

                <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-lg font-bold text-black">2. GST Certificate</p>
                      <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">REQUIRED (UPLOAD)</span>
                      <p className="mt-2 text-sm text-black/70">Upload your GST registration certificate for compliance verification.</p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <FormField
                      label="GST NUMBER"
                      value={formData.gstNumber}
                      onChange={handleChange("gstNumber")}
                    />
                    <FormField
                      label="ISSUANCE DATE"
                      type="date"
                      value={taxInfo.issuanceDate}
                      onChange={(e) => setTaxInfo((prev) => ({ ...prev, issuanceDate: e.target.value }))}
                    />
                  </div>

                  <div className="mt-6 rounded-3xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-black/70">
                    <label className="mx-auto flex max-w-xs cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl bg-white px-6 py-8 text-black shadow-sm hover:border-amber-300">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700">↑</span>
                      <span className="font-semibold">Upload GST Certificate</span>
                      <span className="text-xs">PDF, JPG or PNG (max. 10MB)</span>
                      <input type="file" accept="application/pdf,image/png,image/jpeg" onChange={handleFileChange("gst")} className="hidden" />
                    </label>
                  </div>

                  {gstFile && (
                    <div className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-black">
                      <p className="font-semibold">{gstFile.name}</p>
                      <p className="text-xs text-black/70">{(gstFile.size / 1024 / 1024).toFixed(1)} MB · Uploaded just now</p>
                    </div>
                  )}
                </div>

                <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-lg font-bold text-black">3. Tax Identification</p>
                      <span className="inline-flex items-center rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-800">REQUIRED (UPLOAD)</span>
                      <p className="mt-2 text-sm text-black/70">A valid VAT certificate, PAN card, or Tax ID document corresponding to your region.</p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <FormField
                      label="TAX ID / PAN NUMBER"
                      value={taxInfo.taxId}
                      onChange={(e) => setTaxInfo((prev) => ({ ...prev, taxId: e.target.value }))}
                    />
                    <FormField
                      label="ISSUANCE DATE"
                      type="date"
                      value={taxInfo.issuanceDate}
                      onChange={(e) => setTaxInfo((prev) => ({ ...prev, issuanceDate: e.target.value }))}
                    />
                  </div>

                  <div className="mt-6 rounded-3xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-black/70">
                    <label className="mx-auto flex max-w-xs cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl bg-white px-6 py-8 text-black shadow-sm hover:border-rose-300">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-700">↑</span>
                      <span className="font-semibold">Upload Tax Document</span>
                      <span className="text-xs">Supported formats: PDF, PNG, JPG.</span>
                      <input type="file" accept="application/pdf,image/png,image/jpeg" onChange={handleFileChange("tax")} className="hidden" />
                    </label>
                  </div>

                  {taxFile && (
                    <div className="mt-4 rounded-xl bg-rose-50 p-4 text-sm text-black">
                      <p className="font-semibold">{taxFile.name}</p>
                      <p className="text-xs text-black/70">{(taxFile.size / 1024 / 1024).toFixed(1)} MB · Uploaded just now</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 4 && (
                  <div className="space-y-6">
                    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                        <div>
                          <h2 className="text-2xl font-bold text-black">Review & Submit</h2>
                          <p className="mt-2 text-sm text-black/70">Verify your application and service selections before the final submission.</p>
                        </div>
                        <button
                          type="button"
                          className="rounded-lg border border-rose-300 bg-white px-4 py-2 text-rose-700 hover:bg-rose-50"
                        >
                          Save Draft
                        </button>
                      </div>
                    </div>

                    <div className="grid gap-6 xl:grid-cols-2">
                      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h3 className="text-xl font-bold text-black">Account Info</h3>
                        <div className="mt-4 grid gap-4 text-sm text-black/80">
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-black/50">Company Name</p>
                            <p className="font-semibold text-black">{formData.companyName || "—"}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-black/50">Customer Type</p>
                            <p>{formData.customerType || "—"}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-black/50">Region</p>
                            <p>{formData.regionName || "—"}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-black/50">PSS Name</p>
                            <p>{formData.pssName || "—"}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-black/50">Website</p>
                            <p>{formData.websiteUrl || "—"}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-black/50">Industry</p>
                            <p>{formData.industryType || "—"}</p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h3 className="text-xl font-bold text-black">Primary Contacts</h3>
                        <div className="mt-4 grid gap-4 text-sm text-black/80">
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-black/50">Primary SPOC</p>
                            <p className="font-semibold text-black">{formData.contactPerson1 || "—"}</p>
                            <p>{formData.jobTitle1 || "—"}</p>
                            <p>{formData.customerSpocNumber1 || "—"}</p>
                            <p>{formData.customerSpocEmail1 || "—"}</p>
                            <p>{formData.department1 || "—"}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-black/50">Secondary SPOC</p>
                            <p className="font-semibold text-black">{formData.contactPerson2 || "—"}</p>
                            <p>{formData.jobTitle2 || "—"}</p>
                            <p>{formData.customerSpocNumber2 || "—"}</p>
                            <p>{formData.customerSpocEmail2 || "—"}</p>
                            <p>{formData.department2 || "—"}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-6 xl:grid-cols-2">
                      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h3 className="text-xl font-bold text-black">Service Selection</h3>
                        <div className="mt-4 space-y-3 text-sm text-black/80">
                          {Object.entries(serviceConfig)
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
                          {Object.values(serviceConfig).every((cfg) => !cfg.enabled) && <p className="text-sm text-black/70">No services selected yet.</p>}
                        </div>
                      </div>

                      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h3 className="text-xl font-bold text-black">Billing & Agreement</h3>
                        <div className="mt-4 grid gap-4 text-sm text-black/80">
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-black/50">Plan Type</p>
                            <p>{formData.planType || "—"}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-black/50">Invoicing Period</p>
                            <p>{formData.invoicingPeriod || "—"}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-black/50">Agreement Status</p>
                            <p>{formData.agreementStatus || "—"}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-black/50">Agreement Date</p>
                            <p>{formData.agreementDate || "—"}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-black/50">Payment Term</p>
                            <p>{formData.agreedPaymentTerm || "—"}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-black/50">MRR</p>
                            <p>{formData.mrr || "—"}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-black/50">PDC/BG</p>
                            <p>{formData.pdcBg || "—"}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-black/50">Approved Credit Limit</p>
                            <p>{formData.approvedCreditLimit || "—"}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-black/50">Channel Partner</p>
                            <p>{formData.channelPartner || "—"}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-black/50">Account Validity</p>
                            <p>{formData.accountValidity || "—"}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-6 xl:grid-cols-2">
                      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h3 className="text-xl font-bold text-black">KYC Documentation</h3>
                        <div className="mt-4 space-y-3 text-sm text-black/80">
                          {incorporationFile ? (
                            <div className="rounded-2xl bg-emerald-50 p-4">
                              <p className="font-semibold text-black">Certificate of Incorporation</p>
                              <p className="text-xs text-black/70">{incorporationFile.name}</p>
                            </div>
                          ) : (
                            <p className="text-sm text-black/70">Certificate of Incorporation not uploaded</p>
                          )}

                          {gstFile ? (
                            <div className="rounded-2xl bg-amber-50 p-4">
                              <p className="font-semibold text-black">GST Certificate</p>
                              <p className="text-xs text-black/70">{gstFile.name}</p>
                            </div>
                          ) : (
                            <p className="text-sm text-black/70">GST Certificate not uploaded</p>
                          )}

                          {businessFile ? (
                            <div className="rounded-2xl bg-rose-50 p-4">
                              <p className="font-semibold text-black">Business Registration Document</p>
                              <p className="text-xs text-black/70">{businessFile.name}</p>
                            </div>
                          ) : (
                            <p className="text-sm text-black/70">Business document not uploaded</p>
                          )}

                          {taxFile ? (
                            <div className="rounded-2xl bg-rose-50 p-4">
                              <p className="font-semibold text-black">Tax Document</p>
                              <p className="text-xs text-black/70">{taxFile.name}</p>
                            </div>
                          ) : (
                            <p className="text-sm text-black/70">Tax document not uploaded</p>
                          )}
                        </div>
                      </div>

                      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h3 className="text-xl font-bold text-black">Registration Details</h3>
                        <div className="mt-4 grid gap-4 text-sm text-black/80">
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-black/50">Registration Document</p>
                            <p>{businessReg.documentNumber || "—"}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-black/50">Expiry Date</p>
                            <p>{businessReg.expiryDate || "—"}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-black/50">GST Number</p>
                            <p>{formData.gstNumber || "—"}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-black/50">Tax ID / PAN</p>
                            <p>{taxInfo.taxId || "—"}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-black/50">Tax Issuance Date</p>
                            <p>{taxInfo.issuanceDate || "—"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

            <div className="mt-8 flex justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="rounded-lg border border-rose-300 px-5 py-2.5 text-rose-700 hover:bg-rose-50 transition"
                >
                  Back
                </button>
              ) : (
                <div />
              )}

              <button
                type="submit"
                className="rounded-lg bg-gradient-to-r from-rose-600 to-red-500 px-5 py-2 font-semibold text-white shadow-sm hover:from-rose-700 hover:to-red-600 transition"
              >
                {step === 1 ? "Next: Service Selection" : step === 2 ? "Next: KYC & Docs" : step === 3 ? "Next: Review & Submit" : "Submit for Approval"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
