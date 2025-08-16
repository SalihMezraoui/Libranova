import { BookReturn } from "./BookReturn";
import { useEffect, useState } from 'react';
import Book from "../../../models/Book";
import { Link } from "react-router-dom";
import { BreathingLoader } from "../../Widgets/BreathingLoader";
import { useTranslation } from "react-i18next";

const chunkArray = (arr: Book[], size: number): Book[][] => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
    }
    return chunks;
};

export const Carousel = () => {

    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const { t } = useTranslation();


    useEffect(() => {
        const fetchAllBooks = async () => {
            const apiUrl: string = `${process.env.REACT_APP_API_URL}/books/search/findByDeletedFalse`;

            const url: string = `${apiUrl}?page=0&size=9`;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const jsonResponse = await response.json();

            const responseData = jsonResponse._embedded.books;

            const loadedBooks: Book[] = [];

            for (const key in responseData) {
                loadedBooks.push({
                    id: responseData[key].id,
                    title: responseData[key].title,
                    author: responseData[key].author,
                    overview: responseData[key].overview,
                    totalCopies: responseData[key].totalCopies,
                    copiesInStock: responseData[key].copiesInStock,
                    category: responseData[key].category,
                    image: responseData[key].image,
                });
            }
            setBooks(loadedBooks);
            setLoading(false);

        };
        fetchAllBooks().catch((error: any) => {
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

    const slides = chunkArray(books, 3);

    return (
        <div className="container mt-5" style={{ minHeight: 570 }}>
            <div className="books-header mb-3">
                <h3>{t("carousel.title")}</h3>
            </div>

            {/* Desktop Carousel */}
            <div
                id="booksSlider"
                className="carousel carousel-dark slide d-none d-lg-block"
                data-bs-interval="false"
            >
                <div className="carousel-inner">
                    {slides.map((slideBooks, idx) => (
                        <div
                            key={idx}
                            className={`carousel-item${idx === 0 ? " active" : ""}`}
                        >
                            <div className="row justify-content-center align-items-center">
                                {slideBooks.map((book) => (
                                    <BookReturn key={book.id} book={book} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    className="carousel-control-prev position-absolute top-50 start-0 translate-middle-y ms-0 rounded-circle border-0"
                    type="button"
                    data-bs-target="#booksSlider"
                    data-bs-slide="prev"
                    style={{
                        width: "3rem",
                        height: "3rem",
                        padding: "0.5rem",
                        backgroundColor: "rgba(0,0,0,0.25)",
                        zIndex: 10,
                    }}
                >
                    <span className="carousel-control-prev-icon" aria-hidden="true" />
                    <span className="visually-hidden">{t("carousel.prev")}</span>
                </button>

                <button
                    className="carousel-control-next position-absolute top-50 end-0 translate-middle-y me-0 rounded-circle border-0"
                    type="button"
                    data-bs-target="#booksSlider"
                    data-bs-slide="next"
                    style={{
                        width: "3rem",
                        height: "3rem",
                        padding: "0.5rem",
                        backgroundColor: "rgba(0,0,0,0.25)",
                        zIndex: 10,
                    }}
                >
                    <span className="carousel-control-next-icon" aria-hidden="true" />
                    <span className="visually-hidden">{t("carousel.next")}</span>
                </button>
            </div>

            {/* Mobile Carousel - horizontal scroll */}
            <div className="d-lg-none mt-4 px-3">
                <div
                    className="d-flex overflow-auto gap-3 pb-2"
                    style={{ scrollSnapType: "x mandatory" }}
                >
                    {books.map((book) => (
                        <div
                            key={book.id}
                            className="flex-shrink-0"
                            style={{ scrollSnapAlign: "start", minWidth: 200 }}
                        >
                            <BookReturn book={book} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="books-footer mt-3 text-center">
                <Link
                    className="btn btn-outline-secondary btn-lg hover-grow"
                    to="/search"
                >
                    {t("carousel.more")}
                </Link>
            </div>
        </div>
    );
}