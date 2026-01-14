"use client";
import React, { useState, useEffect, useMemo } from "react";

import SearchFilters from "@/components/receipts/SearchFilters";
import ReceiptsTable from "@/components/receipts/ReceiptsTable";
import Pagination from "@/components/receipts/Pagination";
import SideBar from "@/components/dashboard/SideBar";
import Header from "@/components/dashboard/Header";

const ReceiptPage = () => {
  const [selectedAccount, setSelectedAccount] = useState<string>("default");
  const [receipts, setReceipts] = useState<any[]>([]); // ✅ Add state for receipts
  const [loading, setLoading] = useState(true); // ✅ Add loading state
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const receiptsPerPage = 8;

  // ✅ Fetch receipts on mount
  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const response = await fetch("/api/receipts"); // Adjust API endpoint
        const data = await response.json();
        setReceipts(data.receipts || []);
      } catch (error) {
        console.error("Error fetching receipts:", error);
        setReceipts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReceipts();
  }, []);

  const filteredReceipts = useMemo(() => {
    return receipts.filter((receipt) => {
      const matchesSearch =
        searchQuery === "" ||
        receipt.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        receipt.patient.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDateRange = (() => {
        if (!startDate && !endDate) return true;
        const receiptDate = new Date(receipt.date);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        if (start && end) return receiptDate >= start && receiptDate <= end;
        if (start) return receiptDate >= start;
        if (end) return receiptDate <= end;
        return true;
      })();

      const matchesStatus =
        statusFilter === "" || receipt.status === statusFilter;

      return matchesSearch && matchesDateRange && matchesStatus;
    });
  }, [receipts, searchQuery, startDate, endDate, statusFilter]);

  const paginatedReceipts = useMemo(() => {
    const startIndex = (currentPage - 1) * receiptsPerPage;
    const endIndex = startIndex + receiptsPerPage;
    return filteredReceipts.slice(startIndex, endIndex);
  }, [filteredReceipts, currentPage, receiptsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, startDate, endDate, statusFilter]);

  const handlePreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));

  const handleNextPage = () => {
    const totalPages = Math.ceil(filteredReceipts.length / receiptsPerPage);
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // ✅ Show loading state
  if (loading) {
    return (
      <div className="flex h-screen bg-[#eaeaea]">
        <SideBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#eaeaea]">
      <SideBar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          selectedAccount={selectedAccount}
          onAccountChange={setSelectedAccount}
        />
        <div className="flex-1 flex flex-col overflow-hidden p-6">
          <div className="flex items-center gap-2 mb-6 text-black">
            <span className="text-sm opacity-70">Dashboard</span>
            <span className="opacity-70">›</span>
            <span className="text-sm">Receipt Management</span>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <SearchFilters
              searchQuery={searchQuery}
              startDate={startDate}
              endDate={endDate}
              statusFilter={statusFilter}
              onSearchChange={setSearchQuery}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
              onStatusFilterChange={setStatusFilter}
            />
            <ReceiptsTable receipts={paginatedReceipts} />
            <Pagination
              currentPage={currentPage}
              totalReceipts={filteredReceipts.length}
              receiptsPerPage={receiptsPerPage}
              onPreviousPage={handlePreviousPage}
              onNextPage={handleNextPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptPage;