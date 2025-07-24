import React from "react";

const Pagination = ({handlePageChange, currentPage,totalPages}) => {
  return (
    <div className="flex justify-center mt-6 text-gray-500">
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="previous"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="mr-4 flex items-center gap-1 disabled:opacity-50"
        >
          <svg
            className="mt-px"
            width="23"
            height="23"
            viewBox="0 0 23 23"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.75 12.5h11.5m-11.5 0 4.792-4.791M5.75 12.5l4.792 4.792"
              stroke="#6B7280"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Previous</span>
        </button>

        <div className="flex gap-2 text-sm md:text-base">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`flex items-center justify-center w-9 md:w-12 h-9 md:h-12 aspect-square rounded-md transition-all ${
                currentPage === i + 1
                  ? "bg-indigo-500 text-white"
                  : "hover:bg-gray-300/10"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <button
          type="button"
          aria-label="next"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="ml-4 flex items-center gap-1 disabled:opacity-50"
        >
          <span>Next</span>
          <svg
            className="mt-px"
            width="23"
            height="23"
            viewBox="0 0 23 23"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.25 11.5H5.75m11.5 0-4.792-4.79m4.792 4.79-4.792 4.792"
              stroke="#6B7280"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Pagination;
