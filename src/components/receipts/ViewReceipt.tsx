import React from "react";
import { X, Download, Mail, Printer } from "lucide-react";

interface Receipt {
  id: string;
  patient: string;
  date: string;
  amount: string;
  status: "Paid" | "Refunded" | "Pending";
}

interface ReceiptModalProps {
  receipt: Receipt | null;
  isOpen: boolean;
  onClose: () => void;
}

const ViewReceipt = ({ receipt, isOpen, onClose }: ReceiptModalProps) => {
  if (!isOpen || !receipt) return null;

  return (
    <div className="fixed inset-0 bg-black/60  flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-green-700 to-teal-700 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Receipt Preview</h2>
          <button
            onClick={onClose}
            className="hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex justify-center gap-4 p-4 bg-gray-50 border-b">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition text-black">
            <Download size={18} />
            <span className="text-sm font-medium">Download PDF</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition text-black">
            <Mail size={18} />
            <span className="text-sm font-medium">Email</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition text-black">
            <Printer size={18} />
            <span className="text-sm font-medium">Print</span>
          </button>
        </div>

        <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-teal-600 to-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <div className="text-white text-3xl font-bold">H+</div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">
              MediCal Hospital
            </h3>
            <p className="text-gray-600 text-sm">
              123 Healthcare Avenue, Medical District
            </p>
            <p className="text-gray-600 text-sm">Phone: (555) 123-4567</p>
          </div>

          <div className="border-t-2 border-b-2 border-gray-200 py-6 mb-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-gray-600 text-sm mb-1">Receipt Number</p>
                <p className="font-semibold text-gray-800">{receipt.id}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-1">Date</p>
                <p className="font-semibold text-gray-800">{receipt.date}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm mb-1">Patient Name</p>
                <p className="font-semibold text-gray-800">{receipt.patient}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-1">Status</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    receipt.status === "Paid"
                      ? "bg-green-100 text-green-700"
                      : receipt.status === "Refunded"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {receipt.status}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-3">
              Services Rendered
            </h4>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-2 px-3 text-sm font-medium text-gray-600">
                    Description
                  </th>
                  <th className="text-right py-2 px-3 text-sm font-medium text-gray-600">
                    Qty
                  </th>
                  <th className="text-right py-2 px-3 text-sm font-medium text-gray-600">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-3 text-sm text-gray-700">
                    Medical Consultation
                  </td>
                  <td className="text-right py-3 px-3 text-sm text-gray-700">
                    1
                  </td>
                  <td className="text-right py-3 px-3 text-sm text-gray-700">
                    {receipt.amount}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-800">{receipt.amount}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Tax (0%)</span>
              <span className="text-gray-800">$0.00</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t-2 border-gray-300">
              <span className="text-lg font-bold text-gray-800">
                Total Amount
              </span>
              <span className="text-lg font-bold text-teal-600">
                {receipt.amount}
              </span>
            </div>
          </div>

          <div className="text-center text-sm text-gray-500">
            <p>Thank you for choosing MediCal Hospital</p>
            <p className="mt-2">
              For any queries, please contact our billing department
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewReceipt;
