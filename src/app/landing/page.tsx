// "use client";

// import React from "react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import LandingPageCard from "@/components/landing/LandingPageCard";

// export default function HomePage() {
//   const router = useRouter();

//   return (
//     <div className="flex h-screen bg-[#eaeaea]">
//       <div className="m-auto w-1/2 bg-white rounded-2xl shadow-xl p-8">
//         <div className="text-center mb-8">
//           <div className="flex items-center justify-center mb-4">
//             <Image
//               src="/assets/logo.png"
//               alt="eChanneling Logo"
//               width={220}
//               height={100}
//               className="mx-auto"
//             />
//           </div>
//           <h1 className="text-2xl font-bold text-gray-800">Welcome to eChannelling Portal</h1>
//         </div>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
//           <LandingPageCard
//             type="agent"
//             title="Agent Login"
//             description="Access the agent portal to manage appointments and patient information."
//             buttonText="Sign in as Agent"
//             onClick={() => router.push("/login")}
//           />
          
//           <LandingPageCard
//             type="admin"
//             title="Admin Login"
//             description="Access the admin portal to manage system settings and user accounts."
//             buttonText="Sign in as Admin"
//             onClick={() => router.push("/admin/login")}
//           />
//         </div>
        
//         <div className="mt-8 text-center text-xs text-gray-500">
//           © 2025 Sri Lanka Telecom - eChannelling
//         </div>
//       </div>
//     </div>
//   );
// }
