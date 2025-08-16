import { use, useEffect, useState } from "react";
import Book from "../../models/Book";
import { BreathingLoader } from "../Widgets/BreathingLoader";
import { RatingStars } from "../Widgets/RatingStars";
import { ReviewCheckoutPanel } from "./ReviewCheckoutPanel";
import Review from "../../models/Review";
import { RecentReviews } from "./RecentReviews";
import { useOktaAuth } from "@okta/okta-react";
import ReviewRequest from "../../models/ReviewRequest";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";


export const CheckoutBook = () => {

    const { authState } = useOktaAuth();

    const { t } = useTranslation();

    const [book, setBook] = useState<Book>();
    const [loading, setLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    // Review states
    const [reviews, setReviews] = useState<Review[]>([]);
    const [numberOfStars, setNumberOfStars] = useState(0);
    const [isLoadingReview, setIsLoadingReview] = useState(true);

    const [isReviewRemaining, setIsReviewRemaining] = useState(false);
    const [isLoadingReviewRemaining, setIsLoadingReviewRemaining] = useState(true);

    // Loans states
    const [currentLoans, setCurrentLoans] = useState(0);
    const [isLoadingCurrentLoans, setIsLoadingCurrentLoans] = useState(true);

    // is the book checked out
    const [isBookCheckedOut, setIsBookCheckedOut] = useState(false);
    const [isLoadingBookCheckedOut, setIsLoadingBookCheckedOut] = useState(true);

    // Language state
    const [language, setLanguage] = useState<'en' | 'de'>('en');

    const [showError, setShowError] = useState(false);

    const { bookId } = useParams<{ bookId: string }>();


    useEffect(() => {
        const loadBookDetails = async () => {
            try {
                const endpoint = `${process.env.REACT_APP_API_URL}/books/search/findByIdAndDeletedFalse?id=${bookId}`;
                const res = await fetch(endpoint);

                if (!res.ok) {
                    throw new Error(`Failed to fetch book (status: ${res.status})`);
                }

                const data = await res.json();

                const bookData: Book = {
                    id: data.id,
                    title: data.title,
                    author: data.author,
                    overview: data.overview,
                    overviewDe: data.overviewDe,
                    totalCopies: data.totalCopies,
                    copiesInStock: data.copiesInStock,
                    category: data.category,
                    image: data.image,
                };

                setBook(bookData);
            } catch (err: any) {
                setHttpError(err.message ?? 'Unexpected error occurred');
            } finally {
                setLoading(false);
            }
        };

        loadBookDetails();
    }, [bookId, isBookCheckedOut]);


    useEffect(() => {
        const retrieveReviews = async () => {
            const url = `${process.env.REACT_APP_API_URL}/reviews/search/findReviewsByBookId?bookId=${bookId}`;

            const res = await fetch(url);
            if (!res.ok) {
                throw new Error('Something went wrong!');
            }

            const data = await res.json();
            const reviewsArray = data._embedded.reviews;

            const parsedReviews: Review[] = [];
            let totalRating = 0;

            for (const index in reviewsArray) {
                const review = reviewsArray[index];
                parsedReviews.push({
                    id: review.id,
                    userEmail: review.userEmail,
                    createdAt: review.createdAt,
                    ratingValue: review.ratingValue,
                    bookId: review.bookId,
                    comment: review.comment,
                });
                totalRating += review.ratingValue;
            }

            if (parsedReviews.length > 0) {
                const averageRating = totalRating / parsedReviews.length;
                const roundedRating = (Math.round(averageRating * 2) / 2).toFixed(1);
                setNumberOfStars(parseFloat(roundedRating));
            }

            setReviews(parsedReviews);
            setIsLoadingReview(false);
        };

        retrieveReviews().catch((error: any) => {
            setIsLoadingReview(false);
            setHttpError(error.message);
        });
    }, [isReviewRemaining]);


    useEffect(() => {
        const checkUserReviewStatus = async () => {
            if (authState && authState.isAuthenticated) {
                const apiUrl = `${process.env.REACT_APP_API_URL}/reviews/secure/has-reviewed?bookId=${bookId}`;
                const response = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };
                const res = await fetch(apiUrl, response);
                if (!res.ok) {
                    throw new Error('Something went wrong!');
                }
                const jsonResponse = await res.json();
                setIsReviewRemaining(jsonResponse);
            }
            setIsLoadingReviewRemaining(false);
        }
        checkUserReviewStatus().catch((error: any) => {
            setIsLoadingReviewRemaining(false);
            setHttpError(error.message);
        })
    }, [authState]);

    useEffect(() => {
        const fetchUserLoans = async () => {
            if (authState && authState.isAuthenticated) {
                const apiUrl = `${process.env.REACT_APP_API_URL}/books/secure/active-loans/size`;
                const response = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };
                const res = await fetch(apiUrl, response);
                if (!res.ok) {
                    throw new Error('Something went wrong!');
                }
                const jsonResponse = await res.json();
                setCurrentLoans(jsonResponse);
            }
            setIsLoadingCurrentLoans(false);
        }
        fetchUserLoans().catch((error: any) => {
            setIsLoadingCurrentLoans(false);
            setHttpError(error.message);
        })
    }, [authState, isBookCheckedOut]);

    useEffect(() => {
        const fetchIsBookCheckedOut = async () => {
            if (authState && authState.isAuthenticated) {
                const apiUrl = `${process.env.REACT_APP_API_URL}/books/secure/loans/exists?bookId=${bookId}`;
                const response = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };
                const res = await fetch(apiUrl, response);
                if (!res.ok) {
                    throw new Error('Something went wrong!');
                }
                const jsonResponse = await res.json();
                setIsBookCheckedOut(jsonResponse);
            }
            setIsLoadingBookCheckedOut(false);
        }
        fetchIsBookCheckedOut().catch((error: any) => {
            setIsLoadingBookCheckedOut(false);
            setHttpError(error.message);
        })
    }, [authState]);

    if (loading || isLoadingReview || isLoadingCurrentLoans || isLoadingBookCheckedOut || isLoadingReviewRemaining) {
        return (
            <BreathingLoader size={80} color="#003366" speed={1} />
        );
    }

    if (httpError) {
        return (
            <div className="container mt-5 text-center">
                <div className="alert alert-danger" role="alert" style={{ maxWidth: 400, margin: "auto" }}>
                    {httpError}
                </div>
            </div>
        );
    }

    async function checkoutBook() {
        const apiUrl = `${process.env.REACT_APP_API_URL}/books/secure/loans/checkout?bookId=${bookId}`;
        const response = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }
        };
        const res = await fetch(apiUrl, response);
        if (!res.ok) {
            setShowError(true);
            return;
        }
        setShowError(false);
        setIsBookCheckedOut(true);
    }

    async function submitReview(rating: number, comment: string) {

        const bookId = book?.id ?? 0;

        const reviewRequest = new ReviewRequest(rating, bookId, comment);
        const apiUrl = `${process.env.REACT_APP_API_URL}/reviews/secure/add-review`;
        const response = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reviewRequest)
        };
        const res = await fetch(apiUrl, response);
        if (!res.ok) {
            throw new Error('Something went wrong while submitting the review!');
        }
        setIsReviewRemaining(true);
    }

    return (
        <div className="book-checkout">
            {/* Desktop Layout */}
            <div className="container d-none d-lg-block">
                {showError &&
                    <div className="alert alert-danger mt-4"
                        role="alert">{t('alerts.checkoutError')}
                    </div>}
                <div className="row g-4 mt-5">
                    <div className="col-lg-3">
                        <div className="book-cover shadow-lg rounded-3 overflow-hidden">
                            {book?.image ? (
                                <img
                                    src={book.image}
                                    alt={book.title}
                                    className="img-fluid w-100 h-auto"
                                />
                            ) : (
                                <img
                                    src={require('./../../Images/Books/book-1.png')}
                                    alt="Default book cover"
                                    className="img-fluid w-100 h-auto"
                                />
                            )}
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="ml-2">
                            <h1 className="fw-bold mb-3">{book?.title}</h1>
                            <h5 className="text-primary">{book?.author}</h5>
                            <button
                                className="btn btn-sm btn-outline-secondary mb-2"
                                onClick={() => setLanguage(language === 'en' ? 'de' : 'en')}
                            >
                                {language === 'en' ? 'Deutsch anzeigen' : 'Show English'}
                            </button>
                            <p className="card-text">
                                {language === 'en' ? book?.overview : book?.overviewDe}
                            </p>

                            <RatingStars rating={numberOfStars} size={22} />
                        </div>
                    </div>
                    <ReviewCheckoutPanel book={book} mobile={false} currentLoans={currentLoans}
                        isAuthenticated={authState?.isAuthenticated} isCheckedOut={isBookCheckedOut}
                        checkoutBook={checkoutBook} isReviewRemaining={isReviewRemaining} submitReview={submitReview} />
                </div>
                <hr />
                <RecentReviews reviews={reviews} bookId={book?.id} mobile={false} />
            </div>
            {/* Mobile Layout */}
            <div className="container d-lg-none">
                {showError &&
                    <div className="alert alert-danger mt-4"
                        role="alert">{t('alerts.checkoutError')}
                    </div>}
                <div className="book-mobile-card shadow-sm rounded-4 p-3 mt-4"> {/* Card layout */}
                    <div className="text-center mb-4">
                        {book?.image ?
                            <img src={book.image} width='240' height='360'
                                alt={book.title} className="img-fluid" /> :
                            <img src={require('./../../Images/Books/book-1.png')}
                                width='240' height='360' alt="book" className="img-fluid" />
                        }
                    </div>
                </div>
                <div className="mt-4 ">
                    <div className="ml-2">
                        <h2 className="fw-bold mb-2">{book?.title}</h2>
                        <h5 className="text-primary mb-3">{book?.author}</h5>
                        <button
                            className="btn btn-sm btn-outline-secondary mb-2"
                            onClick={() => setLanguage(language === 'en' ? 'de' : 'en')}
                        >
                            {language === 'en' ? 'Deutsch anzeigen' : 'Show English'}
                        </button>
                        <p className="card-text">
                            {language === 'en' ? book?.overview : book?.overviewDe}
                        </p>
                        <RatingStars rating={numberOfStars} size={22} />
                    </div>
                </div>
                <ReviewCheckoutPanel book={book} mobile={true} currentLoans={currentLoans}
                    isAuthenticated={authState?.isAuthenticated} isCheckedOut={isBookCheckedOut}
                    checkoutBook={checkoutBook} isReviewRemaining={isReviewRemaining} submitReview={submitReview} />
                <hr />
                <RecentReviews reviews={reviews} bookId={book?.id} mobile={true} />
            </div>
        </div>
    );
}