"use client";

import { useState } from "react";

export default function AppointmentForm({ selectedDoctor }: { selectedDoctor: any | null }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    notes: "",
    sms: true,
    emailConfirm: false,
    member: false,
  });

  const onChange = (k: string, v: any) => setForm((s) => ({ ...s, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const doctorInfo = selectedDoctor ? `${selectedDoctor.name} — ${selectedDoctor.available}` : "No doctor selected";

    const formDetails = `
Booking Details:

Doctor / Session: ${doctorInfo}
Patient Name: ${form.name}
Phone Number: ${form.phone}
Email: ${form.email || "N/A"}
Notes: ${form.notes || "N/A"}
Member: ${form.member ? "Yes" : "No"}
Send SMS Confirmation: ${form.sms ? "Yes" : "No"}
Send Email Confirmation: ${form.emailConfirm ? "Yes" : "No"}
`;

    alert(formDetails);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="text-sm text-gray-600 block mb-2">Selected Session</label>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-600">
          {selectedDoctor ? `${selectedDoctor.name} — ${selectedDoctor.available}` : "No doctor selected"}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-sm font-medium text-gray-700">Patient Information</h4>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">Member or Guest</span>
            <input type="checkbox" checked={form.member} onChange={(e) => onChange("member", e.target.checked)} className="w-5 h-5" />
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-700">Patient Name <span className="text-red-500">*</span></label>
            <input value={form.name} onChange={(e) => onChange("name", e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0B60E0] outline-none" />
          </div>

          <div>
            <label className="block text-sm text-gray-700">Phone Number <span className="text-red-500">*</span></label>
            <input value={form.phone} onChange={(e) => onChange("phone", e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0B60E0] outline-none" />
          </div>

          <div>
            <label className="block text-sm text-gray-700">Email</label>
            <input value={form.email} onChange={(e) => onChange("email", e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0B60E0] outline-none" />
          </div>

          <div>
            <label className="block text-sm text-gray-700">Notes / Special Requests</label>
            <textarea value={form.notes} onChange={(e) => onChange("notes", e.target.value)} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0B60E0] outline-none" />
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Confirmation Options</h4>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.sms} onChange={(e) => onChange("sms", e.target.checked)} className="w-4 h-4" />
          Send SMS Confirmation
        </label>
        <label className="flex items-center gap-2 text-sm mt-2">
          <input type="checkbox" checked={form.emailConfirm} onChange={(e) => onChange("emailConfirm", e.target.checked)} className="w-4 h-4" />
          Send Email Confirmation
        </label>
      </div>

      <div className="flex items-center justify-between mt-4">
        <button type="submit" className="px-6 py-2 rounded-full bg-gradient-to-r from-[#23DE4F] to-[#330FFB] text-white font-medium hover:opacity-95">
          Confirm Booking
        </button>
        <button type="button" className="text-sm text-gray-500 hover:underline">Cancel</button>
      </div>
    </form>
  );
}
