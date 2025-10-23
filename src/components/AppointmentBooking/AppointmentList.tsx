import DoctorCard from "./DoctorCard";

type Doctor = { id: number; name: string; type: string; hospital: string; time: string; availableDates: string[] };

const DOCTORS: Doctor[] = [
  { id: 1, name: "Dr. Samantha Perera", type: "Cardiologist", hospital: "National Hospital", time: "10:30 AM–12:30 PM", availableDates: ["2025-05-15", "2025-05-16"] },
  { id: 2, name: "Dr. Ajith Fernando", type: "Dermatologist", hospital: "Asiri Medical", time: "2:00 PM–5:00 PM", availableDates: ["2025-05-15"] },
  { id: 3, name: "Dr. Nimal Silva", type: "Neurologist", hospital: "Lanka Hospitals", time: "9:00 AM–11:00 AM", availableDates: ["2025-05-16"] },
  { id: 4, name: "Dr. Kumari Jayawardena", type: "Pediatrician", hospital: "Nawaloka Hospital", time: "3:30 PM–6:30 PM", availableDates: ["2025-05-17"] },
];

export default function AppointmentList({ searchTerm, selectedDate, onSelect }: { searchTerm: string; selectedDate: string; onSelect: (d: Doctor) => void }) {
  const q = searchTerm.trim().toLowerCase();

  const filtered = DOCTORS.filter((d) => {
    const matchesSearch = !q || d.name.toLowerCase().includes(q) || d.type.toLowerCase().includes(q) || d.hospital.toLowerCase().includes(q);
    const matchesDate = !selectedDate || d.availableDates.includes(selectedDate);
    return matchesSearch && matchesDate;
  });

  if (filtered.length === 0) return <div className="text-sm text-gray-600 py-2">No doctors available for the selected date/search.</div>;

  return (
    <div className="mt-4 space-y-3">
      {filtered.map((doc) => (
        <DoctorCard key={doc.id} doctor={{ ...doc, available: doc.availableDates.join(", ") }} onSelect={() => onSelect(doc)} />
      ))}
    </div>
  );
}
