import React from "react";

interface Activity {
  patient: string;
  action: string;
  doctor: string;
  status: "Confirmed" | "Cancelled" | "Completed" | "Pending";
}

const activities: Activity[] = [
  {
    patient: "John Doe",
    action: "New Appointment",
    doctor: "Dr. Sarah Wilson",
    status: "Confirmed",
  },
  {
    patient: "Mary Smith",
    action: "Appointment Cancelled",
    doctor: "Dr. James Brown",
    status: "Cancelled",
  },
  {
    patient: "Robert Johnson",
    action: "Payment Received",
    doctor: "Dr. Emily Clark",
    status: "Completed",
  },
  {
    patient: "Patricia Williams",
    action: "Appointment Rescheduled",
    doctor: "Dr. Michael Lee",
    status: "Pending",
  },
];

const StatusBadge = ({ status }: { status: Activity["status"] }) => {
  const statusStyles = {
    Confirmed: "bg-green-100 text-green-600",
    Cancelled: "bg-red-100 text-red-600",
    Completed: "bg-blue-100 text-blue-600",
    Pending: "bg-yellow-100 text-yellow-600",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
};

const RecentActivity = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 ml-4 h-80  border border-gray-100">
      <h3 className=" mb-4 text-gray-500">Recent Activity</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patient
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Doctor
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {activities.map((activity, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">
                  {activity.patient}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {activity.action}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {activity.doctor}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={activity.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentActivity;
