export default function DoctorCard({
  doctor,
  onSelect,
}: {
  doctor: any;
  onSelect?: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
      <div>
        <div className="font-semibold text-gray-800">{doctor.name}</div>
        <div className="text-sm text-gray-500">{doctor.type}</div>
        <div className="text-sm text-gray-400">{doctor.hospital}</div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-sm text-gray-600">{doctor.time}</div>
        <button
          onClick={onSelect}
          className="px-3 py-1  bg-blue-900 text-white rounded-full text-sm"
        >
          Select
        </button>
      </div>
    </div>
  );
}
