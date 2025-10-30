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
              className="w-full border border-gray-300 rounded-md p-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />

            {/* Tabs styled like image */}
            <div className="flex gap-8 mb-4 border-b border-gray-200 pb-1">
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
                    className={`relative pb-1 text-sm font-medium transition-all ${
                      isActive
                        ? "text-green-500"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab}
                    {isActive && (
                      <span className="absolute left-0 bottom-0 w-full h-[2px] bg-green-300 rounded-full"></span>
                    )}
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
                        ? "bg-green-50 border-green-300"
                        : "bg-white hover:bg-gray-50"
                    }`}
                    onClick={() => setSelected(loc)}
                  >
                    {/* Header: Icon + Name */}
                    <div className="flex items-center gap-3 mb-1">
                      <div
                        className={`w-10 h-10 flex items-center justify-center rounded-full ${
                          loc.type === "Hospital"
                            ? "bg-blue-100"
                            : "bg-green-100"
                        }`}
                      >
                        {loc.type === "Hospital" ? (
                          <FaHospital
                            className={`text-lg ${
                              loc.type === "Hospital"
                                ? "text-blue-600"
                                : "text-green-600"
                            }`}
                          />
                        ) : (
                          <FaPrescriptionBottleAlt className="text-lg text-green-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 text-sm">
                          {loc.name}
                        </h3>
                        <p className="text-xs text-gray-500">{loc.address}</p>
                      </div>
                    </div>

                    {/* Contact */}
                    <div className="flex items-center gap-1 text-xs text-gray-500 pl-12 mb-2">
                      <FaPhoneAlt className="text-[10px]" />
                      <span>{loc.contact}</span>
                    </div>

                    {/* --- CHANGED: For Pharmacy show Open Hours instead of specialties --- */}
                    {loc.type === "Hospital" ? (
                      <div className="flex flex-wrap gap-2 pl-12 mb-2">
                        {["Cardiology", "Neurology", "Orthopedics"].map(
                          (specialty) => (
                            <span
                              key={specialty}
                              className="px-2 py-1 bg-blue-50 text-blue-700 text-[11px] font-medium rounded-full border border-blue-100"
                            >
                              {specialty}
                            </span>
                          )
                        )}
                      </div>
                    ) : (
                      <div className="pl-12 mb-2 text-xs text-gray-600">
                        <p>
                          <span className="font-xs text-gray-800 mr-1">
                            Hours:
                          </span>
                          8:00 AM - 10:00 PM
                        </p>
                      </div>
                    )}

                    {/* View Details button */}
                    <div className="flex justify-end">
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
                    <p className="font-xs text-gray-800">Address:</p>
                    <p className="pl-2 text-gray-600">{selected.address}</p>
                  </div>

                  <div>
                    <p className="font-xs text-gray-800">Contact:</p>
                    <p className="pl-2 text-gray-600">{selected.contact}</p>
                  </div>

                  {selected.type === "Hospital" ? (
                    <div>
                      <p className="font-xs text-gray-800 mb-1">
                        Specialties:
                      </p>
                      <div className="flex flex-wrap gap-2 pl-2">
                        {["Cardiology", "Neurology", "Orthopedics"].map(
                          (specialty) => (
                            <span
                              key={specialty}
                              className="px-2 py-1 bg-blue-50 text-blue-700 text-[11px] font-medium rounded-full border border-blue-100"
                            >
                              {specialty}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="font-semibold text-gray-800">Hours:</p>
                      <p className="pl-2 text-gray-600">8:00 AM - 10:00 PM</p>
                    </div>
                  )}
                </div>

                {/* Buttons (aligned right) */}
                <div className="flex justify-end gap-3 mt-5">
                  <button className="flex items-center gap-2 bg-blue-600 text-white text-sm font-medium py-2 px-3 rounded-md shadow hover:bg-blue-700 transition-all">
                    <FaPhoneAlt className="text-xs" />
                    Call Now
                  </button>
                  <button className="flex items-center gap-2 bg-gray-200 text-gray-800 text-sm font-medium py-2 px-3 rounded-md shadow hover:bg-gray-300 transition-all">
                    <FaMapMarkerAlt className="text-xs" />
                    Directions
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
