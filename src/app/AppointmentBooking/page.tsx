// "use client";

// import Sidebar from "../../components/dashboard/SideBar";
// import Header from "../../components/dashboard/Header";
// import DoctorSearch from "../../components/AppointmentBooking/DoctorSearch";
// import { useState, useEffect } from "react";
// import { loadStripe } from "@stripe/stripe-js";
// import {
//   Elements,
//   CardElement,
//   useStripe,
//   useElements,
// } from "@stripe/react-stripe-js";
// import {
//   FaUser,
//   FaPhoneAlt,
//   FaMobileAlt,
//   FaEnvelope,
//   FaCreditCard,
// } from "react-icons/fa";
// import { useRouter } from "next/navigation";

// const stripePromise = loadStripe("pk_test_YOUR_KEY_HERE");

// // Stripe Payment Form
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

//     if (error) setMessage(error.message || "Payment failed");
//     else
//       setMessage("Payment successful! PaymentMethod ID: " + paymentMethod.id);

//     setLoading(false);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-3">
//       <CardElement
//         options={{
//           style: {
//             base: {
//               color: "#111827", // dark text
//               fontSize: "16px",
//               "::placeholder": { color: "#6B7280" }, // darkish placeholder
//             },
//           },
//         }}
//         className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
//       />
//       <button
//         type="submit"
//         disabled={!stripe || loading}
//         className="w-full bg-blue-900 text-white font-medium py-2 rounded-lg hover:opacity-90 transition"
//       >
//         {loading ? "Processing..." : `Pay Rs. ${amount}`}
//       </button>
//       {message && (
//         <div className="flex items-center gap-2 bg-yellow-100 border border-yellow-300 rounded-md px-3 py-2 text-sm text-yellow-800 mt-2">
//           <span>{message}</span>
//         </div>
//       )}
//     </form>
//   );
// }

// // Appointment Form
// function AppointmentForm({
//   selectedDoctor,
//   onSubmit,
// }: {
//   selectedDoctor: any | null;
//   onSubmit?: (data: any, onSuccess?: () => void) => void;
// }) {
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

//   const [totalAmount, setTotalAmount] = useState<number | null>(
//     selectedDoctor?.consultationFee ?? null
//   );

//   useEffect(() => {
//     setTotalAmount(selectedDoctor?.consultationFee ?? null);
//   }, [selectedDoctor]);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (form.sltPhone.trim() === "") {
//       setMessage("SLT Phone Number is required.");
//       return;
//     }

//     if (form.paymentMethod === "card") {
//       setMessage("Please complete payment below before confirming booking.");
//       return;
//     }

//     // Build payload and pass to onSubmit for API call
//     const payload = {
//       doctorId: selectedDoctor?.id,
//       availabilityId: selectedDoctor?.availabilityId,
//       patientName: form.name,
//       patientPhone: form.phone,
//       patientEmail: form.email,
//       sltPhone: form.sltPhone,
//       notes: form.notes,
//       appointmentDate: new Date().toISOString().split("T")[0],
//       appointmentTime: selectedDoctor?.available?.split("–")[0]?.trim() || "",
//       paymentMethod: form.paymentMethod,
//       totalAmount: selectedDoctor?.consultationFee || 3000,
//       isMember: form.member,
//       sendSms: form.sms,
//       sendEmail: form.emailConfirm,
//     };

//     if (onSubmit)
//       onSubmit(payload, () => {
//         setForm({
//           name: "",
//           phone: "",
//           email: "",
//           notes: "",
//           sms: true,
//           emailConfirm: false,
//           member: false,
//           paymentMethod: "bill",
//           sltPhone: "",
//         });
//         setMessage("✅ Booking Completed!");
//       });
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="flex flex-col h-full space-y-4 overflow-y-auto text-black"
//     >
//       {/* Selected Session */}
//       <div className="text-gray-700 font-semibold">Selected Session</div>
//       <div className="bg-gray-50 border border-gray-300 rounded-md p-3 text-sm text-gray-700 mb-2">
//         {selectedDoctor
//           ? `${selectedDoctor.name} — ${selectedDoctor.available}`
//           : "No doctor selected"}
//       </div>

//       {/* Patient Info */}
//       <div className="flex flex-col space-y-3">
//         <div className="flex justify-between items-center text-sm font-medium">
//           <span>Patient Information</span>
//         </div>

//         {/* Name */}
//         <div className="relative">
//           <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//           <input
//             value={form.name}
//             onChange={(e) => onChange("name", e.target.value)}
//             placeholder="Patient Name *"
//             className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 text-sm text-gray-900 placeholder-gray-500 bg-white focus:ring-2 focus:ring-blue-400 outline-none"
//           />
//         </div>

//         {/* Phone */}
//         <div className="relative">
//           <FaPhoneAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//           <input
//             value={form.phone}
//             onChange={(e) => onChange("phone", e.target.value)}
//             placeholder="Phone Number *"
//             className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 text-sm text-gray-900 placeholder-gray-500 bg-white focus:ring-2 focus:ring-blue-400 outline-none"
//           />
//         </div>

//         {/* Email */}
//         <div className="relative">
//           <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//           <input
//             value={form.email}
//             onChange={(e) => onChange("email", e.target.value)}
//             placeholder="Email"
//             className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 text-sm text-gray-900 placeholder-gray-500 bg-white focus:ring-2 focus:ring-blue-400 outline-none"
//           />
//         </div>

//         {/* Notes */}
//         <textarea
//           value={form.notes}
//           onChange={(e) => onChange("notes", e.target.value)}
//           placeholder="Notes / Special Requests"
//           rows={3}
//           className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-900 placeholder-gray-500 bg-white focus:ring-2 focus:ring-blue-400 outline-none"
//         />
//       </div>

//       {/* Payment Method + SLT Phone */}
//       <div className="flex gap-2 items-center">
//         <div className="relative w-1/2">
//           <FaCreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//           <select
//             value={form.paymentMethod}
//             onChange={(e) => onChange("paymentMethod", e.target.value)}
//             className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 text-sm text-gray-900 placeholder-gray-500 bg-white focus:ring-2 focus:ring-blue-400 outline-none"
//           >
//             <option value="bill">Add to Bill</option>
//             {/* <option value="card">Credit / Debit Card</option> */}
//             <option value="mobile">Mobile Payment</option>
//           </select>
//         </div>

//         <div className="relative w-1/2">
//           <FaMobileAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//           <input
//             value={form.sltPhone}
//             onChange={(e) => onChange("sltPhone", e.target.value)}
//             placeholder="SLT Phone Number"
//             className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 text-sm text-gray-900 placeholder-gray-500 bg-white focus:ring-2 focus:ring-blue-400 outline-none"
//             required
//           />
//         </div>
//       </div>

//       {/* Total Amount (only show when a doctor is selected) */}
//       {totalAmount != null && (
//         <div className="flex justify-between items-center bg-green-50 border border-green-200 rounded-md px-4 py-2 text-sm font-medium text-gray-800">
//           <span>Total Amount</span>
//           <span className="text-green-700 font-bold">Rs. {totalAmount}</span>
//         </div>
//       )}

//       {/* Stripe Payment */}
//       {form.paymentMethod === "card" && totalAmount != null && (
//         <div className="mt-2 flex-1 overflow-y-auto">
//           <Elements stripe={stripePromise}>
//             <CheckoutForm amount={totalAmount} />
//           </Elements>
//         </div>
//       )}

//       {/* Confirmation Options */}
//       <div className="flex flex-col space-y-1 text-sm">
//         <label className="flex items-center gap-2">
//           <input
//             type="checkbox"
//             checked={form.sms}
//             onChange={(e) => onChange("sms", e.target.checked)}
//             className="w-4 h-4"
//           />
//           Send SMS Confirmation
//         </label>
//         <label className="flex items-center gap-2">
//           <input
//             type="checkbox"
//             checked={form.emailConfirm}
//             onChange={(e) => onChange("emailConfirm", e.target.checked)}
//             className="w-4 h-4"
//           />
//           Send Email Confirmation
//         </label>
//       </div>

//       {/* Message Box */}
//       {message && (
//         <div className="flex items-center gap-2 bg-yellow-100 border border-yellow-300 rounded-md px-3 py-2 text-sm text-yellow-800">
//           <span>{message}</span>
//         </div>
//       )}

//       {/* Buttons */}
//       <div className="flex items-center gap-4 pt-4 justify-between">
//         <button
//           type="submit"
//           className="px-6 py-2  bg-blue-900 text-white font-semibold hover:opacity-90 transition shadow-md rounded-xl"
//         >
//           Confirm Booking
//         </button>
//         <button
//           type="button"
//           className="px-4 py-2 text-blue-500 font-semibold hover:underline transition"
//           onClick={() => {
//             setForm({
//               name: "",
//               phone: "",
//               email: "",
//               notes: "",
//               sms: true,
//               emailConfirm: false,
//               member: false,
//               paymentMethod: "bill",
//               sltPhone: "",
//             });
//             setMessage("");
//           }}
//         >
//           Cancel
//         </button>
//       </div>
//     </form>
//   );
// }

// // Main Page
// export default function AppointmentBookingPage() {
//   const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null);
//   const router = useRouter();

//   // called when the form wants to create an appointment
//   const handleCreateAppointment = async (
//     payload: any,
//     onSuccess?: () => void
//   ) => {
//     try {
//       const res = await fetch("/api/appointments/create", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();
//       if (res.ok) {
//         // navigate to appointment management page to view created appointment
//         router.push("/Appointments");
//         if (onSuccess) onSuccess();
//       } else {
//         alert(data.error || "Booking failed");
//       }
//     } catch (err) {
//       console.error("Booking error", err);
//       alert("Network error while booking");
//     }
//   };
//   const cardStyle =
//     "bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col p-8 min-h-[750px]";

//   return (
//     <div
//       className="flex h-screen bg-[#eaeaea]"
//       // style={{
//       //   backgroundImage: `url('/assets/bg.png')`,
//       //   backgroundSize: "cover",
//       //   backgroundPosition: "center",
//       //   backgroundRepeat: "no-repeat",
//       // }}
//     >
//       <Sidebar />
//       <div className="flex-1 flex flex-col relative z-10 overflow-y-auto">
//         <Header />
//         <div className="p-3 sm:p-4 md:p-6">
//           <div className="flex items-center gap-2 mb-4 sm:mb-2 text-black">
//             <span className="text-xs sm:text-sm opacity-70">Dashboard</span>
//             <span className="opacity-70">›</span>
//             <span className="text-xs sm:text-sm">Appoinment Booking</span>
//           </div>

//           <div className="flex justify-center px-2 py-2 gap-6">
//             <div className={`${cardStyle} flex-1`}>
//               <h2 className="text-2xl font-bold text-gray-800 mb-6">
//                 Find Doctor / Hospital
//               </h2>
//               <div className="flex-1 overflow-y-auto">
//                 <DoctorSearch onSelectDoctor={setSelectedDoctor} />
//               </div>
//             </div>
//             <div className={`${cardStyle} w-full lg:w-[45%]`}>
//               <h2 className="text-2xl font-bold text-gray-800 mb-6">
//                 Appointment Details
//               </h2>
//               <div className="flex-1 overflow-y-auto">
//                 <AppointmentForm
//                   selectedDoctor={selectedDoctor}
//                   onSubmit={handleCreateAppointment}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import Sidebar from "../../components/dashboard/SideBar";
import Header from "../../components/dashboard/Header";
import SearchDoctor from "../../components/AppointmentBooking/SearchDoctor";
import SelectDateTime from "../../components/AppointmentBooking/SelectDateTime";
import PriceAndPatient from "../../components/AppointmentBooking/PriceAndPatient";
import AppointmentSummary from "../../components/AppointmentBooking/AppointmentSummary";

type Doctor = {
  id: number;
  name: string;
  specialty: string;
  hospital: string;
  hospitalType: "Private" | "Government";
  city: string;
  available: string;
  availabilityId: number;
  consultationFee: number;
  slotsAvailable: number;
};

export default function AppointmentBookingPage() {
  const [step, setStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [patientData, setPatientData] = useState<any>(null);

  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setStep(2);
  };

  const handleDateTimeSelect = (date: string, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setStep(3);
  };

  const handlePatientSubmit = (data: any) => {
    setPatientData(data);
    setStep(4);
  };

  const handleConfirm = async () => {
    if (!selectedDoctor || !patientData) return;

    try {
      const payload = {
        doctorId: selectedDoctor.id,
        availabilityId: selectedDoctor.availabilityId,
        patientName: patientData.name,
        patientPhone: patientData.mobile,
        patientEmail: "",
        sltPhone: patientData.mobile,
        notes: "",
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        paymentMethod: "bill",
        totalAmount: patientData.totalPrice,
        isMember: false,
        sendSms: true,
        sendEmail: false,
        agreeRefund: patientData.agreeRefund,
      };

      const response = await fetch("/api/appointments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Appointment booked successfully!");
        // Reset to step 1
        setStep(1);
        setSelectedDoctor(null);
        setSelectedDate("");
        setSelectedTime("");
        setPatientData(null);
      } else {
        alert(data.error || "Booking failed");
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert("Network error while booking");
    }
  };

  return (
    <div className="flex h-screen bg-[#eaeaea]">
      <Sidebar />
      <div className="flex-1 flex flex-col relative z-10 overflow-y-auto">
        <Header />
        <div className="p-3 sm:p-4 md:p-6">
          <div className="flex items-center gap-2 mb-4 sm:mb-2 text-black">
            <span className="text-xs sm:text-sm opacity-70">Dashboard</span>
            <span className="opacity-70">›</span>
            <span className="text-xs sm:text-sm">Appointment Booking</span>
          </div>

          {/* Render current step */}
          {step === 1 && <SearchDoctor onNext={handleDoctorSelect} />}

          {step === 2 && selectedDoctor && (
            <SelectDateTime
              doctor={selectedDoctor}
              onNext={handleDateTimeSelect}
              onBack={() => setStep(1)}
            />
          )}

          {step === 3 && selectedDoctor && (
            <PriceAndPatient
              doctor={selectedDoctor}
              date={selectedDate}
              time={selectedTime}
              onNext={handlePatientSubmit}
              onBack={() => setStep(2)}
            />
          )}

          {step === 4 && selectedDoctor && patientData && (
            <AppointmentSummary
              doctor={selectedDoctor}
              date={selectedDate}
              time={selectedTime}
              patientData={patientData}
              onConfirm={handleConfirm}
              onBack={() => setStep(3)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
