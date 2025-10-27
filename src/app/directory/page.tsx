"use client";

import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
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
    address: "131 Main Street, Colombo 04",
    contact: "+94 112 345 678",
    type: "Hospital",
    position: [6.9271, 79.8612],
  },
  {
    id: 2,
    name: "Metro Medical Center",
    address: "458 Galle Road, Colombo 03",
    contact: "+94 114 567 890",
    type: "Hospital",
    position: [6.9011, 79.8534],
  },
  {
    id: 3,
    name: "HealthCare Pharmacy",
    address: "22 Duplication Road, Colombo 05",
    contact: "+94 112 765 432",
    type: "Pharmacy",
    position: [6.9067, 79.8705],
  },
  {
    id: 4,
    name: "MediPharm Plus",
    address: "10 Flower Road, Colombo 07",
    contact: "+94 113 456 789",
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

  // Filter logic
  const filteredLocations = locations.filter((loc) => {
    const matchesType = filter === "All" || loc.type === filter;
    const matchesSearch =
      loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loc.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loc.contact.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div
      className="flex h-screen w-auto bg-cover bg-center"
      style={{ backgroundImage: `url('/assets/bg.png')` }}
    >
      <Sidebar />

      <div className="flex gap-8 ml-10 w-4/5 p-6">
        {/* Left panel */}
        <div className="w-3/5 bg-white rounded-2xl shadow-lg p-4 flex flex-col">
          {/* Search */}
          <input
            type="text"
            placeholder="Search for hospitals, pharmacies, or locations"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* Tabs */}
          <div className="flex justify-between mb-4">
            {["All", "Hospitals", "Pharmacies"].map((tab) => {
              const filterValue =
                tab === "All"
                  ? "All"
                  : tab === "Hospitals"
                  ? "Hospital"
                  : "Pharmacy";

              return (
                <button
                  key={tab}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold ${
                    filter === filterValue
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() =>
                    setFilter(filterValue as "All" | "Hospital" | "Pharmacy")
                  }
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Locations List */}
          <div className="overflow-y-auto space-y-3 flex-1">
            {filteredLocations.length > 0 ? (
              filteredLocations.map((loc) => (
                <div
                  key={loc.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    selected?.id === loc.id
                      ? "bg-blue-100 border-blue-400"
                      : "bg-white hover:bg-gray-50"
                  }`}
                  onClick={() => setSelected(loc)}
                >
                  <h3 className="font-semibold text-gray-800">{loc.name}</h3>
                  <p className="text-sm text-gray-600">{loc.address}</p>
                  <p className="text-xs text-gray-500">{loc.contact}</p>
                  <button className="mt-2 text-blue-600 text-sm hover:underline">
                    View Details
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center mt-10">No results found</p>
            )}
          </div>
        </div>

        {/* Right panel */}
        <div className="w-2/5 bg-white rounded-2xl shadow-lg ml-10 p-4 flex flex-col">
          {selected && (
            <>
              <h2 className="text-xl font-bold mb-2 text-black">
                {selected.name}
              </h2>

              {/* Map */}
              <div className="h-64 w-full rounded-xl overflow-hidden mb-4">
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

              {/* Info Section */}
              <div className="space-y-2 text-sm text-black">
                <p>
                  <span className="font-semibold">Address:</span>{" "}
                  {selected.address}
                </p>
                <p>
                  <span className="font-semibold">Contact:</span>{" "}
                  {selected.contact}
                </p>
                <p>
                  <span className="font-semibold">Specialties:</span>{" "}
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-4">
                <button className="px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-blue-400 transition">
                  Call Now
                </button>
                <button className="px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-green-200 transition">
                  Directions
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DirectoryPage;
