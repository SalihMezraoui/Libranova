import { useEffect, useState } from "react";
import Book from "../../../models/Book";
import { BreathingLoader } from "../../Widgets/BreathingLoader";
import { Pagination } from "../../Widgets/Pagination";
import { UpdateBookQuantity } from "./UpdateBookQuantity";
import { useTranslation } from "react-i18next";

export const UpdateBooksQuantity = () => {

    // Translation hook
    const { t } = useTranslation();

    // Data state
    const [bookItems, setBookItems] = useState<Book[]>([]);
    const [totalBooks, setTotalBooks] = useState(0);

    // Pagination state
    const [actualPage, setActualPage] = useState(1);
    const [booksPerPage] = useState(6);
    const [pageCount, setPageCount] = useState(0);

    // UI state
    const [loading, setLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [bookRemove, setBookRemove] = useState(false);

    useEffect(() => {
        const loadBooks = async () => {
            const apiUrl: string = `${process.env.REACT_APP_API_URL}/books/search/findByDeletedFalse?page=${actualPage - 1}&size=${booksPerPage}`;
            const data = await fetch(apiUrl);

            if (!data.ok) {
                throw new Error('Failed to fetch book data.!');
            }

            const jsonResponse = await data.json();

            const responseData = jsonResponse._embedded.books;

            setTotalBooks(jsonResponse.page.totalElements);
            setPageCount(jsonResponse.page.totalPages);


            const fetchedBooks: Book[] = [];

            for (const index in responseData) {
                fetchedBooks.push({
                    id: responseData[index].id,
                    title: responseData[index].title,
                    author: responseData[index].author,
                    overview: responseData[index].overview,
                    totalCopies: responseData[index].totalCopies,
                    copiesInStock: responseData[index].copiesInStock,
                    category: responseData[index].category,
                    image: responseData[index].image,
                });
            }
            setBookItems(fetchedBooks);
            setLoading(false);

        };
        loadBooks().catch((error: any) => {
            setLoading(false);
            setHttpError(error.message);
        })
    }, [actualPage, bookRemove]);

    const lastBookIndex = actualPage * booksPerPage;
    const firstBookIndex = lastBookIndex - booksPerPage;
    const lastItem = Math.min(lastBookIndex, totalBooks);


    const deleteBook = () => {
        setBookRemove(prev => !prev);
    }
    const handlePageChange = (pageNumber: number) => {
        setActualPage(pageNumber);
    }

    if (loading) {
        return <BreathingLoader />;
    }

    if (httpError) {
        return <p className="text-danger text-center mt-5">{httpError}</p>;
    }

    return (
        <div className="container py-5">
            {totalBooks > 0 ? (
                <>
                    <div className="mb-4">
                        <h3 className="fw-bold text-dark">
                            {t("updateBooks.totalBooks")}: {totalBooks}
                        </h3>

                        <p className="lead text-muted mb-0">
                            {t("updateBooks.showing", {
                                from: firstBookIndex + 1,
                                to: lastItem,
                                total: totalBooks
                            })}
                        </p>
                    </div>

                    <div className="d-flex flex-column gap-4">
                        {bookItems.map(book => (
                            <div key={book.id} className="card shadow-sm border-0 bg-light p-3">
                                <UpdateBookQuantity book={book} deleteBook={deleteBook} />
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="text-center my-5">
                    <h5 className="text-muted">{t("updateBooks.noBooks")}</h5>
                </div>
            )}
            {pageCount > 1 && (
                <div className="mt-5">
                    <Pagination currentPage={actualPage} totalPages={pageCount} paginate={handlePageChange} />
                </div>
            )}
        </div>
    );
}