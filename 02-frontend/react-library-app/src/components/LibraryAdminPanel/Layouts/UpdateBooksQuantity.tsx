import { useEffect, useState } from "react";
import Book from "../../../models/Book";
import { BreathingLoader } from "../../Widgets/BreathingLoader";
import { Pagination } from "../../Widgets/Pagination";
import { UpdateBookQuantity } from "./UpdateBookQuantity";
import { useTranslation } from "react-i18next";

export const UpdateBooksQuantity = () => {

    const { t } = useTranslation();
    const [bookItems, setBookItems] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [booksPerPage] = useState(6);
    const [totalBooks, setTotalBooks] = useState(0);
    const [pageCount, setPageCount] = useState(0);

    const [bookRemove, setBookRemove] = useState(false);

    useEffect(() => {
        const loadBooks = async () => {
            const apiUrl: string = `${process.env.REACT_APP_API_URL}/books/search/findByDeletedFalse?page=${currentPage - 1}&size=${booksPerPage}`;
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error('Failed to fetch book data.!');
            }

            const jsonResponse = await response.json();

            const responseData = jsonResponse._embedded.books;

            setTotalBooks(jsonResponse.page.totalElements);
            setPageCount(jsonResponse.page.totalPages);


            const fetchedBooks: Book[] = [];

            for (const key in responseData) {
                fetchedBooks.push({
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
            setBookItems(fetchedBooks);
            setLoading(false);

        };
        loadBooks().catch((error: any) => {
            setLoading(false);
            setHttpError(error.message);
        })
    }, [currentPage, bookRemove]);

    const lastBookIndex = currentPage * booksPerPage;
    const firstBookIndex = lastBookIndex - booksPerPage;
    let lastItem = booksPerPage * currentPage <= totalBooks ?
        booksPerPage * currentPage : totalBooks;

    const deleteBook = () => {
        setBookRemove(prev => !prev);
    }
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
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
                                <UpdateBookQuantity book={book} deleteBook={deleteBook}/>
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
                    <Pagination currentPage={currentPage} totalPages={pageCount} paginate={handlePageChange} />
                </div>
            )}
        </div>
    );
}