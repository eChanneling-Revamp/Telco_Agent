"use client";

import { useState, useMemo } from "react";
import { Calendar as CalIcon } from "lucide-react";

type Doctor = {
  id: number;
  name: string;
  specialty: string;
  hospital: string;
  hospitalType: "Private" | "Government";
  city: string;
  available: string;
  availableDates?: string[];
};

const DOCTORS: Doctor[] = [
  { id: 1, name: "Dr. Samantha Perera", specialty: "Cardiologist", hospital: "National Hospital", hospitalType: "Government", city: "Colombo", available: "10:30 AM–12:30 PM", availableDates: ["2025-10-15", "2025-10-16"] },
  { id: 2, name: "Dr. Ajith Fernando", specialty: "Dermatologist", hospital: "Asiri Medical", hospitalType: "Private", city: "Colombo", available: "2:00 PM–5:00 PM", availableDates: ["2025-10-15"] },
  { id: 3, name: "Dr. Nimal Silva", specialty: "Neurologist", hospital: "Lanka Hospitals", hospitalType: "Private", city: "Kandy", available: "9:00 AM–11:00 AM", availableDates: ["2025-10-16"] },
  { id: 4, name: "Dr. Kumari Jayawardena", specialty: "Pediatrician", hospital: "Nawaloka Hospital", hospitalType: "Private", city: "Colombo", available: "3:30 PM–6:30 PM", availableDates: ["2025-10-17"] },
];

export default function DoctorSearch({ onSelectDoctor }: { onSelectDoctor: (d: Doctor) => void }) {
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [hospitalType, setHospitalType] = useState("");
  const [city, setCity] = useState("");
  const [date, setDate] = useState("");

  const filtered = useMemo(() => {
    return DOCTORS.filter((d) => {
      if (specialization && d.specialty !== specialization) return false;
      if (hospitalType && d.hospitalType !== hospitalType) return false;
      if (city && d.city !== city) return false;
      if (search && !d.name.toLowerCase().includes(search.toLowerCase()) && !d.hospital.toLowerCase().includes(search.toLowerCase()) && !d.specialty.toLowerCase().includes(search.toLowerCase())) return false;
      if (date && !d.availableDates?.includes(date)) return false;
      return true;
    });
  }, [search, specialization, hospitalType, city, date]);

  return (
    <div className="space-y-5 text-black">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by name, hospital, or specialty..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B60E0] "
      />

      {/* Filters in 2x2 grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* First row */}
        <select value={specialization} onChange={(e) => setSpecialization(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-black">
          <option value="">Specialization</option>
          <option value="Cardiologist">Cardiologist</option>
          <option value="Dermatologist">Dermatologist</option>
          <option value="Neurologist">Neurologist</option>
          <option value="Pediatrician">Pediatrician</option>
        </select>

        <select value={hospitalType} onChange={(e) => setHospitalType(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
          <option value="">Hospital Type</option>
          <option value="Private">Private</option>
          <option value="Government">Government</option>
        </select>

        {/* Second row */}
        <select value={city} onChange={(e) => setCity(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
          <option value="">City</option>
          <option value="Colombo">Colombo</option>
          <option value="Kandy">Kandy</option>
          <option value="Galle">Galle</option>
        </select>

        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
          <CalIcon className="w-4 h-4 text-gray-500 mr-2" />
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="outline-none text-sm w-full" />
        </div>
      </div>

      <div className="text-sm text-gray-500">Search Results</div>

      {/* Results */}
      <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
        {filtered.length ? (
          filtered.map((doc) => (
            <div key={doc.id} className="flex justify-between items-center border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
              <div>
                <div className="font-semibold text-gray-800">{doc.name}</div>
                <div className="text-sm text-gray-500">{doc.specialty}</div>
                <div className="text-sm text-gray-400">{doc.hospital}</div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Available</span>
                  <span className="text-xs text-gray-600">{doc.available}</span>
                </div>
              </div>
              <button
                onClick={() => onSelectDoctor(doc)}
                className="bg-gradient-to-r from-[#23DE4F] to-[#330FFB] text-white px-4 py-1.5 rounded-full text-sm font-medium hover:opacity-90"
              >
                Select
              </button>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-6">No doctors found.</div>
        )}
      </div>
    </div>
  );
}
