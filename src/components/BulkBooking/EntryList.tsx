interface Entry {
  id: string;
  doctor: string;
  specialization: string;
  dateTime: string;
  patientName: string;
  patientNIC: string;
  patientPhone: string;
  patientEmail: string;
  paymentMethod: string;
  sltPhone: string;
  date: string;
  time: string;
}

interface EntryListProps {
  entries: Entry[];
  setEntries: (entries: Entry[]) => void;
}

export default function EntryList({ entries, setEntries }: EntryListProps) {
  const removeEntry = (id: string) => {
    const filtered = entries.filter((entry) => entry.id !== id);
    setEntries(filtered);
  };

  return (
    <div className="space-y-4">
      {entries.map((entry, index) => (
        <div
          key={entry.id}
          className="p-5 border border-gray-200 rounded-xl bg-white shadow-sm"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="font-semibold text-gray-800 text-base">
                {index + 1}. Appointment #{index + 1}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Entry ID: {entry.id} • {entry.dateTime}
              </p>
            </div>
            <button
              onClick={() => removeEntry(entry.id)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded transition"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1.5">Doctor</p>
              <input
                type="text"
                value={entry.doctor}
                readOnly
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50 text-gray-700"
              />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1.5">Patient Name</p>
              <input
                type="text"
                value={entry.patientName}
                placeholder="Full Name"
                readOnly
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50 text-gray-700"
              />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1.5">Patient NIC</p>
              <input
                type="text"
                value={entry.patientNIC}
                placeholder="e.g., 912345678V"
                readOnly
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50 text-gray-700"
              />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1.5">Patient Phone</p>
              <input
                type="text"
                value={entry.patientPhone}
                placeholder="+94 77 123 4567"
                readOnly
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50 text-gray-700"
              />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1.5">Patient Email</p>
              <input
                type="text"
                value={entry.patientEmail}
                placeholder="patient@example.com"
                readOnly
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50 text-gray-700"
              />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1.5">Payment Method</p>
              <input
                type="text"
                value={entry.paymentMethod}
                readOnly
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50 text-gray-700"
              />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1.5">SLT Phone Number</p>
              <input
                type="text"
                value={entry.sltPhone}
                placeholder="e.g, 0342222255"
                readOnly
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50 text-gray-700"
              />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1.5">Date</p>
              <input
                type="text"
                value={entry.date}
                placeholder="dd/mm/yy"
                readOnly
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50 text-gray-700"
              />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1.5">Time</p>
              <input
                type="text"
                value={entry.time}
                placeholder="Select Time"
                readOnly
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50 text-gray-700"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}