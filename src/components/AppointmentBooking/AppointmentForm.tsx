// "use client";

// import { useState } from "react";
// import { loadStripe } from "@stripe/stripe-js";
// import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
// import SelectedSession from "./SelectedSession";

// const stripePromise = loadStripe("pk_test_YOUR_KEY_HERE");

// /* Stripe Payment Form */
// function CheckoutForm({ amount }: { amount: number }) {
//   const stripe = useStripe();
//   const elements = useElements();
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!stripe || !elements) return;

//     setLoading(true);
//     const card = elements.getElement(CardElement);
//     if (!card) return;

//     const { error, paymentMethod } = await stripe.createPaymentMethod({
//       type: "card",
//       card,
//     });

//     if (error) {
//       setMessage(error.message || "Payment failed");
//     } else {
//       setMessage("Payment successful! PaymentMethod ID: " + paymentMethod.id);
//     }
//     setLoading(false);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <CardElement className="p-3 border rounded" />
//       <button
//         type="submit"
//         disabled={!stripe || loading}
//         className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:opacity-90"
//       >
//         {loading ? "Processing..." : `Pay Rs. ${amount}`}
//       </button>
//       {message && (
//         <div className="flex items-center gap-2 bg-yellow-100 border border-yellow-300 rounded-md px-3 py-2 text-sm text-yellow-800 mt-2">
//           <img src="/assets/info-icon.png" alt="info" className="w-5 h-5" />
//           <span>{message}</span>
//         </div>
//       )}
//     </form>
//   );
// }

// /* MAIN FORM */
// export default function AppointmentForm({ selectedDoctor }: { selectedDoctor: any | null }) {
//   const [form, setForm] = useState({
//     name: "",
//     phone: "",
//     email: "",
//     notes: "",
//     sms: true,
//     emailConfirm: false,
//     member: false,
//     paymentMethod: "bill",
//     sltPhone: "",
//   });

//   const [message, setMessage] = useState("");
//   const onChange = (k: string, v: any) => setForm((s) => ({ ...s, [k]: v }));

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!form.sltPhone) {
//       setMessage("SLT Phone Number is required.");
//       return;
//     }

//     if (form.paymentMethod === "card") {
//       setMessage("Please complete payment below before confirming booking.");
//     } else {
//       setMessage("Booking Completed!");
//     }
//   };

//   const totalAmount = 3000;

//   return (
//     <div className="flex justify-center py-10 px-4">
//       <form
//         onSubmit={handleSubmit}
//         className="w-full max-w-6xl flex flex-col lg:flex-row gap-8 overflow-y-auto"
//       >
//         {/* LEFT PANEL - FORM */}
//         <div className="flex-1 space-y-8">

//           {/* ⭐ UPDATED SELECTED SESSION BLOCK ⭐ */}
//           <div className="space-y-2">
//             <label className="text-sm text-gray-600 font-medium">Selected Session</label>

//             <div className="bg-[#F5F7FA] border border-gray-200 rounded-xl p-5">

//               {!selectedDoctor ? (
//                 <p className="text-gray-500 text-sm">No session selected</p>
//               ) : (
//                 <div className="flex flex-col gap-1">

//                   {/* Doctor Name */}
//                   <p className="text-[17px] font-semibold text-gray-900">
//                     {selectedDoctor.name}
//                   </p>

//                   {/* Specialization */}
//                   {selectedDoctor.specialization && (
//                     <p className="text-sm text-gray-700">
//                       {selectedDoctor.specialization}
//                     </p>
//                   )}

//                   {/* Hospital */}
//                   {selectedDoctor.hospital && (
//                     <p className="text-sm text-gray-500">
//                       {selectedDoctor.hospital}
//                     </p>
//                   )}

//                   {/* Green Time Chip */}
//                   <div className="mt-3 inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
//                     {selectedDoctor.date ? `${selectedDoctor.date} | ` : ""}
//                     {selectedDoctor.available}
//                   </div>

//                 </div>
//               )}

//             </div>
//           </div>

//           {/* PATIENT INFO */}
//           <div className="space-y-6 bg-gray-50 p-6 rounded-lg">
//             <div className="flex justify-between items-center">
//               <h4 className="text-base font-semibold text-gray-800">Patient Information</h4>
//               <div className="flex items-center gap-2 text-sm">
//                 <span className="text-gray-500">Member or Guest</span>
//                 <input
//                   type="checkbox"
//                   checked={form.member}
//                   onChange={(e) => onChange("member", e.target.checked)}
//                   className="w-5 h-5"
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

//               {/* Name */}
//               <div className="relative">
//                 <img src="/assets/user-icon.png" className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
//                 <input
//                   value={form.name}
//                   onChange={(e) => onChange("name", e.target.value)}
//                   className="w-full border border-gray-300 rounded-lg px-10 py-2 text-sm focus:ring-2 focus:ring-[#0B60E0] outline-none"
//                   placeholder="Patient Name"
//                   required
//                 />
//               </div>

//               {/* Phone */}
//               <div className="relative">
//                 <img src="/assets/phone-icon.png" className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
//                 <input
//                   value={form.phone}
//                   onChange={(e) => onChange("phone", e.target.value)}
//                   className="w-full border border-gray-300 rounded-lg px-10 py-2 text-sm focus:ring-2 focus:ring-[#0B60E0] outline-none"
//                   placeholder="Phone Number"
//                   required
//                 />
//               </div>

//               {/* Email */}
//               <div className="relative">
//                 <img src="/assets/email-icon.png" className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
//                 <input
//                   value={form.email}
//                   onChange={(e) => onChange("email", e.target.value)}
//                   className="w-full border border-gray-300 rounded-lg px-10 py-2 text-sm focus:ring-2 focus:ring-[#0B60E0] outline-none"
//                   placeholder="Email"
//                 />
//               </div>

//               {/* SLT Phone */}
//               <div className="relative">
//                 <img src="/assets/phone-icon.png" className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
//                 <input
//                   value={form.sltPhone}
//                   onChange={(e) => onChange("sltPhone", e.target.value)}
//                   className="w-full border border-gray-300 rounded-lg px-10 py-2 text-sm focus:ring-2 focus:ring-[#0B60E0] outline-none"
//                   placeholder="SLT Phone Number"
//                   required
//                 />
//               </div>

//               {/* Notes */}
//               <div className="md:col-span-2">
//                 <textarea
//                   value={form.notes}
//                   onChange={(e) => onChange("notes", e.target.value)}
//                   rows={4}
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#0B60E0] outline-none"
//                   placeholder="Notes / Special Requests"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* PAYMENT METHOD */}
//           <div className="bg-gray-50 p-6 rounded-lg space-y-4">
//             <h4 className="text-base font-semibold text-gray-800">Payment Method</h4>

//             <select
//               value={form.paymentMethod}
//               onChange={(e) => onChange("paymentMethod", e.target.value)}
//               className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white focus:ring-2 focus:ring-[#0B60E0] outline-none"
//             >
//               <option value="bill">Add to Bill</option>
//               <option value="card">Credit / Debit Card</option>
//               <option value="mobile">Mobile Payment</option>
//             </select>
//           </div>

//           {/* CONFIRMATION CHECKBOXES */}
//           <div className="flex flex-col md:flex-row gap-4">
//             <label className="flex items-center gap-2 text-sm">
//               <input type="checkbox" checked={form.sms} onChange={(e) => onChange("sms", e.target.checked)} className="w-4 h-4" />
//               Send SMS Confirmation
//             </label>

//             <label className="flex items-center gap-2 text-sm">
//               <input type="checkbox" checked={form.emailConfirm} onChange={(e) => onChange("emailConfirm", e.target.checked)} className="w-4 h-4" />
//               Send Email Confirmation
//             </label>
//           </div>

//           {/* MESSAGE */}
//           {message && (
//             <div className="flex items-center gap-2 bg-yellow-100 border border-yellow-300 rounded-md px-3 py-2 text-sm text-yellow-800">
//               <img src="/assets/info-icon.png" alt="info" className="w-5 h-5" />
//               <span>{message}</span>
//             </div>
//           )}

//           {/* TOTAL AMOUNT */}
//           <div className="border border-gray-200 rounded-lg bg-green-50 p-4 flex justify-between items-center">
//             <span className="text-sm font-medium">Total Amount</span>
//             <span className="text-green-700 font-bold">Rs. {totalAmount}</span>
//           </div>

//           {/* STRIPE PAYMENT */}
//           {form.paymentMethod === "card" && (
//             <Elements stripe={stripePromise}>
//               <CheckoutForm amount={totalAmount} />
//             </Elements>
//           )}

//           {/* BUTTONS */}
//           <div className="flex justify-end items-center gap-3 pt-4">
//             <button
//               type="button"
//               className="px-6 py-3 rounded-full bg-gray-200 text-gray-900 font-medium hover:bg-gray-300 transition"
//               onClick={() => setForm({
//                 name: "",
//                 phone: "",
//                 email: "",
//                 notes: "",
//                 sms: true,
//                 emailConfirm: false,
//                 member: false,
//                 paymentMethod: "bill",
//                 sltPhone: "",
//               })}
//             >
//               Cancel
//             </button>

//             <button
//               type="submit"
//               className="px-6 py-3 rounded-full bg-gradient-to-r from-[#23DE4F] to-[#330FFB] text-white font-medium hover:opacity-95 transition"
//             >
//               Confirm Booking
//             </button>
//           </div>
//         </div>

//         {/* RIGHT PANEL IMAGE */}
//         <div className="flex-1 hidden lg:flex items-center justify-center">
//           <img src="/assets/doctor-placeholder.png" alt="Doctor" className="w-full h-auto rounded-lg" />
//         </div>
//       </form>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  FaUser,
  FaPhoneAlt,
  FaMobileAlt,
  FaEnvelope,
  FaCreditCard,
} from "react-icons/fa";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_YOUR_KEY_HERE"
);

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
    <form onSubmit={handleSubmit} className="space-y-3">
      <CardElement
        options={{
          style: {
            base: {
              color: "#111827",
              fontSize: "16px",
              "::placeholder": { color: "#6B7280" },
            },
          },
        }}
        className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
      />
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

export default function AppointmentForm({
  selectedDoctor,
}: {
  selectedDoctor: any | null;
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
  const [loading, setLoading] = useState(false);
  const onChange = (k: string, v: any) => setForm((s) => ({ ...s, [k]: v }));

  const totalAmount = selectedDoctor?.consultationFee || 3000;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.sltPhone) {
      setMessage("SLT Phone Number is required.");
      return;
    }

    if (!selectedDoctor) {
      setMessage("Please select a doctor first.");
      return;
    }

    if (form.paymentMethod === "card") {
      setMessage("Please complete payment below before confirming booking.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const appointmentData = {
        doctorId: selectedDoctor.id,
        availabilityId: selectedDoctor.availabilityId,
        patientName: form.name,
        patientPhone: form.phone,
        patientEmail: form.email,
        sltPhone: form.sltPhone,
        notes: form.notes,
        appointmentDate: new Date().toISOString().split("T")[0], // Today's date
        appointmentTime: selectedDoctor.available.split("–")[0].trim(), // Extract start time
        paymentMethod: form.paymentMethod,
        totalAmount: totalAmount,
        isMember: form.member,
        sendSms: form.sms,
        sendEmail: form.emailConfirm,
      };

      const response = await fetch("/api/appointments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Booking Completed Successfully!");
        // Reset form after successful booking
        setTimeout(() => {
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
        }, 3000);
      } else {
        setMessage(`❌ ${data.error || "Booking failed. Please try again."}`);
      }
    } catch (error) {
      console.error("Booking error:", error);
      setMessage(
        "❌ Network error. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col h-full space-y-4 overflow-y-auto"
    >
      {/* Selected Session */}
      <div className="text-gray-700 font-semibold">Selected Session</div>
      <div className="bg-gray-50 border border-gray-300 rounded-md p-3 text-sm text-gray-700 mb-2">
        {selectedDoctor ? (
          <div>
            <div className="font-semibold">{selectedDoctor.name}</div>
            <div className="text-xs text-gray-600">
              {selectedDoctor.specialty} • {selectedDoctor.hospital}
            </div>
            <div className="text-xs text-green-600 mt-1">
              {selectedDoctor.available}
            </div>
          </div>
        ) : (
          "No doctor selected"
        )}
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

        <div className="relative">
          <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={form.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="Patient Name *"
            required
            className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 text-sm text-gray-900 placeholder-gray-500 bg-white focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        <div className="relative">
          <FaPhoneAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={form.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            placeholder="Phone Number *"
            required
            className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 text-sm text-gray-900 placeholder-gray-500 bg-white focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        <div className="relative">
          <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={form.email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="Email"
            className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 text-sm text-gray-900 placeholder-gray-500 bg-white focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        <div className="relative">
          <FaMobileAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={form.sltPhone}
            onChange={(e) => onChange("sltPhone", e.target.value)}
            placeholder="SLT Phone Number *"
            required
            className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 text-sm text-gray-900 placeholder-gray-500 bg-white focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        <textarea
          value={form.notes}
          onChange={(e) => onChange("notes", e.target.value)}
          placeholder="Notes / Special Requests"
          rows={3}
          className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-900 placeholder-gray-500 bg-white focus:ring-2 focus:ring-blue-400 outline-none"
        />
      </div>

      {/* Payment Method */}
      <div className="relative">
        <FaCreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <select
          value={form.paymentMethod}
          onChange={(e) => onChange("paymentMethod", e.target.value)}
          className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 text-sm text-gray-900 bg-white focus:ring-2 focus:ring-blue-400 outline-none"
        >
          <option value="bill">Add to Bill</option>
          <option value="card">Credit / Debit Card</option>
          <option value="mobile">Mobile Payment</option>
        </select>
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
          <input
            type="checkbox"
            checked={form.sms}
            onChange={(e) => onChange("sms", e.target.checked)}
            className="w-4 h-4"
          />
          Send SMS Confirmation
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.emailConfirm}
            onChange={(e) => onChange("emailConfirm", e.target.checked)}
            className="w-4 h-4"
          />
          Send Email Confirmation
        </label>
      </div>

      {/* Message Box */}
      {message && (
        <div
          className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
            message.includes("✅")
              ? "bg-green-100 border border-green-300 text-green-800"
              : "bg-yellow-100 border border-yellow-300 text-yellow-800"
          }`}
        >
          <span>{message}</span>
        </div>
      )}

      {/* Buttons */}
      <div className="flex items-center gap-4 pt-4 justify-between">
        <button
          type="submit"
          disabled={loading || !selectedDoctor}
          className="px-6 py-2 bg-blue-900 text-white font-semibold hover:opacity-90 transition shadow-md rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Processing..." : "Confirm Booking"}
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
