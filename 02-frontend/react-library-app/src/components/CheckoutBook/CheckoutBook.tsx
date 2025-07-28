import { use, useEffect, useState } from "react";
import Book from "../../models/Book";
import { BreathingLoader } from "../Widgets/BreathingLoader";
import { RatingStars } from "../Widgets/RatingStars";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import Review from "../../models/Review";
import { RecentReviews } from "./RecentReviews";
import { useOktaAuth } from "@okta/okta-react";
import ReviewRequest from "../../models/ReviewRequest";

export const CheckoutBook = () => {

    const { authState } = useOktaAuth();

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

    const bookId = (window.location.pathname).split('/')[2];

    useEffect(() => {
        const fetchBook = async () => {
            const apiUrl: string = `${process.env.REACT_APP_API_URL}/books/${bookId}`;

            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const jsonResponse = await response.json();

            const loadedBook: Book = {
                id: jsonResponse.id,
                title: jsonResponse.title,
                author: jsonResponse.author,
                overview: jsonResponse.overview,
                overviewDe: jsonResponse.overviewDe,
                totalCopies: jsonResponse.totalCopies,
                copiesInStock: jsonResponse.copiesInStock,
                category: jsonResponse.category,
                image: jsonResponse.image,
            };
            console.log(loadedBook);
            setBook(loadedBook);
            setLoading(false);

        };
        fetchBook().catch((error: any) => {
            setLoading(false);
            setHttpError(error.message);
        })
    }, [isBookCheckedOut]);

    useEffect(() => {
        const fetchReviews = async () => {
            const apiUrl: string = `${process.env.REACT_APP_API_URL}/reviews/search/findByBookId?bookId=${bookId}`;

            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const jsonResponse = await response.json();

            const responseData = jsonResponse._embedded.reviews

            const loadedReviews: Review[] = [];

            let totalStars: number = 0;

            for (const key in responseData) {
                loadedReviews.push({
                    id: responseData[key].id,
                    userEmail: responseData[key].userEmail,
                    date: responseData[key].date,
                    rating: responseData[key].rating,
                    bookId: responseData[key].bookId,
                    reviewDescription: responseData[key].reviewDescription,
                });
                totalStars += responseData[key].rating;
            }

            if (loadedReviews) {
                const rounded = (Math.round((totalStars / loadedReviews.length) * 2) / 2).toFixed(1);
                setNumberOfStars(parseFloat(rounded));
            }

            setReviews(loadedReviews);
            setIsLoadingReview(false);
        };
        fetchReviews().catch((error: any) => {
            setIsLoadingReview(false);
            setHttpError(error.message);
        })
    }, [isReviewRemaining]);

    useEffect(() => {
        const fetchUserBookReview = async () => {
            if (authState && authState.isAuthenticated) {
                const apiUrl = `${process.env.REACT_APP_API_URL}/reviews/secure/hasreviewed?bookId=${bookId}`;
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
        fetchUserBookReview().catch((error: any) => {
            setIsLoadingReviewRemaining(false);
            setHttpError(error.message);
        })
    }, [authState]);

    useEffect(() => {
        const fetchUserLoans = async () => {
            if (authState && authState.isAuthenticated) {
                const apiUrl = `${process.env.REACT_APP_API_URL}/books/secure/currentloans/size`;
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
                const apiUrl = `${process.env.REACT_APP_API_URL}/books/secure/ischeckedout?bookId=${bookId}`;
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
            <div className='container mt-5'>
                <p>{httpError}</p>
            </div>
        );
    }

    async function checkoutBook() {
        const apiUrl = `${process.env.REACT_APP_API_URL}/books/secure/checkout?bookId=${bookId}`;
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

    async function submitReview(starInput: number, reviewDescription: string) {

        let bookId: number = 0;
        if (book?.id) {
            bookId = book.id;
        }

        const reviewRequest = new ReviewRequest(starInput, bookId, reviewDescription);
        const apiUrl = `${process.env.REACT_APP_API_URL}/reviews/secure`;
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
                        role="alert">You have to return books before checking out new ones!
                    </div>}
                <div className="row mt-5">
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
                    <CheckoutAndReviewBox book={book} mobile={false} currentLoans={currentLoans}
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
                        role="alert">You have to return books before checking out new ones!
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
                        <p className="card-text">{book?.overview}</p>
                        <RatingStars rating={numberOfStars} size={22} />
                    </div>
                </div>
                <CheckoutAndReviewBox book={book} mobile={true} currentLoans={currentLoans}
                    isAuthenticated={authState?.isAuthenticated} isCheckedOut={isBookCheckedOut}
                    checkoutBook={checkoutBook} isReviewRemaining={isReviewRemaining} submitReview={submitReview} />
                <hr />
                <RecentReviews reviews={reviews} bookId={book?.id} mobile={true} />
            </div>
        </div>
    );
}