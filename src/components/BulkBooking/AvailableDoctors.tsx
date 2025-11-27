export default function AvailableDoctors() {
  const doctors = [
    "Dr. Saman Perera",
    "Dr. Pawan Fernando",
    "Dr. Kamal Perera",
    "Dr. Pasan Silva",
  ];

  return (
    <div className="bg-green-50 border border-green-200 p-5 rounded-xl">
      <h4 className="text-gray-700 font-semibold mb-3 flex items-center gap-2">
        <svg
          className="w-6 h-6 text-green-600"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
        </svg>
        Available Doctors
      </h4>

      <div className="flex flex-wrap gap-3 text-black">
        {doctors.map((doc) => (
          <button
            key={doc}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-green-100 transition"
          >
            {doc}
          </button>
        ))}
      </div>
    </div>
  );
}
