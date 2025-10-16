"use client";

import { useState } from "react";
import SideBar from "@/components/dashboard/SideBar";
import DashboardPage from "./dashboard/page";

export default function Home() {
  const [selectedAccount, setSelectedAccount] = useState("Account 1");

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col">
        {/* <Header  */}
        {/* selectedAccount={selectedAccount}
          onAccountChange={setSelectedAccount}
        /> */}

        <main className="flex-1 overflow-auto">
          {/* <MainContainer /> */}
          {/* <DashboardPage /> */}
        </main>
      </div>
    </div>
  );
}
