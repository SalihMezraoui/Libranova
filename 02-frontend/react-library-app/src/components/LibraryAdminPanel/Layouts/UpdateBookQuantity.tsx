import { use, useEffect, useState } from "react";
import Book from "../../../models/Book";
import { useOktaAuth } from "@okta/okta-react";
import Swal from 'sweetalert2';
import { useTranslation } from "react-i18next";

export const UpdateBookQuantity: React.FC<{ book: Book, deleteBook: any }> = (props) => {

    const { authState } = useOktaAuth();
    const { t } = useTranslation();
    const [bookQuantity, setBookQuantity] = useState<number>(0);
    const [left, setLeft] = useState<number>(0);

    useEffect(() => {
        const loadBook = () => {
            props.book.totalCopies ? setBookQuantity(props.book.totalCopies) : setBookQuantity(0);
            props.book.copiesInStock ? setLeft(props.book.copiesInStock) : setLeft(0);
        };
        loadBook();
    }, []);

    async function incrementQuantity() {

        const apiUrl = `${process.env.REACT_APP_API_URL}/admin/secure/increment/book/copies?bookId=${props.book.id}`;
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json',
            }
        };

        const response = await fetch(apiUrl, requestOptions);
        if (!response.ok) {
            throw new Error('Failed to increment book quantity.');
        }
        setBookQuantity(prev => prev + 1);
        setLeft(prev => prev + 1);
    }

    async function decrementQuantity() {
        const apiUrl = `${process.env.REACT_APP_API_URL}/admin/secure/decrement/book/copies?bookId=${props.book.id}`;
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json',
            }
        };

        const response = await fetch(apiUrl, requestOptions);
        if (!response.ok) {
            throw new Error('Failed to decrement book quantity.');
        }
        setBookQuantity(prev => prev - 1);
        setLeft(prev => prev - 1);
    }

    async function deleteBook() {
        const result = await Swal.fire({
            title: t("bookCard.deleteConfirmTitle", { title: props.book.title }),
            html: `<p><strong>${t("bookCard.author")}:</strong> ${props.book.author}</p><p>${t("bookCard.deleteWarning")}</p>`,
            icon: 'warning',
            imageUrl: props.book.image || "../../../Images/Books/book-1.png",
            imageWidth: 120,
            imageHeight: 180,
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: t("bookCard.confirmDelete"),
            cancelButtonText: t("bookCard.cancelDelete")
        });

        if (result.isConfirmed) {
            const apiUrl = `${process.env.REACT_APP_API_URL}/admin/secure/delete/book?bookId=${props.book.id}`;
            const requestOptions = {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                    'Content-Type': 'application/json',
                }
            };
            const response = await fetch(apiUrl, requestOptions);
            if (!response.ok) {
                await Swal.fire(t("bookCard.error"), t("bookCard.failedDelete"), 'error');
                throw new Error(t("bookCard.failedDelete"));
            }

            await Swal.fire(t("bookCard.deletedTitle"), t("bookCard.deletedSuccess"), 'success');
            props.deleteBook();
        }
    }


    return (
        <div className="card mt-4 shadow-sm p-3 mb-3 bg-body rounded">
            <div className="row g-3 align-items-center">
                {/* Book Image */}
                <div className="col-md-2 text-center">
                    <img
                        src={props.book.image || require("../../../Images/Books/book-1.png")}
                        alt={props.book.title}
                        className="rounded shadow-sm"
                        style={{ width: '130px', height: '195px', objectFit: 'cover' }}
                    />
                </div>
                {/* Book Info */}
                <div className="col-md-6 pe-md-5">
                    <div className="card-body px-2">
                        <h5 className="card-title fw-semibold text-dark">{props.book.title}</h5>
                        <p className="card-text mb-1 text-secondary">
                            <strong>{t("bookCard.author")}:</strong> {props.book.author}
                        </p>
                        <p className="card-text justify-text" >
                            {props.book.overview}
                        </p>
                    </div>
                </div>
                {/* Quantity Info */}
                <div className="col-md-3">
                    <div className="text-center text-md-start">
                        <p className="mb-2">
                            📦 <strong>{t("bookCard.total")}:</strong> {bookQuantity}
                        </p>
                        <p className="mb-2">
                            ✅ <strong>{t("bookCard.available")}</strong> {left}
                        </p>
                        <div className="d-flex flex-wrap gap-2 mt-3">
                            <div className="d-flex gap-2 flex-wrap justify-content-center">
                                <button className="btn btn-sm btn-success" onClick={incrementQuantity}>
                                    {t("bookCard.increaseBtn")}
                                </button>
                                <button className="btn btn-sm btn-warning text-dark" onClick={decrementQuantity} disabled={left <= 0}>
                                    {t("bookCard.decreaseBtn")}
                                </button>
                            </div>
                            <div className="d-flex justify-content-center align-items-center h-100">
                                <button
                                    className="btn btn-sm btn-danger mt-2"
                                    onClick={deleteBook}
                                    title={t("bookCard.remove")}
                                >
                                    <i className="bi bi-trash3 me-1"></i> {t("bookCard.remove")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}