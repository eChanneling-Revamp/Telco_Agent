"use client";

import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaHospital,
  FaPrescriptionBottleAlt,
} from "react-icons/fa";
import Sidebar from "@/components/dashboard/SideBar";

interface Location {
  id: number;
  name: string;
  address: string;
  contact: string;
  type: "Hospital" | "Pharmacy";
  position: [number, number];
}

const locations: Location[] = [
  {
    id: 1,
    name: "Central Hospital",
    address: "123 Main Street, Colombo 04",
    contact: "+94 11 234 5678",
    type: "Hospital",
    position: [6.9271, 79.8612],
  },
  {
    id: 2,
    name: "Metro Medical Center",
    address: "456 Galle Road, Colombo 03",
    contact: "+94 11 456 7890",
    type: "Hospital",
    position: [6.9011, 79.8534],
  },
  {
    id: 3,
    name: "HealthCare Pharmacy",
    address: "654 Park Road, Colombo 05",
    contact: "+94 11 276 5432",
    type: "Pharmacy",
    position: [6.9067, 79.8705],
  },
  {
    id: 4,
    name: "MediPharm Plus",
    address: "21 Flower Road, Colombo 07",
    contact: "+94 11 345 6789",
    type: "Pharmacy",
    position: [6.9102, 79.865],
  },
];

// Fix leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const DirectoryPage: React.FC = () => {
  const [filter, setFilter] = useState<"All" | "Hospital" | "Pharmacy">("All");
  const [selected, setSelected] = useState<Location | null>(locations[0]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLocations = locations.filter((loc) => {
    const matchesType = filter === "All" || loc.type === filter;
    const matchesSearch =
      loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loc.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loc.contact.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="flex h-screen w-full bg-[#0b233f]">
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col p-8 overflow-hidden">
        <div className="flex gap-8 h-full">
          {/* Left panel */}
          <div className="w-3/5 bg-[#f9fafc] rounded-xl shadow-md p-5 flex flex-col">
            {/* Search box */}
            <input
              type="text"
              placeholder="Search for hospitals, pharmacies, or locations"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />

            {/* Tabs */}
            <div className="flex gap-3 mb-4">
              {["All", "Hospitals", "Pharmacies"].map((tab) => {
                const filterValue =
                  tab === "All"
                    ? "All"
                    : tab === "Hospitals"
                    ? "Hospital"
                    : "Pharmacy";
                const isActive = filter === filterValue;

                return (
                  <button
                    key={tab}
                    onClick={() =>
                      setFilter(filterValue as "All" | "Hospital" | "Pharmacy")
                    }
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            {/* Locations List */}
            <div className="overflow-y-auto flex-1 space-y-3 pr-1">
              {filteredLocations.length > 0 ? (
                filteredLocations.map((loc) => (
                  <div
                    key={loc.id}
                    className={`p-4 rounded-lg border transition cursor-pointer flex flex-col justify-between ${
                      selected?.id === loc.id
                        ? "bg-blue-100 border-blue-400"
                        : "bg-white hover:bg-gray-50"
                    }`}
                    onClick={() => setSelected(loc)}
                  >
                    {/* Header: Icon + Name */}
                    <div className="flex items-center gap-2 mb-1">
                      {loc.type === "Hospital" ? (
                        <FaHospital
                          className={`text-base ${
                            selected?.id === loc.id
                              ? "text-blue-600"
                              : "text-blue-500"
                          }`}
                        />
                      ) : (
                        <FaPrescriptionBottleAlt
                          className={`text-base ${
                            selected?.id === loc.id
                              ? "text-green-600"
                              : "text-green-500"
                          }`}
                        />
                      )}
                      <h3 className="font-semibold text-gray-800 text-sm">
                        {loc.name}
                      </h3>
                    </div>

                    {/* Address */}
                    <p className="text-xs text-gray-600 pl-6 mb-1">
                      {loc.address}
                    </p>

                    {/* Contact */}
                    <div className="flex items-center gap-1 text-xs text-gray-500 pl-6 mb-2">
                      <FaPhoneAlt className="text-[10px]" />
                      <span>{loc.contact}</span>
                    </div>

                    {/* View Details - bottom right */}
                    <div className="flex justify-end mt-auto">
                      <button
                        className="text-blue-600 text-xs font-medium hover:underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelected(loc);
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center mt-10">
                  No results found
                </p>
              )}
            </div>
          </div>

          {/* Right panel */}
          <div className="w-2/5 bg-[#f9fafc] rounded-xl shadow-md p-5 flex flex-col h-fit self-start">
            {selected && (
              <>
                <h2 className="text-lg font-semibold mb-3 text-gray-800">
                  {selected.name}
                </h2>

                {/* Map */}
                <div className="h-60 w-full rounded-lg overflow-hidden mb-4 border border-gray-200">
                  <MapContainer
                    center={selected.position}
                    zoom={15}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={selected.position}>
                      <Popup>{selected.name}</Popup>
                    </Marker>
                  </MapContainer>
                </div>

                {/* Info */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm space-y-4 text-sm text-gray-700">
                  <div>
                    <p className="font-semibold text-gray-800">Address:</p>
                    <p className="pl-2 text-gray-600">{selected.address}</p>
                  </div>

                  <div>
                    <p className="font-semibold text-gray-800">Contact:</p>
                    <p className="pl-2 text-gray-600">{selected.contact}</p>
                  </div>

                  <div>
                    <p className="font-semibold text-gray-800">Specialties:</p>
                    <p className="pl-2 text-gray-600">
                      Cardiology, Neurology, Orthopedics
                    </p>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 mt-5">
                  <button className="flex items-center gap-2 bg-white hover:bg-blue-600 hover:text-white text-black text-sm font-medium py-2 px-3 rounded-md transition-all shadow-sm">
                    <FaPhoneAlt className="text-xs" />
                    Call Now
                  </button>
                  <button className="flex items-center gap-2 border border-white text-black hover:bg-blue-50 text-sm font-medium py-2 px-3 rounded-md transition-all shadow-sm">
                    <FaMapMarkerAlt className="text-xs text-black" />
                    Directory
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectoryPage;
