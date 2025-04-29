import { useEffect, useState } from "react";
import Book from "../../models/Book";
import { BreathingLoader } from "../Widgets/BreathingLoader";
import { RatingStars } from "../Widgets/RatingStars";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";

export const CheckoutBook = () => {

    const [book, setBook] = useState<Book>();
    const [loading, setLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    const bookId = (window.location.pathname).split('/')[2];

    useEffect(() => {
        const fetchBook = async () => {
            const apiUrl: string = `http://localhost:8080/api/books/${bookId}`;

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
    }, []);

    if (loading) {
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

    return (
        <div className="book-checkout">
            {/* Desktop Layout */}
            <div className="container d-none d-lg-block">
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
                            <p className="card-text">{book?.overview}</p>
                            <RatingStars rating={4.6} size={22} />
                        </div>
                    </div>
                    <CheckoutAndReviewBox book={book} mobile={false} />
                </div>
                <hr />
            </div>
            {/* Mobile Layout */}
            <div className="container d-lg-none">
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
                        <RatingStars rating={4.5} size={22} />
                    </div>
                </div>
                <CheckoutAndReviewBox book={book} mobile={true} />
                <hr />
            </div>
        </div>
    );
}