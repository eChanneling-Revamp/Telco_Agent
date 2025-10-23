export default function AppointmentFilter() {
  return (
    <div className="space-y-3">
      <input type="text" placeholder="Search..." className="w-full border border-gray-300 rounded-lg px-3 py-2" />
      <div className="grid grid-cols-2 gap-3">
        <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
          <option>Specialization</option>
        </select>
        <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
          <option>Hospital Type</option>
        </select>
      </div>
    </div>
  );
}
