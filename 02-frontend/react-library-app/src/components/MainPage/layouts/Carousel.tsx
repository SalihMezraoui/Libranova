import { BookReturn } from "./BookReturn";
import { useEffect, useState } from 'react';
import Book from "../../../models/Book";
import { Link } from "react-router-dom";
import { BreathingLoader } from "../../Widgets/BreathingLoader";
import { useTranslation } from "react-i18next";


export const Carousel = () => {

    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const { t } = useTranslation();


    useEffect(() => {
        const fetchBooks = async () => {
            const apiUrl: string = `${process.env.REACT_APP_API_URL}/books`;

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
        fetchBooks().catch((error: any) => {
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
        <div className='container mt-5' style={{ height: 550 }}>
            <div className='books-header'>
                <h3>{t("carousel.title")}</h3>
            </div>
            <div id='booksSlider' className='carousel carousel-dark slide mt-5 
                d-none d-lg-block' data-bs-interval='false'>

                {/* Desktop-Karussel */}
                <div className='carousel-inner'>
                    <div className='carousel-item active'>
                        <div className='row d-flex justify-content-center align-items-center'>
                            {books.slice(0, 3).map((book) => (
                                <BookReturn book={book} key={book.id} />
                            ))}
                        </div>
                    </div>
                    <div className='carousel-item'>
                        <div className='row d-flex justify-content-center align-items-center'>
                            {books.slice(3, 6).map((book) => (
                                <BookReturn book={book} key={book.id} />
                            ))}
                        </div>
                    </div>
                    <div className='carousel-item'>
                        <div className='row d-flex justify-content-center align-items-center'>
                            {books.slice(6, 9).map((book) => (
                                <BookReturn book={book} key={book.id} />
                            ))}
                        </div>
                    </div>

                    <button className='carousel-control-prev position-absolute top-50 start-0 translate-middle-y ms-0 z-1 rounded-circle border-0'
                        type='button' data-bs-target='#booksSlider' data-bs-slide='prev'
                        style={{ width: '3rem', height: '3rem', padding: '0.5rem', backgroundColor: 'rgba(0, 0, 0, 0.25)' }}>
                        <span className='carousel-control-prev-icon' aria-hidden='true'></span>
                        <span className='visually-hidden'>{t("carousel.prev")}</span>
                    </button>

                    <button className='carousel-control-next position-absolute top-50 end-0 translate-middle-y me-0 z-1 rounded-circle border-0'
                        type='button' data-bs-target='#booksSlider' data-bs-slide='next'
                        style={{ width: '3rem', height: '3rem', padding: '0.5rem', backgroundColor: 'rgba(0, 0, 0, 0.25)' }}>
                        <span className='carousel-control-next-icon' aria-hidden='true'></span>
                        <span className='visually-hidden'>{t("carousel.next")}</span>
                    </button>
                </div>
            </div>

            {/* Mobile-karussel */}
            <div className='d-lg-none mt-4 px-3'>
                <div className='row d-flex justify-content-center align-items-center'>
                    <BookReturn book={books[7]} key={books[7].id} />
                </div>
            </div>
            <div className='books-footer mt-3'>
                <Link className='btn btn-outline-secondary btn-lg hover-grow' to='/search'>{t("carousel.more")}</Link>
            </div>
        </div>
    );
}