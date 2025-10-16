import { Eye, X, RotateCcw } from 'lucide-react';

type Appointment = {
  id: number;
  patientName: string;
  doctor: string;
  date: string;
  time: string;
  status: 'Confirmed' | 'Cancelled' | 'Pending';
};

type AppointmentTableProps = {
  appointments?: Appointment[];
  getStatusColor?: (status: string) => string;
};

const defaultGetStatusColor = (status: string) => {
  switch (status) {
    case 'Confirmed':
      return 'bg-green-100 text-green-700';
    case 'Cancelled':
      return 'bg-red-100 text-red-700';
    case 'Pending':
      return 'bg-yellow-100 text-yellow-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const defaultAppointments: Appointment[] = [
  {
    id: 1,
    patientName: 'John Doe',
    doctor: 'Dr. Sarah Wilson',
    date: '2025-05-15',
    time: '10:00 AM',
    status: 'Confirmed',
  },
  {
    id: 2,
    patientName: 'Mary Smith',
    doctor: 'Dr. James Brown',
    date: '2025-05-15',
    time: '11:45 AM',
    status: 'Cancelled',
  },
  {
    id: 3,
    patientName: 'Robert Johnson',
    doctor: 'Dr. Emily Clark',
    date: '2025-05-16',
    time: '09:30 AM',
    status: 'Confirmed',
  },
  {
    id: 4,
    patientName: 'Patricia Williams',
    doctor: 'Dr. Michael Lee',
    date: '2025-05-16',
    time: '02:15 PM',
    status: 'Pending',
  },
  {
    id: 5,
    patientName: 'Jennifer Davis',
    doctor: 'Dr. David Chen',
    date: '2025-05-17',
    time: '10:30 AM',
    status: 'Confirmed',
  },
];

export default function AppointmentTable({ 
  appointments = defaultAppointments, 
  getStatusColor = defaultGetStatusColor 
}: AppointmentTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full bg-white">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Patient Name
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Doctor
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Date
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Time
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Status
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {appointments.map((apt) => (
              <tr key={apt.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-6 text-sm text-gray-900">{apt.patientName}</td>
                <td className="px-6 py-6 text-sm text-gray-900">{apt.doctor}</td>
                <td className="px-6 py-6 text-sm text-gray-600">{apt.date}</td>
                <td className="px-6 py-6 text-sm text-gray-600">{apt.time}</td>
                <td className="px-6 py-6">
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium ${getStatusColor(
                      apt.status
                    )}`}
                  >
                    {apt.status}
                  </span>
                </td>
                <td className="px-6 py-6">
                  <div className="flex items-center gap-2">
                    <button
                      className="p-1.5 text-green-600 hover:bg-blue-50 rounded-lg transition"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {apt.status === 'Cancelled' ? (
                      <button
                        className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-lg transition"
                        title="Reschedule"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Cancel"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-between">
        <p className="text-sm text-gray-600">Showing {appointments.length} of 24 appointments</p>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm border border-gray-300 bg-white rounded-lg hover:bg-gray-50 transition">
            Previous
          </button>
        </div>
      </div>
    </div>
  );
}