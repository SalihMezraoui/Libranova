import { useEffect, useState } from "react";
import Review from "../../models/Review";
import { BreathingLoader } from "../Widgets/BreathingLoader";
import { ReviewComponent } from "../Widgets/ReviewComponent";
import { Pagination } from "../Widgets/Pagination";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

export const ReviewList = () => {

    // Translation hook
    const { t } = useTranslation();

    // Data states
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [httpError, setHttpError] = useState<string | null>(null);

    // Pagination states
    const [actualPage, setActualPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalReviews, setTotalReviews] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Get bookId from URL (robustly)
    const location = useLocation();
    const bookId = location.pathname.split("/")[2] ?? null;

    console.log("ReviewList bookId:", bookId);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                setHttpError(null);

                const apiUrl = `${process.env.REACT_APP_API_URL}/reviews/search/findReviewsByBookId?bookId=${bookId}&page=${actualPage - 1}&size=${pageSize}`;

                const response = await fetch(apiUrl);
                if (!response.ok) throw new Error("Failed to fetch reviews!");

                const { _embedded, page } = await response.json();

                const loadedReviews: Review[] = _embedded?.reviews?.map((review: any) => ({
                    id: review.id,
                    userEmail: review.userEmail,
                    createdAt: review.createdAt,
                    ratingValue: review.ratingValue,
                    bookId: review.bookId,
                    comment: review.comment,
                })) ?? [];

                setReviews(loadedReviews);
                setTotalReviews(page?.totalElements ?? 0);
                setTotalPages(page?.totalPages ?? 0);

            } catch (error: any) {
                setHttpError(error.message || "Something went wrong!");
            } finally {
                setLoading(false);
            }
        })();
    }, [bookId, actualPage, pageSize]);


    if (loading) {
        return <BreathingLoader />;
    }

    if (httpError) {
        return (
            <div className="alert alert-danger" role="alert">
                {httpError}
            </div>
        )
    }

    // Calculate indexes for slicing reviews
    const indexOfLastReview = Math.min(actualPage * pageSize, totalReviews);
    const indexOfFirstReview = indexOfLastReview - pageSize;

    // Handler to change pages
    const paginate = (pageNumber: number) => setActualPage(pageNumber);

    return (
        <div className="container mt-5 mb-5">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                <h2 className="fw-bold text-dark">
                    {t('review_list.title')}{" "}
                    <span className="text-muted fs-5">({reviews.length})</span>
                </h2>
               
            </div>

            {/* Reviews Grid */}
            <div className="row row-cols-1 row-cols-md-2 g-4 mt-4">
                {reviews.map(review => (
                    <div className="col" key={review.id}>
                        <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h5 className="card-title fw-semibold">{review.userEmail}</h5>
                                    <span className="badge bg-success rounded-pill">
                                        {review.ratingValue} ⭐
                                    </span>
                                </div>
                                <p className="card-text text-muted">{review.comment}</p>
                            </div>
                            <div className="card-footer bg-light text-end text-muted fst-italic">
                                {new Date(review.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-5">
                    <Pagination
                        currentPage={actualPage}
                        totalPages={totalPages}
                        paginate={paginate}
                    />
                </div>
            )}
        </div>
    );
}