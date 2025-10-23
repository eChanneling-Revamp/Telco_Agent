"use client";
import React, { useState, useEffect, useMemo } from "react";

// import React from "react";
import StatusBadge from "./StatusBadge";

export interface Receipt {
  id: string;
  patient: string;
  date: string;
  amount: string;
  status: "Paid" | "Refunded" | "Pending";
}

interface ReceiptsTableProps {
  receipts: Receipt[];
}
const ReceiptsTable = ({ receipts }: { receipts: Receipt[] }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Receipt ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Patient
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {receipts.map((receipt, index) => (
            <tr key={`${receipt.id}-${index}`} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {receipt.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {receipt.patient}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {receipt.date}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {receipt.amount}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={receipt.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <button className="text-blue-600 hover:text-blue-800 font-medium">
                  View Receipt
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReceiptsTable