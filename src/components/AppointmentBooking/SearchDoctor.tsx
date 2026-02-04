"use client";

import React, { useState, useEffect } from "react";
import { Search, MapPin, AlertCircle } from "lucide-react";
import { Doctor } from "@/types/appointment";

interface SearchDoctorProps {
  onNext: (doctor: Doctor) => void;
}

export default function SearchDoctor({ onNext }: SearchDoctorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [hospital, setHospital] = useState("");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [hospitalTypes, setHospitalTypes] = useState<string[]>([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);
  const [error, setError] = useState("");

  // Fetch specializations and hospital types on mount
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        setLoadingDropdowns(true);
        setError("");

        // Fetch specializations
        const specResponse = await fetch("/api/specializations");
        const specData = await specResponse.json();
        if (specData.specializations) {
          setSpecializations(specData.specializations);
        }

        // Fetch hospital types - using a query on doctors endpoint
        const docResponse = await fetch("/api/doctors?getHospitalTypes=true");
        const docData = await docResponse.json();
        if (docData.hospitalTypes) {
          setHospitalTypes(docData.hospitalTypes);
        } else {
          // Fallback if endpoint doesn't return hospitalTypes
          setHospitalTypes(["Private", "Government"]);
        }
      } catch (err) {
        console.error("Error fetching filters:", err);
        setError("Failed to load search filters");
        // Provide fallback values
        setSpecializations([]);
        setHospitalTypes(["Private", "Government"]);
      } finally {
        setLoadingDropdowns(false);
      }
    };

    fetchFilters();
  }, []);

  const handleSearch = async () => {
    setIsLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (specialty) params.append("specialization", specialty);
      if (hospital) params.append("hospitalType", hospital);

      const response = await fetch(`/api/doctors?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch doctors");
      }

      const mappedDoctors = (data.doctors || []).map((doc: any) => ({
        id: doc.id,
        name: doc.name,
        specialty: doc.specialty,
        hospital: doc.hospital,
        hospitalType: doc.hospitalType || doc.hospital_type,
        city: doc.city,
        available: doc.available || "Available",
        availabilityId:
          doc.availabilityId ||
          doc.availability_slots?.[0]?.availability_id ||
          0,
        consultationFee: Number(doc.consultation_fee || 3000),
        slotsAvailable: doc.total_slots_available || doc.slotsAvailable || 10,
      }));

      console.log("📋 Mapped doctors with fees:", mappedDoctors);

      if (mappedDoctors.length === 0) {
        setError(
          "No doctors found matching your criteria. Please try different filters.",
        );
        setDoctors([]);
      } else {
        setDoctors(mappedDoctors);
      }

      setShowResults(true);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setError(
        error instanceof Error ? error.message : "Error fetching doctors",
      );
      setDoctors([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto p-6 text-black px-2 py-6 mb-2">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Place an Appointment
      </h1>

      {/* Progress Bar */}
      <div className="flex items-center gap-2 mb-8">
        <div className="flex-1 h-2 bg-blue-900 rounded"></div>
        <div className="flex-1 h-2 bg-gray-400 rounded"></div>
        <div className="flex-1 h-2 bg-gray-400 rounded"></div>
        <div className="flex-1 h-2 bg-gray-400 rounded"></div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Search Doctor
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Search by Doctor Name or Hospital
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle
              size={18}
              className="text-red-600 flex-shrink-0 mt-0.5"
            />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Search Input */}
        <input
          type="text"
          placeholder="Enter Doctor name or Hospital"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Filters */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            disabled={loadingDropdowns}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:bg-gray-100"
          >
            <option value="">
              {loadingDropdowns ? "Loading specialties..." : "All Specialties"}
            </option>
            {specializations.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>

          <select
            value={hospital}
            onChange={(e) => setHospital(e.target.value)}
            disabled={loadingDropdowns}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:bg-gray-100"
          >
            <option value="">All Hospital Types</option>
            {hospitalTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleSearch}
          disabled={isLoading || loadingDropdowns}
          className="w-full bg-blue-900 text-white py-3 rounded-lg font-medium hover:bg-blue-800 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Search size={20} />
          {isLoading ? "Searching..." : "Search Doctors"}
        </button>
      </div>

      {/* Search Results */}
      {showResults && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowResults(false)}
              className="text-blue-900 font-medium hover:underline"
            >
              ← Back to Search
            </button>
            <span className="text-sm text-gray-500">
              Found: {doctors.length} doctors
            </span>
          </div>

          <div className="space-y-4">
            {doctors.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <p className="text-gray-500">
                  No doctors found matching your criteria.
                </p>
              </div>
            ) : (
              doctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {doctor.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {doctor.specialty}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <MapPin size={16} />
                          <span>{doctor.city}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>{doctor.hospital}</span>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {doctor.hospitalType}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        Available slots: {doctor.slotsAvailable}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-700">
                        Rs. {doctor.consultationFee.toLocaleString()}
                      </p>
                      <button
                        onClick={() => {
                          console.log("Selected doctor:", doctor);
                          onNext(doctor);
                        }}
                        className="mt-4 bg-blue-900 text-white px-8 py-2 rounded-lg font-medium hover:bg-blue-800 transition"
                      >
                        Select Doctor
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
