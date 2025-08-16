import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import History from "../../../models/History";
import { BreathingLoader } from "../../Widgets/BreathingLoader";
import { Link } from "react-router-dom";
import { Pagination } from "../../Widgets/Pagination";
import { useTranslation } from "react-i18next";

export const HistoryTab = () => {

    // Okta authentication state and translation hooks
    const { authState } = useOktaAuth();
    const { t, i18n } = useTranslation();

    // State to manage loading and error states
    const [loadingHistory, setLoadingHistory] = useState(true);
    const [httpError, setHttpError] = useState<string | null>(null);

    // State to hold the history data
    const [history, setHistory] = useState<History[]>([]);

    // pagination states
    const [actualPage, setActualPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const retrieveHistory = async () => {
            if (authState && authState.isAuthenticated) {
                const apiUrl = `${process.env.REACT_APP_API_URL}/histories/search/findBooksByUserEmail?userEmail=${authState.accessToken?.claims.sub}&page=${actualPage - 1}&size=5`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                };
                const response = await fetch(apiUrl, requestOptions);
                if (!response.ok) {
                    throw new Error('Something went wrong!');
                }
                const jsonResponse = await response.json();

                setHistory(jsonResponse._embedded.histories);
                setTotalPages(jsonResponse.page.totalPages);
            }
            setLoadingHistory(false);
        };

        retrieveHistory().catch((error: any) => {
            setLoadingHistory(false);
            setHttpError(error.message || "Something went wrong!");
        });
    }, [authState, actualPage]);

    if (loadingHistory) {
        return <BreathingLoader />;
    }

    if (httpError) {
        return (
            <div className="alert alert-danger" role="alert">
                {httpError}
            </div>
        );
    }

    const paginate = (pageNumber: number) => {
        setActualPage(pageNumber);
    };

    return (
        <div className="container py-4">
            {history.length > 0 ? (
                <>
                    <h3 className="mb-4 fw-semibold text-secondary">{t("historyTab.title")}</h3>

                    {history.map((historyItem) => {
                        const checkoutDate = new Date(historyItem.checkoutAt);
                        const returnedDate = new Date(historyItem.returnedAt);

                        const formattedCheckoutDate = checkoutDate.toLocaleDateString(i18n.language, {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        });

                        const formattedReturnedDate = returnedDate.toLocaleDateString(i18n.language, {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        });

                        return (
                            <div key={historyItem.id} className="mb-4">
                                <div className="card shadow-sm border-0 p-3 rounded-4 bg-light-subtle">
                                    <div className="row g-3 align-items-center">
                                        {/* Book Image */}
                                        <div className="col-md-2 text-center">
                                            <img
                                                src={
                                                    historyItem.image ||
                                                    require('../../../Images/Books/book-1.png')
                                                }
                                                width={130}
                                                height={200}
                                                alt="Book"
                                                className="rounded-3 border"
                                            />
                                        </div>

                                        {/* Book Details */}
                                        <div className="col-md-6">
                                            <div className="card-body p-0">
                                                <h4 className="fw-bold text-dark mb-1">{historyItem.title}</h4>
                                                <p className="text-muted fst-italic mb-2">{historyItem.author}</p>
                                                <p className="text-body" style={{ textAlign: "justify" }}>
                                                    {historyItem.overview}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Dates */}
                                        <div className="col-md-4">
                                            <div className="bg-light-subtle border-start border-3 border-primary ps-3 ms-2 rounded">
                                                <p className="mb-2 small text-primary-emphasis">
                                                    <strong>{t("historyTab.checkedOut")}:</strong> {formattedCheckoutDate}
                                                </p>
                                                <p className="mb-0 small text-success-emphasis">
                                                    <strong>{t("historyTab.returnedOn")}:</strong> {formattedReturnedDate}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <hr className="opacity-25" />
                            </div>
                        );
                    })}
                </>
            ) : (
                <div className="text-center mt-5">
                    <h4 className="text-muted">{t("historyTab.noHistory")}</h4>
                    <Link
                        className="btn main-color text-white mt-3 px-4 py-2 rounded-pill shadow-sm"
                        to={'search'}
                    >
                        {t("historyTab.searchBooks")}
                    </Link>
                </div>
            )}

            {totalPages > 1 && (
                <div className="mt-4">
                    <Pagination
                        currentPage={actualPage}
                        totalPages={totalPages}
                        paginate={paginate}
                    />
                </div>
            )}
        </div>
    );
};
