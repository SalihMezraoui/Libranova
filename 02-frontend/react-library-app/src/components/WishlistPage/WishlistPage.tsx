import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";
import Book from "../../models/Book";
import { BreathingLoader } from "../widgets/BreathingLoader";
import { useTranslation } from "react-i18next";

export const WishlistPage = () => {
    const { getAccessTokenSilently } = useAuth0();
    const { t } = useTranslation();

    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [httpError, setHttpError] = useState<string | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const token = await getAccessTokenSilently();
                const res = await fetch(`${process.env.REACT_APP_API_URL}/wishlists/secure`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (!res.ok) throw new Error('Failed to fetch wishlist');
                const data: Book[] = await res.json();
                setBooks(data);
            } catch (err: any) {
                setHttpError(err.message ?? 'Unexpected error');
            } finally {
                setLoading(false);
            }
        };
        fetchWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refreshTrigger]);

    const removeFromWishlist = async (bookId: number) => {
        try {
            const token = await getAccessTokenSilently();
            await fetch(`${process.env.REACT_APP_API_URL}/wishlists/secure/remove?bookId=${bookId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setRefreshTrigger(prev => prev + 1);
        } catch (err: any) {
            setHttpError(err.message ?? 'Unexpected error');
        }
    };

    if (loading) return <BreathingLoader size={80} color="#003366" speed={1} />;

    if (httpError) return (
        <div className="container mt-5 text-center">
            <div className="alert alert-danger" style={{ maxWidth: 400, margin: "auto" }}>{httpError}</div>
        </div>
    );

    return (
        <div className="container mt-5 mb-5">
            <h2 className="fw-bold mb-4">
                <i className="bi bi-heart-fill text-danger me-2"></i>
                {t('wishlist.title')}
            </h2>

            {books.length === 0 ? (
                <div className="text-center mt-5">
                    <i className="bi bi-heart fs-1 text-muted"></i>
                    <p className="text-muted mt-3 fs-5">{t('wishlist.empty')}</p>
                    <Link to="/search" className="btn main-color text-white rounded-pill px-4 mt-2">
                        {t('wishlist.browseBooks')}
                    </Link>
                </div>
            ) : (
                <div className="row g-4">
                    {books.map(book => (
                        <div key={book.id} className="col-12 col-md-6 col-lg-4">
                            <div className="card h-100 shadow-sm border-0 rounded-4">
                                <div className="row g-0 h-100">
                                    <div className="col-4 d-flex align-items-center justify-content-center p-3">
                                        <img
                                            src={book.image || require('../../Images/Books/book-1.png')}
                                            alt={book.title}
                                            style={{ height: 120, objectFit: 'cover' }}
                                            className="rounded-3"
                                        />
                                    </div>
                                    <div className="col-8 d-flex flex-column p-3">
                                        <h6 className="fw-bold mb-1">{book.title}</h6>
                                        <p className="text-muted small mb-auto">{book.author}</p>
                                        <div className="d-flex gap-2 mt-3 flex-wrap">
                                            <Link
                                                to={`/checkout/${book.id}`}
                                                className="btn btn-sm main-color text-white rounded-pill"
                                            >
                                                {t('wishlist.viewDetails')}
                                            </Link>
                                            <button
                                                onClick={() => removeFromWishlist(book.id)}
                                                className="btn btn-sm btn-outline-danger rounded-pill"
                                            >
                                                <i className="bi bi-heart-fill me-1"></i>
                                                {t('wishlist.remove')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
