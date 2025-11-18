"use client";

import { useState } from "react";
import EntryList from "./EntryList";

interface Entry {
  id: string;
  doctor: string;
  specialization: string;
  dateTime: string;
  patientName: string;
  patientNIC: string;
  patientPhone: string;
  patientEmail: string;
  paymentMethod: string;
  sltPhone: string;
  date: string;
  time: string;
}

export default function ManualEntryForm() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    doctor: "",
    specialization: "",
    dateTime: "",
    patientName: "",
    patientNIC: "",
    patientPhone: "",
    patientEmail: "",
    paymentMethod: "Add to Bill",
    sltPhone: "",
    date: "",
    time: "",
  });

  const doctors = [
    "Dr. Saman Perera",
    "Dr. Pawan Fernando",
    "Dr. Kamal Perera",
    "Dr. Pasan Silva",
  ];

  const specializations = [
    "Cardiologist",
    "Neurologist",
    "Pediatrician",
    "ENT Specialist",
  ];

  const update = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const addEntry = () => {
    if (!form.doctor || !form.specialization || !form.dateTime) {
      alert("Please fill Doctor, Specialization and Date & Time fields.");
      return;
    }

    const newEntry = {
      ...form,
      id: Date.now().toString(),
    };

    setEntries([...entries, newEntry]);
    setForm({
      doctor: "",
      specialization: "",
      dateTime: "",
      patientName: "",
      patientNIC: "",
      patientPhone: "",
      patientEmail: "",
      paymentMethod: "Add to Bill",
      sltPhone: "",
      date: "",
      time: "",
    });
    setShowForm(false);
  };

  const validateAll = () => {
    if (entries.length === 0) {
      alert("No appointments to validate!");
      return;
    }
    alert("All appointments validated successfully!");
  };

  const bookAll = () => {
    if (entries.length === 0) {
      alert("No appointments to book!");
      return;
    }
    alert(`Booking ${entries.length} appointment(s)...`);
  };

  return (
    <div className="space-y-6">
      {/* Top Section */}
      <div className="bg-green-50 p-5 rounded-xl border border-green-200">
        <div className="grid grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Doctor
            </label>
            <select
              value={form.doctor}
              onChange={(e) => update("doctor", e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm bg-white text-gray-700 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
            >
              <option value="">Select Doctor</option>
              {doctors.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Specialization
            </label>
            <select
              value={form.specialization}
              onChange={(e) => update("specialization", e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm bg-white text-gray-700 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
            >
              <option value="">Select Specialization</option>
              {specializations.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Date & Time
            </label>
            <input
              type="text"
              value={form.dateTime}
              onChange={(e) => update("dateTime", e.target.value)}
              placeholder="dd/mm/yy     --:-- --"
              className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm bg-white text-gray-700 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
            />
          </div>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="mt-5 px-6 py-2.5 rounded-md bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold text-sm hover:shadow-lg hover:from-green-600 hover:to-blue-700 transition-all"
        >
          + Add Entry
        </button>
      </div>

      {/* No Entries Yet */}
      {entries.length === 0 && !showForm && (
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-200">
          <div className="w-20 h-20 mx-auto mb-4 text-gray-300">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-xl font-bold text-gray-800 mb-2">No Entries Yet</p>
          <p className="text-sm text-gray-500">Add your first appointment using the form above</p>
        </div>
      )}

      {/* Expandable Form */}
      {showForm && (
        <div className="p-5 border border-gray-200 rounded-xl bg-white shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="font-semibold text-gray-800 text-base">
                {entries.length + 1}. Appointment #{entries.length + 1}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Entry ID: {Date.now()} • {form.dateTime || '12/12/23 • 9:27PM'}
              </p>
            </div>
            <button
              onClick={() => setShowForm(false)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded transition"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-500 font-medium mb-1.5">Doctor</label>
              <select
                value={form.doctor}
                onChange={(e) => update("doctor", e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white text-gray-700 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              >
                <option value="">Select Doctor</option>
                {doctors.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-500 font-medium mb-1.5">Patient Name</label>
              <input
                type="text"
                value={form.patientName}
                onChange={(e) => update("patientName", e.target.value)}
                placeholder="Full Name"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 font-medium mb-1.5">Patient NIC</label>
              <input
                type="text"
                value={form.patientNIC}
                onChange={(e) => update("patientNIC", e.target.value)}
                placeholder="e.g., 912345678V"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 font-medium mb-1.5">Patient Phone</label>
              <input
                type="text"
                value={form.patientPhone}
                onChange={(e) => update("patientPhone", e.target.value)}
                placeholder="+94 77 123 4567"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 font-medium mb-1.5">Patient Email</label>
              <input
                type="email"
                value={form.patientEmail}
                onChange={(e) => update("patientEmail", e.target.value)}
                placeholder="patient@example.com"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 font-medium mb-1.5">Payment Method</label>
              <select
                value={form.paymentMethod}
                onChange={(e) => update("paymentMethod", e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white text-gray-700 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              >
                <option>Add to Bill</option>
                <option>Cash</option>
                <option>Card</option>
                <option>Online</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-500 font-medium mb-1.5">SLT Phone Number</label>
              <input
                type="text"
                value={form.sltPhone}
                onChange={(e) => update("sltPhone", e.target.value)}
                placeholder="e.g, 0342222255"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 font-medium mb-1.5">Date</label>
              <input
                type="text"
                value={form.date}
                onChange={(e) => update("date", e.target.value)}
                placeholder="dd/mm/yy"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 font-medium mb-1.5">Time</label>
              <select
                value={form.time}
                onChange={(e) => update("time", e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white text-gray-700 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              >
                <option value="">Select Time</option>
                <option>09:00 AM</option>
                <option>10:00 AM</option>
                <option>11:00 AM</option>
                <option>02:00 PM</option>
                <option>03:00 PM</option>
                <option>04:00 PM</option>
              </select>
            </div>
          </div>

          <button
            onClick={addEntry}
            className="mt-4 px-6 py-2.5 rounded-md bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold text-sm hover:shadow-lg hover:from-green-600 hover:to-blue-700 transition-all"
          >
            Add Appointment
          </button>
        </div>
      )}

      {/* Entry List */}
      {entries.length > 0 && <EntryList entries={entries} setEntries={setEntries} />}

      {/* Bottom Actions */}
      {(entries.length > 0 || showForm) && (
        <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-green-200 mt-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-gray-800 text-base">Ready to Submit</p>
              <p className="text-xs text-gray-600">
                {entries.length} appointment{entries.length > 1 ? "s" : ""} ready for booking
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={validateAll}
              className="px-6 py-2.5 rounded-md bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-all text-sm border border-gray-300 shadow-sm"
            >
              Validate All
            </button>
            <button
              onClick={bookAll}
              className="px-6 py-2.5 rounded-md bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold hover:shadow-lg hover:from-green-600 hover:to-blue-700 transition-all text-sm"
            >
              Book All Appointments
            </button>
          </div>
        </div>
      )}
    </div>
  );
}