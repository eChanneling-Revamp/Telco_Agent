import React from "react";

const Pagination = ({
  currentPage,
  totalReceipts,
  receiptsPerPage,
  onPreviousPage,
  onNextPage,
}: {
  currentPage: number;
  totalReceipts: number;
  receiptsPerPage: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
}) => {
  const startIndex = (currentPage - 1) * receiptsPerPage + 1;
  const endIndex = Math.min(currentPage * receiptsPerPage, totalReceipts);
  const totalPages = Math.ceil(totalReceipts / receiptsPerPage);
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <div className="flex justify-between items-center mt-4 pt-4 border-t">
      <p className="text-sm text-gray-500">
        Showing {startIndex} to {endIndex} of {totalReceipts} receipts
      </p>
      <div className="flex gap-2">
        <button
          className={`px-6 py-2 text-sm rounded-lg ${
            isFirstPage
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-200"
          }`}
          onClick={onPreviousPage}
          disabled={isFirstPage}
        >
          Previous
        </button>
        <button
          className={`px-6 py-2 text-sm rounded-lg ${
            isLastPage
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-linear-65 from-green-500 to-blue-800 text-white hover:bg-teal-700"
          }`}
          onClick={onNextPage}
          disabled={isLastPage}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
