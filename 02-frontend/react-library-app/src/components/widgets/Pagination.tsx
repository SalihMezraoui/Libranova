import React from "react";
import { useTranslation } from "react-i18next";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  paginate: (pageNumber: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, paginate }) => {
  const { t } = useTranslation();

  const visiblePages = Array.from(
    { length: 5 },
    (_, i) => i + currentPage - 2
  ).filter(page => page > 0 && page <= totalPages);

  const handlePrevious = () => paginate(Math.max(1, currentPage - 1));
  const handleNext = () => paginate(Math.min(totalPages, currentPage + 1));

  return (
    <nav aria-label="Pagination Navigation">
      <ul className="pagination justify-content-center gap-2 flex-wrap">
        {/* First Page */}
        <li className="page-item">
          <button
            className="btn btn-primary btn-md rounded-pill px-3 hover-scale"
            onClick={() => paginate(1)}
            disabled={currentPage === 1}
          >
            {t("pagination.first")}
          </button>
        </li>

        {/* Previous Page */}
        <li className="page-item">
          <button
            className="btn btn-outline-primary btn-md rounded-pill px-3 hover-scale"
            onClick={handlePrevious}
            disabled={currentPage === 1}
          >
            &laquo;
          </button>
        </li>

        {/* Numbered Pages */}
        {visiblePages.map(number => (
          <li key={number} className="page-item">
            <button
              onClick={() => paginate(number)}
              className={`btn btn-md rounded-pill px-3 hover-scale ${
                currentPage === number
                  ? "btn-primary text-white shadow-lg"
                  : "btn-outline-secondary"
              }`}
            >
              {number}
            </button>
          </li>
        ))}

        {/* Next Page */}
        <li className="page-item">
          <button
            className="btn btn-outline-primary btn-md rounded-pill px-3 hover-scale"
            onClick={handleNext}
            disabled={currentPage === totalPages}
          >
            &raquo;
          </button>
        </li>

        {/* Last Page */}
        <li className="page-item">
          <button
            className="btn btn-primary btn-md rounded-pill px-3 hover-scale"
            onClick={() => paginate(totalPages)}
            disabled={currentPage === totalPages}
          >
            {t("pagination.last")}
          </button>
        </li>
      </ul>
      <style>
        {`
          .hover-scale:hover {
            transform: scale(1.05);
            transition: transform 0.2s ease-in-out;
          }
        `}
      </style>
    </nav>
  );
};
