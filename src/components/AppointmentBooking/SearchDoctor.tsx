"use client";

import React, { useState, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';

type Doctor = {
  id: number;
  name: string;
  specialty: string;
  hospital: string;
  hospitalType: "Private" | "Government";
  city: string;
  available: string;
  availabilityId: number;
  consultationFee: number;
  slotsAvailable: number;
};

interface SearchDoctorProps {
  onNext: (doctor: Doctor) => void;
}

export default function SearchDoctor({ onNext }: SearchDoctorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [hospital, setHospital] = useState("");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Fetch doctors from API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (specialty) params.append('specialization', specialty);
        if (hospital) params.append('hospitalType', hospital);

        const response = await fetch(`/api/appointments?${params.toString()}`);
        const data = await response.json();
        
        setDoctors(data.doctors || []);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setDoctors([]);
      }
    };

    fetchDoctors();
  }, [searchTerm, specialty, hospital]);

  const handleSearch = () => {
    setFilteredDoctors(doctors);
    setShowResults(true);
  };

  return (
    <div className=" mx-auto p-6 text-black px-2 py-6 mb-2">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Place an Appointment</h1>
      
      {/* Progress Bar */}
      <div  className="flex items-center gap-2 mb-8">
        <div className="flex-1 h-2 bg-blue-900 rounded"></div>
        <div className="flex-1 h-2 bg-gray-400 rounded"></div>
        <div className="flex-1 h-2 bg-gray-400 rounded"></div>
        <div className="flex-1 h-2 bg-gray-400 rounded"></div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Search Doctor</h2>
        <p className="text-sm text-gray-500 mb-6">Search by Doctor Name or Hospital</p>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Enter Doctor name or Hospital"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Filters */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Specialties</option>
            <option value="Cardiologist">Cardiologist</option>
            <option value="Dermatologist">Dermatologist</option>
            <option value="Neurologist">Neurologist</option>
          </select>

          <select
            value={hospital}
            onChange={(e) => setHospital(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Hospitals</option>
            <option value="Private">Private</option>
            <option value="Government">Government</option>
          </select>
        </div>

        <button
          onClick={handleSearch}
          className="w-full bg-blue-900 text-white py-3 rounded-lg font-medium hover:bg-blue-800 transition flex items-center justify-center gap-2"
        >
          <Search size={20} />
          Search Doctors
        </button>
      </div>

      {/* Search Results */}
      {showResults && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={() => setShowResults(false)}
              className="text-blue-900 font-medium"
            >
              ← Back to Search
            </button>
            <span className="text-sm text-gray-500">
              Found: {filteredDoctors.length} doctors
            </span>
          </div>

          <div className="space-y-4">
            {filteredDoctors.map((doctor) => (
              <div key={doctor.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{doctor.specialty}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin size={16} />
                        <span>{doctor.city}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>{doctor.hospital}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Experience: 10 years</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-700">Rs. {doctor.consultationFee}</p>
                    <button
                      onClick={() => onNext(doctor)}
                      className="mt-4 bg-blue-900 text-white px-8 py-2 rounded-lg font-medium hover:bg-blue-800 transition"
                    >
                      Select Doctor
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}