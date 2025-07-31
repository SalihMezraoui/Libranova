import { useEffect, useState } from "react";
import Review from "../../models/Review";
import { BreathingLoader } from "../Widgets/BreathingLoader";
import { ReviewComponent } from "../Widgets/ReviewComponent";
import { Pagination } from "../Widgets/Pagination";
import { useTranslation } from "react-i18next";

export const ReviewList = () => {

    const { t } = useTranslation();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalReviews, setTotalReviews] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const bookId = (window.location.pathname.split('/')[2]);
    console.log("ReviewList bookId:", bookId);

    useEffect(() => {
        const fetchReviews = async () => {
            const apiUrl: string = `${process.env.REACT_APP_API_URL}/reviews/search/findByBookId?bookId=${bookId}&page=${currentPage - 1}&size=${pageSize}`;

            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const jsonResponse = await response.json();

            const responseData = jsonResponse._embedded.reviews

            setTotalReviews(jsonResponse.page.totalElements);
            setTotalPages(jsonResponse.page.totalPages);

            const loadedReviews: Review[] = [];


            for (const key in responseData) {
                loadedReviews.push({
                    id: responseData[key].id,
                    userEmail: responseData[key].userEmail,
                    date: responseData[key].date,
                    rating: responseData[key].rating,
                    bookId: responseData[key].bookId,
                    reviewDescription: responseData[key].reviewDescription,
                });
            }

            setReviews(loadedReviews);
            setLoading(false);
        };
        fetchReviews().catch((error: any) => {
            setLoading(false);
            setHttpError(error.message);
        })
    }, [currentPage]);

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

    const indexOfLastReview: number = currentPage * pageSize;
    const indexOfFirstReview: number = indexOfLastReview - pageSize;

    let lastItem = pageSize * currentPage <= totalReviews ? pageSize * currentPage : totalReviews;

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="container mt-5 mb-5">
            <div d-flex justify-content-between align-items-center mb-4>
                <h2>{t('review_list.title')} ({reviews.length})</h2>
            </div>
            <div className="text fs-5">
                {t('review_list.pagination_text', {
                    from: indexOfFirstReview + 1,
                    to: lastItem,
                    total: totalReviews
                })}
            </div>
            <div className="row g-4 mt-4">
                {reviews.map(review => (
                    <ReviewComponent review={review} key={review.id} />
                ))}
            </div>

            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />}
        </div>
    );
}