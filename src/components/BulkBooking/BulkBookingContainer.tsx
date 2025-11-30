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

export default function BulkBookingContainer() {
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
  const [cart, setCart] = useState<Array<any>>([]);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const specialties = useMemo(
    () => ["All Specialties", ...Array.from(new Set(SAMPLE_DOCTORS.map(d => d.specialization)))],
    []
  );
  const hospitals = useMemo(
    () => ["All Hospitals", ...Array.from(new Set(SAMPLE_DOCTORS.map(d => d.hospital)))],
    []
  );

  const timeSlots = [
    "09:00 AM","10:00 AM","11:00 AM",
    "12:00 PM","02:00 PM","03:00 PM",
    "04:00 PM","05:00 PM"
  ];

  const filtered = SAMPLE_DOCTORS.filter(d => {
    if (specialty !== "All Specialties" && d.specialization !== specialty) return false;
    if (hospital !== "All Hospitals" && d.hospital !== hospital) return false;
    if (search && !(`${d.name} ${d.hospital}`.toLowerCase().includes(search.toLowerCase()))) return false;
    return true;
  });

  const handleSelectDoctor = (doc: Doctor) => {
    setSelectedDoctor(doc);
    setShowDoctorList(false);
  };

  const handleTimeSlotClick = (time: string) => {
    setSelectedTime(time);
    setShowBookingForm(true);
  };

  const handleBack = () => {
    setShowBookingForm(false);
    setSelectedTime(null);
  };

  const handleChangeDoctor = () => {
    setSelectedDoctor(null);
    setShowDoctorList(true);
    setShowBookingForm(false);
    setSelectedTime(null);
  };

  /* ------------------------------------ DOCTOR SEARCH SCREEN ------------------------------------ */

  if (showDoctorList) {
    return (
      <div className="w-full space-y-8 text-slate-800">

        {/* SEARCH BAR */}
        <div>
          <label className="block text-base font-semibold mb-2 text-slate-700">Search Doctor</label>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by doctor or hospital"
            className="w-full rounded-xl border border-gray-300 px-5 py-4 text-slate-800 placeholder-slate-400
                       focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* FILTERS */}
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold mb-1 text-slate-600">Specialty</label>
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-slate-800
                         focus:border-blue-500"
            >
              {specialties.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-slate-600">Hospital</label>
            <select
              value={hospital}
              onChange={(e) => setHospital(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-slate-800
                         focus:border-blue-500"
            >
              {hospitals.map(h => <option key={h}>{h}</option>)}
            </select>
          </div>
        </div>

        {/* DOCTOR LIST */}
        <div className="space-y-4 w-full">
          {filtered.map(doc => (
            <button
              key={doc.id}
              className="w-full flex items-center justify-between p-5 rounded-xl border border-gray-200
                        hover:border-blue-400 hover:bg-blue-50 transition"
              onClick={() => handleSelectDoctor(doc)}
            >
              <div>
                <p className="font-bold text-lg text-slate-800">{doc.name}</p>
                <p className="text-sm text-slate-500">{doc.specialization} • {doc.hospital}</p>
              </div>

              <p className="text-slate-800 font-semibold">Rs. {doc.price}</p>
            </button>
          ))}
        </div>

      </div>
    );
  }

  /* ------------------------------------ BOOKING FORM ------------------------------------ */

  if (showBookingForm && selectedTime) {
    return (
      <div className="w-full space-y-8 text-slate-800">

        <div className="bg-blue-50 border border-gray-200 rounded-xl p-5">
          <p className="text-sm font-semibold text-slate-600">Selected Slot</p>
          <p className="text-xl font-bold text-slate-800">
            {appointmentDate} at {selectedTime}
          </p>
        </div>

        {/* FORM */}
        <div className="space-y-6 w-full">
          <div>
            <label className="block font-semibold mb-2 text-slate-700">Patient Name</label>
            <input className="w-full border border-gray-300 rounded-xl px-5 py-4 text-slate-800"
              value={patientName} onChange={(e)=>setPatientName(e.target.value)} />
          </div>

          <div>
            <label className="block font-semibold mb-2 text-slate-700">Patient NIC</label>
            <input className="w-full border border-gray-300 rounded-xl px-5 py-4 text-slate-800"
              value={patientNIC} onChange={(e)=>setPatientNIC(e.target.value)} />
          </div>

          <div>
            <label className="block font-semibold mb-2 text-slate-700">Mobile Number</label>
            <input className="w-full border border-gray-300 rounded-xl px-5 py-4 text-slate-800"
              value={patientMobile} onChange={(e)=>setPatientMobile(e.target.value)} />
          </div>

          <div className="flex gap-3 items-center bg-blue-50 rounded-xl p-4 border border-gray-200">
            <input type="checkbox" checked={refundDeposit} onChange={()=> setRefundDeposit(!refundDeposit)} />
            <p className="text-slate-700">Add Rs. 250 Refundable Deposit</p>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-4">
          <button onClick={handleBack} className="flex-1 py-4 rounded-full border border-gray-300 text-slate-700">
            Back
          </button>

          <button
            onClick={() => {
              setCart([...cart, { selectedDoctor, appointmentDate, selectedTime, patientName }]);
              alert("Added to cart");
              handleBack();
            }}
            className="flex-1 py-4 rounded-full bg-blue-600 text-white hover:bg-blue-700"
          >
            Add to Cart
          </button>
        </div>

      </div>
    );
  }

  /* ------------------------------------ TIME SLOT SCREEN ------------------------------------ */

  return (
    <div className="w-full space-y-8 text-slate-800">

      <div className="bg-blue-50 border border-gray-200 rounded-xl p-5">
        <p className="font-bold text-lg text-slate-800">{selectedDoctor?.name}</p>
        <p className="text-slate-500">{selectedDoctor?.specialization} • {selectedDoctor?.hospital}</p>

        <button
          onClick={handleChangeDoctor}
          className="mt-4 px-6 py-2 border border-gray-300 text-slate-700 rounded-full hover:bg-blue-50 transition"
        >
          Change Doctor
        </button>
      </div>

      {/* DATE PICKER */}
      <div>
        <label className="block font-semibold mb-2 text-slate-700">Appointment Date</label>
        <input
          type="date"
          value={appointmentDate}
          onChange={(e) => setAppointmentDate(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-5 py-4 text-slate-800"
        />
      </div>

      {/* TIME SLOTS */}
      {appointmentDate && (
        <div>
          <label className="block font-semibold mb-3 text-slate-700">Select Time</label>

          <div className="grid grid-cols-4 gap-4 w-full">
            {timeSlots.map((time) => (
              <button
                key={time}
                onClick={() => handleTimeSlotClick(time)}
                className="border border-gray-300 text-slate-700 rounded-xl py-4
                           hover:bg-blue-50 hover:border-blue-400 transition font-medium"
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
