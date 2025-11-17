"use client";

import Sidebar from "../../components/dashboard/SideBar";
import Header from "../../components/dashboard/Header";
import DoctorSearch from "../../components/AppointmentBooking/DoctorSearch";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { FaUser, FaPhoneAlt, FaMobileAlt, FaEnvelope, FaCreditCard } from "react-icons/fa";

const stripePromise = loadStripe("pk_test_YOUR_KEY_HERE");

// Stripe Payment Form
function CheckoutForm({ amount }: { amount: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    const card = elements.getElement(CardElement);
    if (!card) return;

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) setMessage(error.message || "Payment failed");
    else setMessage("Payment successful! PaymentMethod ID: " + paymentMethod.id);

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <CardElement className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium py-2 rounded-lg hover:opacity-90 transition"
      >
        {loading ? "Processing..." : `Pay Rs. ${amount}`}
      </button>
      {message && (
        <div className="flex items-center gap-2 bg-yellow-100 border border-yellow-300 rounded-md px-3 py-2 text-sm text-yellow-800 mt-2">
          <span>{message}</span>
        </div>
      )}
    </form>
  );
}

// Appointment Form
function AppointmentForm({
  selectedDoctor,
  onSubmit,
}: {
  selectedDoctor: any | null;
  onSubmit?: (data: any) => void;
}) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    notes: "",
    sms: true,
    emailConfirm: false,
    member: false,
    paymentMethod: "bill",
    sltPhone: "",
  });

  const [message, setMessage] = useState("");
  const onChange = (k: string, v: any) => setForm((s) => ({ ...s, [k]: v }));

  const totalAmount = 3000;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // SLT Phone Validation
    if (form.sltPhone.trim() === "") {
      setMessage("SLT Phone Number is required.");
      return;
    }

    if (form.paymentMethod === "card") {
      setMessage("Please complete payment below before confirming booking.");
    } else {
      setMessage("Booking Completed!");
      if (onSubmit) onSubmit(form);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full space-y-4 overflow-y-auto">
      {/* Selected Session */}
      <div className="text-gray-700 font-semibold">Selected Session</div>
      <div className="bg-gray-50 border border-gray-300 rounded-md p-3 text-sm text-gray-700 mb-2">
        {selectedDoctor ? `${selectedDoctor.name} — ${selectedDoctor.available}` : "No doctor selected"}
      </div>

      {/* Patient Info */}
      <div className="flex flex-col space-y-3">
        <div className="flex justify-between items-center text-sm font-medium">
          <span>Patient Information</span>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500">Member</span>
            <input
              type="checkbox"
              checked={form.member}
              onChange={(e) => onChange("member", e.target.checked)}
              className="w-4 h-4"
            />
          </div>
        </div>

        {/* Name */}
        <div className="relative">
          <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={form.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="Patient Name *"
            className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* Phone */}
        <div className="relative">
          <FaPhoneAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={form.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            placeholder="Phone Number *"
            className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* Email */}
        <div className="relative">
          <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={form.email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="Email"
            className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* Notes */}
        <textarea
          value={form.notes}
          onChange={(e) => onChange("notes", e.target.value)}
          placeholder="Notes / Special Requests"
          rows={3}
          className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
        />
      </div>

      {/* Payment Method + SLT Phone */}
      <div className="flex gap-2 items-center">
        {/* Payment Method Select */}
        <div className="relative w-1/2">
          <FaCreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            value={form.paymentMethod}
            onChange={(e) => onChange("paymentMethod", e.target.value)}
            className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none bg-white"
          >
            <option value="bill">Add to Bill</option>
            <option value="card">Credit / Debit Card</option>
            <option value="mobile">Mobile Payment</option>
          </select>
        </div>

        {/* SLT Phone */}
        <div className="relative w-1/2">
          <FaMobileAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={form.sltPhone}
            onChange={(e) => onChange("sltPhone", e.target.value)}
            placeholder="SLT Phone Number"
            className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />
        </div>
      </div>

      {/* Total Amount */}
      <div className="flex justify-between items-center bg-green-50 border border-green-200 rounded-md px-4 py-2 text-sm font-medium text-gray-800">
        <span>Total Amount</span>
        <span className="text-green-700 font-bold">Rs. {totalAmount}</span>
      </div>

      {/* Stripe Payment */}
      {form.paymentMethod === "card" && (
        <div className="mt-2 flex-1 overflow-y-auto">
          <Elements stripe={stripePromise}>
            <CheckoutForm amount={totalAmount} />
          </Elements>
        </div>
      )}

      {/* Confirmation Options */}
      <div className="flex flex-col space-y-1 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.sms} onChange={(e) => onChange("sms", e.target.checked)} className="w-4 h-4" />
          Send SMS Confirmation
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.emailConfirm} onChange={(e) => onChange("emailConfirm", e.target.checked)} className="w-4 h-4" />
          Send Email Confirmation
        </label>
      </div>

      {/* Message Box */}
      {message && (
        <div className="flex items-center gap-2 bg-yellow-100 border border-yellow-300 rounded-md px-3 py-2 text-sm text-yellow-800">
          <span>{message}</span>
        </div>
      )}

      {/* Buttons */}
      <div className="flex items-center gap-4 pt-4 justify-between">
     <button
      type="submit"
      className="px-6 py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold hover:opacity-90 transition shadow-md rounded-xl"
    >
      Confirm Booking
    </button>



        <button
          type="button"
          className="px-4 py-2 text-blue-500 font-semibold hover:underline transition"
          onClick={() => {
            setForm({
              name: "",
              phone: "",
              email: "",
              notes: "",
              sms: true,
              emailConfirm: false,
              member: false,
              paymentMethod: "bill",
              sltPhone: "",
            });
            setMessage("");
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// Main Page
export default function AppointmentBookingPage() {
  const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null);

  const cardStyle = "bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col p-8 min-h-[750px]";

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{
        backgroundImage: `url('/assets/bg.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Sidebar />

      <div className="flex-1 flex flex-col relative z-10 overflow-y-auto">
        <Header />

        <div className="flex justify-center px-8 py-6 gap-6">
          {/* Left Card */}
          <div className={`${cardStyle} flex-1`}>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Find Doctor / Hospital</h2>
            <div className="flex-1 overflow-y-auto">
              <DoctorSearch onSelectDoctor={setSelectedDoctor} />
            </div>
          </div>

          {/* Right Card */}
          <div className={`${cardStyle} w-full lg:w-[45%]`}>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Appointment Details</h2>
            <div className="flex-1 overflow-y-auto">
              <AppointmentForm selectedDoctor={selectedDoctor} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
