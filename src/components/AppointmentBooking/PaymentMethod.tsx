"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_YOUR_KEY_HERE");

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

    if (error) {
      setMessage(error.message || "Payment failed");
    } else {
      setMessage("Payment successful! PaymentMethod ID: " + paymentMethod.id);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement className="p-3 border rounded" />
      <button
        type="submit"
        disabled={!stripe || loading}
        className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:opacity-90"
      >
        {loading ? "Processing..." : `Pay Rs. ${amount}`}
      </button>
      {message && (
        <div className="flex items-center gap-2 bg-yellow-100 border border-yellow-300 rounded-md px-3 py-2 text-sm text-yellow-800 mt-2">
          <img src="/assets/info-icon.png" alt="info" className="w-5 h-5" />
          <span>{message}</span>
        </div>
      )}
    </form>
  );
}

export default function AppointmentForm({ selectedDoctor }: { selectedDoctor: any | null }) {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // SLT Phone is always required
    if (!form.sltPhone) {
      setMessage("SLT Phone Number is required.");
      return;
    }

    if (form.paymentMethod === "card") {
      setMessage("Please complete payment below before confirming booking.");
    } else {
      setMessage("Booking Completed!");
    }
  };

  const totalAmount = 3000;

  return (
    <div className="flex justify-center py-10 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-6xl flex flex-col lg:flex-row gap-8 overflow-y-auto"
      >
        {/* Left Side - Form */}
        <div className="flex-1 space-y-8">
          {/* Selected Doctor */}
          <div className="space-y-2">
            <label className="text-sm text-gray-600 font-medium">Selected Session</label>
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 text-sm text-gray-700">
              {selectedDoctor ? `${selectedDoctor.name} — ${selectedDoctor.available}` : "No doctor selected"}
            </div>
          </div>

          {/* Patient Info */}
          <div className="space-y-6 bg-gray-50 p-6 rounded-lg">
            <div className="flex justify-between items-center">
              <h4 className="text-base font-semibold text-gray-800">Patient Information</h4>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Member or Guest</span>
                <input
                  type="checkbox"
                  checked={form.member}
                  onChange={(e) => onChange("member", e.target.checked)}
                  className="w-5 h-5"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div className="relative">
                <img src="/assets/user-icon.png" className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  value={form.name}
                  onChange={(e) => onChange("name", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-10 py-2 text-sm focus:ring-2 focus:ring-[#0B60E0] outline-none"
                  placeholder="Patient Name"
                  required
                />
              </div>

              {/* Phone */}
              <div className="relative">
                <img src="/assets/phone-icon.png" className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  value={form.phone}
                  onChange={(e) => onChange("phone", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-10 py-2 text-sm focus:ring-2 focus:ring-[#0B60E0] outline-none"
                  placeholder="Phone Number"
                  required
                />
              </div>

              {/* Email */}
              <div className="relative">
                <img src="/assets/email-icon.png" className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  value={form.email}
                  onChange={(e) => onChange("email", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-10 py-2 text-sm focus:ring-2 focus:ring-[#0B60E0] outline-none"
                  placeholder="Email"
                />
              </div>

              {/* SLT Phone - always required */}
              <div className="relative">
                <img src="/assets/phone-icon.png" className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  value={form.sltPhone}
                  onChange={(e) => onChange("sltPhone", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-10 py-2 text-sm focus:ring-2 focus:ring-[#0B60E0] outline-none"
                  placeholder="SLT Phone Number"
                  required
                />
              </div>

              {/* Notes */}
              <div className="md:col-span-2">
                <textarea
                  value={form.notes}
                  onChange={(e) => onChange("notes", e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#0B60E0] outline-none"
                  placeholder="Notes / Special Requests"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-gray-50 p-6 rounded-lg space-y-4">
            <h4 className="text-base font-semibold text-gray-800">Payment Method</h4>
            <select
              value={form.paymentMethod}
              onChange={(e) => onChange("paymentMethod", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white focus:ring-2 focus:ring-[#0B60E0] outline-none"
            >
              <option value="bill">Add to Bill</option>
              <option value="card">Credit / Debit Card</option>
              <option value="mobile">Mobile Payment</option>
            </select>
            {/* Mobile payment does NOT add extra SLT Phone input */}
          </div>

          {/* Confirmation Options */}
          <div className="flex flex-col md:flex-row gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.sms} onChange={(e) => onChange("sms", e.target.checked)} className="w-4 h-4" />
              Send SMS Confirmation
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.emailConfirm} onChange={(e) => onChange("emailConfirm", e.target.checked)} className="w-4 h-4" />
              Send Email Confirmation
            </label>
          </div>

          {/* Message Box */}
          {message && (
            <div className="flex items-center gap-2 bg-yellow-100 border border-yellow-300 rounded-md px-3 py-2 text-sm text-yellow-800">
              <img src="/assets/info-icon.png" alt="info" className="w-5 h-5" />
              <span>{message}</span>
            </div>
          )}

          {/* Total Amount */}
          <div className="border border-gray-200 rounded-lg bg-green-50 p-4 flex justify-between items-center">
            <span className="text-sm font-medium">Total Amount</span>
            <span className="text-green-700 font-bold">Rs. {totalAmount}</span>
          </div>

          {/* Stripe Payment Form */}
          {form.paymentMethod === "card" && (
            <Elements stripe={stripePromise}>
              <CheckoutForm amount={totalAmount} />
            </Elements>
          )}

          {/* Buttons */}
          <div className="flex justify-end items-center gap-3 pt-4">
            <button
              type="button"
              className="px-6 py-3 rounded-full bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition"
              onClick={() => setForm({
                name: "",
                phone: "",
                email: "",
                notes: "",
                sms: true,
                emailConfirm: false,
                member: false,
                paymentMethod: "bill",
                sltPhone: "",
              })}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-full bg-gradient-to-r from-[#23DE4F] to-[#330FFB] text-white font-medium hover:opacity-95 transition"
            >
              Confirm Booking
            </button>
          </div>
        </div>

        {/* Right Side - Optional Image or Info */}
        <div className="flex-1 hidden lg:flex items-center justify-center">
          <img src="/assets/doctor-placeholder.png" alt="Doctor" className="w-full h-auto rounded-lg" />
        </div>
      </form>
    </div>
  );
}