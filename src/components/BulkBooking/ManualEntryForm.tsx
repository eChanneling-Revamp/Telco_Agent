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

interface FormData {
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
  const [openForms, setOpenForms] = useState<{ [key: string]: FormData }>({});
  const [topFormData, setTopFormData] = useState({
    doctor: "",
    specialization: "",
    dateTime: "",
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

  const times = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
  ];

  const createNewForm = (): FormData => ({
    doctor: topFormData.doctor,
    specialization: topFormData.specialization,
    dateTime: topFormData.dateTime,
    patientName: "",
    patientNIC: "",
    patientPhone: "",
    patientEmail: "",
    paymentMethod: "Add to Bill",
    sltPhone: "",
    date: "",
    time: "",
  });

  const addNewForm = () => {
    const formId = Date.now().toString();
    setOpenForms({
      ...openForms,
      [formId]: createNewForm(),
    });
  };

  const updateForm = (formId: string, key: string, value: string) => {
    setOpenForms({
      ...openForms,
      [formId]: {
        ...openForms[formId],
        [key]: value,
      },
    });
  };

  const removeForm = (formId: string) => {
    const newForms = { ...openForms };
    delete newForms[formId];
    setOpenForms(newForms);
  };

  const validateAll = () => {
    if (entries.length === 0 && Object.keys(openForms).length === 0) {
      alert("No appointments to validate!");
      return;
    }
    alert("All appointments validated successfully!");
  };

  const bookAll = () => {
    if (entries.length === 0 && Object.keys(openForms).length === 0) {
      alert("No appointments to book!");
      return;
    }

    // Save all open forms first
    const allEntries: Entry[] = [...entries];
    Object.keys(openForms).forEach((formId) => {
      const form = openForms[formId];
      if (form.doctor) {
        allEntries.push({
          ...form,
          id: Date.now().toString() + Math.random(),
        });
      }
    });

    alert(`Booking ${allEntries.length} appointment(s)...`);
    setEntries(allEntries);
    setOpenForms({});
  };

  const openFormIds = Object.keys(openForms);
  const totalAppointments = entries.length + openFormIds.length;

  return (
    <div className="space-y-5">
      {/* Top Form Section */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden text-black">
        <div className="grid grid-cols-3 gap-4 p-5 bg-white">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Doctor
            </label>
            <select
              value={topFormData.doctor}
              onChange={(e) =>
                setTopFormData({ ...topFormData, doctor: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Doctor</option>
              {doctors.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specialization
            </label>
            <select
              value={topFormData.specialization}
              onChange={(e) =>
                setTopFormData({
                  ...topFormData,
                  specialization: e.target.value,
                })
              }
              className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Specialization</option>
              {specializations.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date & Time
            </label>
            <input
              type="text"
              value={topFormData.dateTime}
              onChange={(e) =>
                setTopFormData({ ...topFormData, dateTime: e.target.value })
              }
              placeholder="dd/mm/yy    --:-- --"
              className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="px-5 pb-5">
          <button
            onClick={addNewForm}
            className="px-8 py-3 rounded-md  bg-blue-900 text-white font-semibold text-sm hover:shadow-lg transition-all inline-flex items-center gap-2"
          >
            <span className="text-lg">+</span>
            Add Entry
          </button>
        </div>
      </div>

      {/* No Entries Yet Message */}
      {entries.length === 0 && openFormIds.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
          <div className="w-20 h-20 mx-auto mb-4 text-gray-300">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
              />
            </svg>
          </div>
          <p className="text-xl font-bold text-gray-800 mb-2">No Entries Yet</p>
          <p className="text-sm text-gray-500">
            Add your first appointment using the form above
          </p>
        </div>
      )}

      {/* Open Forms */}
      {openFormIds.map((formId, index) => {
        const form = openForms[formId];
        const appointmentNumber = entries.length + index + 1;

        return (
          <div
            key={formId}
            className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
          >
            <div className="bg-gray-50 px-5 py-3 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-semibold text-sm text-gray-800">
                {appointmentNumber}. Appointment #{appointmentNumber}
              </h3>
              <button
                onClick={() => removeForm(formId)}
                className="text-red-500 hover:text-red-700 hover:bg-red-100 p-1.5 rounded transition"
                title="Remove this form"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <div className="p-5">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Doctor
                  </label>
                  <select
                    value={form.doctor}
                    onChange={(e) =>
                      updateForm(formId, "doctor", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Doctor</option>
                    {doctors.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient Name
                  </label>
                  <input
                    type="text"
                    value={form.patientName}
                    onChange={(e) =>
                      updateForm(formId, "patientName", e.target.value)
                    }
                    placeholder="Full Name"
                    className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient NIC
                  </label>
                  <input
                    type="text"
                    value={form.patientNIC}
                    onChange={(e) =>
                      updateForm(formId, "patientNIC", e.target.value)
                    }
                    placeholder="e.g., 912345678V"
                    className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient Phone
                  </label>
                  <input
                    type="text"
                    value={form.patientPhone}
                    onChange={(e) =>
                      updateForm(formId, "patientPhone", e.target.value)
                    }
                    placeholder="+94 77 123 4567"
                    className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient Email
                  </label>
                  <input
                    type="email"
                    value={form.patientEmail}
                    onChange={(e) =>
                      updateForm(formId, "patientEmail", e.target.value)
                    }
                    placeholder="patient@example.com"
                    className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method
                  </label>
                  <select
                    value={form.paymentMethod}
                    onChange={(e) =>
                      updateForm(formId, "paymentMethod", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Add to Bill">Add to Bill</option>
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                    <option value="Online">Online</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SLT Phone Number
                  </label>
                  <input
                    type="text"
                    value={form.sltPhone}
                    onChange={(e) =>
                      updateForm(formId, "sltPhone", e.target.value)
                    }
                    placeholder="e.g, 0342222255"
                    className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => updateForm(formId, "date", e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time
                  </label>
                  <select
                    value={form.time}
                    onChange={(e) => updateForm(formId, "time", e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Time</option>
                    {times.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Saved Entry List */}
      {entries.length > 0 && (
        <div className="space-y-3">
          <EntryList entries={entries} setEntries={setEntries} />
        </div>
      )}

      {/* Bottom Actions */}
      {totalAppointments > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-green-50 rounded-full flex items-center justify-center border border-green-200">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-base">
                  Ready to Submit
                </p>
                <p className="text-sm text-gray-600">
                  {totalAppointments} appointment
                  {totalAppointments > 1 ? "s" : ""} ready for booking
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={validateAll}
                className="px-6 py-2.5 rounded-md bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition text-sm border border-gray-300"
              >
                Validate All
              </button>
              <button
                onClick={bookAll}
                className="px-6 py-2.5 rounded-md  bg-blue-900 text-white font-semibold hover:shadow-lg transition text-sm"
              >
                Book All Appointments
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
