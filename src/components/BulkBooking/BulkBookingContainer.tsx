"use client";

import { useMemo, useState } from "react";

type Doctor = {
  id: string;
  name: string;
  specialization: string;
  hospital: string;
  price: number;
};

const SAMPLE_DOCTORS: Doctor[] = [
  { id: "1", name: "Dr. Sarah Johnson", specialization: "Cardiologist", hospital: "City Hospital", price: 2500 },
  { id: "2", name: "Dr. Michael Chen", specialization: "Neurologist", hospital: "Metro Medical Center", price: 3000 },
  { id: "3", name: "Dr. Emily Brown", specialization: "Pediatrician", hospital: "Children's Hospital", price: 2000 },
  { id: "4", name: "Dr. James Wilson", specialization: "Cardiologist", hospital: "Central Clinic", price: 2800 },
  { id: "5", name: "Dr. Lisa Anderson", specialization: "Dermatologist", hospital: "City Hospital", price: 2200 },
  { id: "6", name: "Dr. Robert Taylor", specialization: "Orthopedic", hospital: "Metro Medical Center", price: 3500 },
];

export default function BulkBookingContainer({ cart, setCart }: any) {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showDoctorList, setShowDoctorList] = useState(true);

  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("All Specialties");
  const [hospital, setHospital] = useState("All Hospitals");

  const [appointmentDate, setAppointmentDate] = useState("");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [patientName, setPatientName] = useState("");
  const [patientNIC, setPatientNIC] = useState("");
  const [patientMobile, setPatientMobile] = useState("");
  const [refundDeposit, setRefundDeposit] = useState(false);

  const [showBookingForm, setShowBookingForm] = useState(false);

  const specialties = useMemo(
    () => ["All Specialties", ...new Set(SAMPLE_DOCTORS.map((d) => d.specialization))],
    []
  );

  const hospitals = useMemo(
    () => ["All Hospitals", ...new Set(SAMPLE_DOCTORS.map((d) => d.hospital))],
    []
  );

  const timeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM",
    "12:00 PM", "02:00 PM", "03:00 PM",
    "04:00 PM", "05:00 PM"
  ];

  const filtered = SAMPLE_DOCTORS.filter((d) => {
    if (specialty !== "All Specialties" && d.specialization !== specialty) return false;
    if (hospital !== "All Hospitals" && d.hospital !== hospital) return false;
    if (search && !(`${d.name} ${d.hospital}`.toLowerCase().includes(search.toLowerCase()))) return false;
    return true;
  });

  const resetForm = () => {
    setShowDoctorList(true);
    setSelectedDoctor(null);
    setShowBookingForm(false);
    setSelectedTime(null);
    setAppointmentDate("");
    setPatientName("");
    setPatientNIC("");
    setPatientMobile("");
    setRefundDeposit(false);
  };

  /* ------------------ DOCTOR LIST SCREEN ------------------ */
  if (showDoctorList) {
    return (
      <div className="space-y-6">

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search doctor or hospital..."
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="grid grid-cols-2 gap-4">
          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {specialties.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <select
            value={hospital}
            onChange={(e) => setHospital(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {hospitals.map((h) => (
              <option key={h}>{h}</option>
            ))}
          </select>
        </div>

        <div className="space-y-3">
          {filtered.map((doc) => (
            <button
              key={doc.id}
              onClick={() => { setSelectedDoctor(doc); setShowDoctorList(false); }}
              className="w-full text-left p-4 rounded-xl border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-all"
            >
              <div className="font-bold text-gray-900">{doc.name}</div>
              <div className="text-sm text-gray-600">{doc.specialization} • {doc.hospital}</div>
              <div className="text-sm font-semibold text-blue-600 mt-1">Rs. {doc.price}</div>
            </button>
          ))}
        </div>

      </div>
    );
  }

  /* ------------------ BOOKING FORM ------------------ */
  if (showBookingForm && selectedTime) {
    return (
      <div className="space-y-6">

        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
          <div className="text-sm text-gray-500">Selected Slot</div>
          <div className="font-bold text-lg text-gray-900">
            {appointmentDate} • {selectedTime}
          </div>
        </div>

        <div className="space-y-4">
          <input
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="Patient Name"
            className="border border-gray-300 rounded-xl w-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            value={patientNIC}
            onChange={(e) => setPatientNIC(e.target.value)}
            placeholder="NIC Number"
            className="border border-gray-300 rounded-xl w-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            value={patientMobile}
            onChange={(e) => setPatientMobile(e.target.value)}
            placeholder="Mobile Number"
            className="border border-gray-300 rounded-xl w-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl p-3 cursor-pointer hover:bg-blue-100 transition-all">
            <input
              type="checkbox"
              checked={refundDeposit}
              onChange={() => setRefundDeposit(!refundDeposit)}
              className="w-4 h-4"
            />
            <span className="text-gray-700">Add Rs. 250 Refundable Deposit</span>
          </label>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => {
              setShowBookingForm(false);
              setSelectedTime(null);
            }}
            className="w-1/3 bg-gray-200 text-gray-700 rounded-full py-3 font-semibold hover:bg-gray-300 transition-all"
          >
            Back
          </button>

          <button
            onClick={() => {
              if (!patientName || !patientNIC || !patientMobile) {
                alert("Please fill all patient details");
                return;
              }

              setCart([
                ...cart,
                {
                  selectedDoctor,
                  appointmentDate,
                  selectedTime,
                  patientName,
                  patientNIC,
                  patientMobile,
                  refundDeposit,
                },
              ]);

              // Reset form and return to doctor list
              setSelectedDoctor(null);
              setShowBookingForm(false);
              setSelectedTime(null);
              setAppointmentDate("");
              setPatientName("");
              setPatientNIC("");
              setPatientMobile("");
              setRefundDeposit(false);
              setShowDoctorList(true);
            }}
            className="flex-1 bg-blue-600 text-white rounded-full py-3 font-semibold hover:bg-blue-700 transition-all shadow-md"
          >
            Add to Cart
          </button>
        </div>

      </div>
    );
  }

  /* ------------------ TIME SELECTION ------------------ */
  return (
    <div className="space-y-6">

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="font-bold text-gray-900">{selectedDoctor?.name}</div>
        <div className="text-sm text-gray-600">{selectedDoctor?.specialization} • {selectedDoctor?.hospital}</div>
        <div className="text-sm font-semibold text-blue-600 mt-1">Rs. {selectedDoctor?.price}</div>

        <button
          onClick={resetForm}
          className="text-blue-600 underline mt-2 text-sm hover:text-blue-700"
        >
          Change Doctor
        </button>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Select Appointment Date</label>
        <input
          type="date"
          value={appointmentDate}
          onChange={(e) => setAppointmentDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          className="border border-gray-300 rounded-xl w-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {appointmentDate && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Select Time Slot</label>
          <div className="grid grid-cols-4 gap-3">
            {timeSlots.map((time) => (
              <button
                key={time}
                onClick={() => { setSelectedTime(time); setShowBookingForm(true); }}
                className="border border-gray-300 rounded-xl py-3 text-sm font-medium hover:bg-blue-50 hover:border-blue-400 transition-all"
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}