"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle, AlertCircle, Loader } from "lucide-react";
import Sidebar from "../../../components/dashboard/SideBar";
import Header from "../../../components/dashboard/Header";
import BulkBookingContainer from "../../../components/BulkBooking/BulkBookingContainer";

type PopupType = "success" | "error" | null;

export default function AddBulkBookingPage() {
  const [selectedAccount, setSelectedAccount] = useState("Account 1");
  const [cart, setCart] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [popup, setPopup] = useState<PopupType>(null);

  const handleAccountChange = (account: string) => setSelectedAccount(account);

  const handlePlaceBookings = async () => {
    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }

    setIsLoading(true);

    try {
      // Submit each appointment to the backend
      const bookingPromises = cart.map(async (item) => {
        const appointmentData = {
          doctorId: item.selectedDoctor.id,
          availabilityId: null,

          // ❗ FIX FIELD NAMES
          name: item.patientName,
          mobile: item.patientMobile,
          email: null,

          nic: item.patientNIC,
          dob: item.patientDOB,
          gender: item.patientGender,
          age: item.patientAge,

          sltPhone: item.patientMobile,
          notes: `NIC: ${item.patientNIC}, DOB: ${item.patientDOB}, Gender: ${item.patientGender}, Age: ${item.patientAge}`,

          appointmentDate: item.appointmentDate,
          appointmentTime: item.selectedTime,

          paymentMethod: "bill",
          totalAmount: item.totalPrice,

          isMember: false,
          sendSms: true,
          sendEmail: false,
          agreeRefund: item.refundDeposit,
        };

        const response = await fetch("/api/appointments/create", {
          // ✅ CORRECT
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(appointmentData),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to book appointment");
        }

        return await response.json();
      });

      // Wait for all bookings to complete
      await Promise.all(bookingPromises);

      setPopup("success");
      // Auto-close success popup after 2 seconds and clear cart
      setTimeout(() => {
        setPopup(null);
        setCart([]);
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Error placing bookings:", error);
      setPopup("error");
      setIsLoading(false);
      // Auto-close error popup after 3 seconds
      setTimeout(() => setPopup(null), 3000);
    }
  };

  return (
    <div className="flex h-screen bg-[#eaeaea]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-0">
        <Header />

        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="p-3 sm:p-4 md:p-6">
            <div className="flex items-center gap-2 mb-4 sm:mb-6 text-black">
              <span className="text-xs sm:text-sm opacity-70">Dashboard</span>
              <span className="opacity-70">›</span>
              <span className="text-xs sm:text-sm">Bulk Booking</span>
            </div>
            <div className="mb-2">
              <div className="bg-transparent rounded-xl p-2">
                <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-semibold text-gray-900">
                      Bulk Booking
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                      Add multiple appointments and pay once
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="max-w-[1400px] mx-auto p-2">
              <div className="grid grid-cols-12 gap-6 items-start text-black">
                {/* LEFT APPOINTMENT BOX */}
                <div className="col-span-12 lg:col-span-8">
                  <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Add New Appointment
                      </h3>

                      <Link href="/BulkBooking">
                        <button className="px-4 md:px-5 py-2 md:py-2.5 rounded-lg border border-gray-300 text-gray-700 bg-white shadow-sm hover:bg-gray-50 transition-all font-semibold text-sm md:text-base">
                          Cancel
                        </button>
                      </Link>
                    </div>

                    <div className="max-h-[70vh] overflow-y-auto pr-2">
                      <BulkBookingContainer cart={cart} setCart={setCart} />
                    </div>
                  </div>
                </div>

                {/* RIGHT CART */}
                <div className="col-span-12 lg:col-span-4">
                  <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
                    <h3 className="text-xl font-semibold mb-4 text-gray-900">
                      Booking Cart
                    </h3>

                    {cart.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">🛒</div>
                        <p className="text-sm text-gray-500">Cart is empty</p>
                        <p className="text-xs text-gray-400 mt-2">
                          Add appointments to get started
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="max-h-[50vh] overflow-y-auto space-y-3 pr-2">
                          {cart.map((item, index) => (
                            <div
                              key={index}
                              className="border border-gray-200 bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 relative shadow-sm hover:shadow-md transition-shadow"
                            >
                              {/* Remove Button */}
                              <button
                                onClick={() => {
                                  const updated = [...cart];
                                  updated.splice(index, 1);
                                  setCart(updated);
                                }}
                                className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full p-1 transition-all"
                                title="Remove appointment"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>

                              <div className="pr-8">
                                <p className="font-semibold text-gray-900">
                                  {item.patientName}
                                </p>
                                <p className="text-sm text-gray-900">
                                  {item.selectedDoctor.name}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {item.selectedDoctor.specialty}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {item.selectedDoctor.hospital}
                                </p>
                                <p className="text-xs text-gray-500">
                                  DOB: {item.patientDOB}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Gender: {item.patientGender}
                                </p>
                                <p className="text-xs text-gray-500 mb-1">
                                  Age: {item.patientAge}
                                </p>

                                <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                  </svg>
                                  <span className="text-xs">
                                    {item.appointmentDate}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                  <span className="text-xs">
                                    {item.selectedTime}
                                  </span>
                                </div>

                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                                  <span className="text-sm font-semibold text-gray-700">
                                    Fee:
                                  </span>
                                  <span className="font-bold text-blue-600">
                                    Rs. {item.totalPrice}
                                  </span>
                                </div>

                                {item.refundDeposit && (
                                  <div className="flex items-center gap-1 mt-1">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-4 w-4 text-green-600"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    <span className="text-green-600 text-xs font-medium">
                                      + Rs. 250 Refundable Deposit
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        <hr className="border-gray-200" />

                        <div className="space-y-2 bg-gray-50 rounded-xl p-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              Total Appointments:
                            </span>
                            <span className="font-semibold text-gray-900">
                              {cart.length}
                            </span>
                          </div>

                          <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                            <span className="font-semibold text-gray-900">
                              Total Amount:
                            </span>
                            <span className="font-bold text-blue-600 text-xl">
                              Rs.{" "}
                              {cart
                                .reduce((sum, item) => {
                                  const fee =
                                    Number(
                                      item.selectedDoctor.consultation_fee
                                    ) || 0;
                                  return (
                                    sum + fee + (item.refundDeposit ? 250 : 0)
                                  );
                                }, 0)
                                .toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={handlePlaceBookings}
                          disabled={isLoading}
                          className="w-full py-4 rounded-lg bg-teal-500 text-white font-semibold hover:bg-teal-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {isLoading ? (
                            <>
                              <Loader className="w-5 h-5 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            "Place All Bookings"
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {popup === "success" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-sm w-full mx-4 animate-scale-in">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Success!</h3>
              <p className="text-gray-600">
                All appointments have been booked successfully.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Popup */}
      {popup === "error" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-sm w-full mx-4 animate-scale-in">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Error</h3>
              <p className="text-gray-600">
                Failed to book appointments. Please try again.
              </p>
              <button
                onClick={() => setPopup(null)}
                className="w-full mt-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
