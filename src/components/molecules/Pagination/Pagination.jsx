
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import "./Pagination.css";

export default function Pagination({
    currentPage = 1,
    totalPages = 1,
    totalItems = 0,
    startIndex = 0,
    endIndex = 0,
    onPage,
    goToPage,
    nextPage,
    prevPage,
}) {
    const changePage = onPage || goToPage;

    if (totalItems <= 6 || totalPages <= 1) {
        return null;
    }

    const pages = [];

    const start = Math.max(1, currentPage - 1);
    const end = Math.min(totalPages, currentPage + 1);

    if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push("left-ellipsis");
    }

    for (let page = start; page <= end; page++) {
        pages.push(page);
    }

    if (end < totalPages) {
        if (end < totalPages - 1) pages.push("right-ellipsis");
        pages.push(totalPages);
    }

    return (
        <nav className="ems-pagination" aria-label="Pagination">
            <div className="ems-pagination-info">
                Showing <strong>{startIndex + 1}</strong>–
                <strong>{endIndex}</strong> of{" "}
                <strong>{totalItems}</strong> employees
            </div>

            <div className="ems-pagination-controls">
                <button
                    type="button"
                    className="ems-page-arrow"
                    onClick={() => (prevPage ? prevPage() : changePage?.(currentPage - 1))}
                    disabled={currentPage <= 1}
                    aria-label="Previous page"
                    title="Previous page"
                >
                    <ChevronLeft size={17} />
                </button>

                {pages.map((page) => {
                    if (typeof page !== "number") {
                        return (
                            <span className="ems-page-ellipsis" key={page}>
                                <MoreHorizontal size={16} />
                            </span>
                        );
                    }

                    return (
                        <button
                            type="button"
                            key={page}
                            className={`ems-page-number ${currentPage === page ? "active" : ""
                                }`}
                            onClick={() => changePage?.(page)}
                            aria-label={`Page ${page}`}
                            aria-current={currentPage === page ? "page" : undefined}
                        >
                            {page}
                        </button>
                    );
                })}

                <button
                    type="button"
                    className="ems-page-arrow"
                    onClick={() => (nextPage ? nextPage() : changePage?.(currentPage + 1))}
                    disabled={currentPage >= totalPages}
                    aria-label="Next page"
                    title="Next page"
                >
                    <ChevronRight size={17} />
                </button>
            </div>
        </nav>
    );
}