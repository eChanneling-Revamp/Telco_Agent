import React from "react";

const QuickActions = () => {
  return (
    
    <div className="bg-white w-93 rounded-xl shadow-sm p-6 h-80 ml-4 mr-2">
      <h3 className="mb-4 text-gray-500 ">Quick Actions</h3>
      <br></br>
      <button className="w-full bg-blue-900 text-white py-4 px-4 rounded-lg mb-3 hover:bg-blue-800 transition">
        Book Appointment
      </button>
      <button className="w-full bg-blue-900 text-white py-4 px-4 rounded-lg mb-3 hover:bg-blue-800 transition">
        View Appointments
      </button>
    </div>
  );
};

export default QuickActions;
