"use client";

import { useMemo, useState, useEffect } from "react";

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  consultation_fee: number;
};

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
  const [patientDOB, setPatientDOB] = useState("");
  const [patientGender, setPatientGender] = useState("");
  const [patientAge, setPatientAge] = useState("");

  const [patientMobile, setPatientMobile] = useState("");
  const [refundDeposit, setRefundDeposit] = useState(false);

  const [showBookingForm, setShowBookingForm] = useState(false);

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch doctors from backend
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("/api/doctors");
        const data = await response.json();
        setDoctors(data.doctors || []);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const specialties = useMemo(
    () => ["All Specialties", ...new Set(doctors.map((d) => d.specialty))],
    [doctors]
  );

  const hospitals = useMemo(
    () => ["All Hospitals", ...new Set(doctors.map((d) => d.hospital))],
    [doctors]
  );

  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
  ];

  const filtered = doctors.filter((d) => {
    if (specialty !== "All Specialties" && d.specialty !== specialty)
      return false;
    if (hospital !== "All Hospitals" && d.hospital !== hospital) return false;
    if (
      search &&
      !`${d.name} ${d.hospital}`.toLowerCase().includes(search.toLowerCase())
    )
      return false;
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

        {loading ? (
          <div className="text-center py-8 text-gray-500">
            Loading doctors...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No doctors found</div>
        ) : (
          <div className="space-y-3">
            {filtered.map((doc) => (
              <button
                key={doc.id}
                onClick={() => {
                  setSelectedDoctor(doc);
                  setShowDoctorList(false);
                }}
                className="w-full text-left p-4 rounded-xl border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-all"
              >
                <div className="font-bold text-gray-900">{doc.name}</div>
                <div className="text-sm text-gray-600">
                  {doc.specialty} • {doc.hospital}
                </div>
                <div className="text-2xl font-semibold text-blue-800 mt-1 text-right">
                  Rs. {doc.consultation_fee}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  /* ------------------ BOOKING FORM ------------------ */
  if (showBookingForm && selectedTime) {
    const basePrice = Number(selectedDoctor?.consultation_fee || 0);
    const refund = 250;
    const totalPrice = refundDeposit ? basePrice + refund : basePrice;

    return (
      <div className="space-y-6">
        {/* Slot Summary */}
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
          <div className="text-sm text-gray-500">Selected Slot</div>
          <div className="font-bold text-lg text-gray-900">
            {appointmentDate} • {selectedTime}
          </div>
        </div>

        {/* Patient Pricing */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Price & Refund Option
          </h2>

          <p className="text-sm text-gray-500 mb-1">Base Price</p>
          <p className="text-2xl font-bold text-blue-800 mb-4">
            Rs. {basePrice}
          </p>

          {/* Refund Box */}
          <div className="border-2 border-blue-100 rounded-lg p-4 mb-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={refundDeposit}
                onChange={() => setRefundDeposit(!refundDeposit)}
                className="mt-1 w-5 h-5"
              />
              <div>
                <p className="font-medium text-gray-900">
                  Customer agrees to pay additional Rs. 250 for full refund
                  eligibility
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  This amount makes the appointment fully refund-able if
                  cancelled.
                </p>
              </div>
            </label>
          </div>

          {/* Total Price */}
          <div className="bg-teal-50 border-2 border-teal-200 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-900">Total Price</span>
              <span className="text-2xl font-bold text-teal-600">
                Rs. {totalPrice}
              </span>
            </div>
          </div>
        </div>

        {/* PATIENT DETAILS */}
        <h3 className="text-lg font-semibold text-gray-900 mt-4">
          Patient Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-black">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Patient Name
            </label>
            <input
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              NIC Number
            </label>
            <input
              value={patientNIC}
              onChange={(e) => setPatientNIC(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mobile Number
            </label>
            <input
              value={patientMobile}
              onChange={(e) => setPatientMobile(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              value={patientDOB}
              onChange={(e) => setPatientDOB(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender
            </label>
            <select
              value={patientGender}
              onChange={(e) => setPatientGender(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Age
            </label>
            <input
              type="number"
              value={patientAge}
              onChange={(e) => setPatientAge(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              setShowBookingForm(false);
              setSelectedTime(null);
            }}
            className="w-1/3 bg-gray-200 text-gray-700 rounded-lg py-3 font-semibold hover:bg-gray-300"
          >
            Back
          </button>

          <button
            onClick={() => {
              if (
                !patientName ||
                !patientNIC ||
                !patientMobile ||
                !patientDOB ||
                !patientGender ||
                !patientAge
              ) {
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
                  patientDOB,
                  patientGender,
                  patientAge,
                  refundDeposit,
                  totalPrice,
                },
              ]);

              resetForm();
            }}
            className="flex-1 bg-blue-900 text-white rounded-lg py-3 font-semibold hover:bg-blue-800"
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
        <div className="text-sm text-gray-600">
          {selectedDoctor?.specialty} • {selectedDoctor?.hospital}
        </div>
        <div className="text-xl font-semibold text-blue-800 mt-1">
          Rs. {selectedDoctor?.consultation_fee}
        </div>

        <button
          onClick={resetForm}
          className="text-blue-600 underline mt-2 text-sm hover:text-blue-700"
        >
          Change Doctor
        </button>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Select Appointment Date
        </label>
        <input
          type="date"
          value={appointmentDate}
          onChange={(e) => setAppointmentDate(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
          className="border border-gray-300 rounded-xl w-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {appointmentDate && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Select Time Slot
          </label>
          <div className="grid grid-cols-4 gap-3">
            {timeSlots.map((time) => (
              <button
                key={time}
                onClick={() => {
                  setSelectedTime(time);
                  setShowBookingForm(true);
                }}
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
