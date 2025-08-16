import { Link } from "react-router-dom";
import Book from "../../../models/Book";
import { useTranslation } from "react-i18next";

export const SearchBook: React.FC<{ book: Book }> = ({ book }) => {
    const { t } = useTranslation();

    if (!book) return null;

    const copies = typeof book.copiesInStock === "number" ? book.copiesInStock : null;
    const isAvailable = copies === null ? null : copies > 0;

    const availabilityLabel =
        isAvailable === null
            ? t("search_page.unknown")
            : isAvailable
                ? t("search_page.available")
                : t("search_page.notAvailable");

    const availabilityBadgeClass =
        isAvailable === null
            ? "bg-secondary text-white"
            : isAvailable
                ? "bg-success"
                : "bg-warning text-dark";

    const imageSrc = book.image ? book.image : require("../../../Images/Books/book-1.png");

    return (
        <div className="card mt-4 p-4 border-0 shadow-sm rounded-4 bg-white">
            <div className="row g-0">
                {/* Image */}
                <div className="col-md-2 d-flex justify-content-center align-items-start">
                    <img
                        src={imageSrc}
                        width="140"
                        height="220"
                        alt={book.title}
                        className="rounded-2 border"
                    />
                </div>

                {/* Main info */}
                <div className="col-md-7">
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start">
                            <h4 className="fw-bold text-dark mb-1">{book.title}</h4>
                            <span
                                className={`badge px-3 py-2 rounded-pill fw-semibold ${availabilityBadgeClass}`}
                                aria-live="polite"
                            >
                                {availabilityLabel}
                            </span>
                        </div>

                        <h6 className="text-muted mb-3">
                            <span className="fw-semibold text-dark me-1">
                                {t("search_page.author")}
                            </span>
                            {book.author ?? "-"}
                        </h6>

                        <p className="card-text mb-0" style={{ textAlign: "justify" }}>
                            {book.overview ?? "-"}
                        </p>
                    </div>
                </div>

                {/* Action */}
                <div className="col-md-3 d-flex justify-content-center align-items-center">
                    <Link
                        className="btn btn-md main-color rounded-pill text-white invert-hover"
                        to={`/checkout/${book.id}`}
                    >
                        {t("search_page.viewDetails")}
                    </Link>
                </div>
            </div>
        </div>
    );
};
