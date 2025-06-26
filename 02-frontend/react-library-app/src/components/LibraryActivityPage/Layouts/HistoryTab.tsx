import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import History from "../../../models/History";
import { BreathingLoader } from "../../Widgets/BreathingLoader";
import { Link } from "react-router-dom";
import { Pagination } from "../../Widgets/Pagination";

export const HistoryTab = () => {

    const { authState } = useOktaAuth();
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const [httpError, setHttpError] = useState(null);

    // State to hold the history data
    const [history, setHistory] = useState<History[]>([]);

    // pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchHistory = async () => {
            if (authState && authState.isAuthenticated) {
                const apiUrl = `http://localhost:8080/api/histories/search/findBooksByUserEmail?userEmail=${authState.accessToken?.claims.sub}&page=${currentPage - 1}&size=5`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                };
                const response = await fetch(apiUrl, requestOptions);
                if (!response.ok) {
                    throw new Error('Something went wrong!');
                }
                const jsonResponse = await response.json();

                setHistory(jsonResponse._embedded.histories);
                setTotalPages(jsonResponse.page.totalPages);
            }
            setIsLoadingHistory(false);
        }
        fetchHistory().catch((error: any) => {
            setIsLoadingHistory(false);
            setHttpError(error.message || "Something went wrong!");
        })
    }, [authState, currentPage]);

    if (isLoadingHistory) {
        return (
            <BreathingLoader />
        )
    }

    if (httpError) {
        return (
            <div className="alert alert-danger" role="alert">
                {httpError}
            </div>
        );
    }

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    }

    return (
        <div className="container py-4">
            {history.length > 0 ? (
                <>
                    <h3 className="mb-4 fw-semibold text-secondary">My History</h3>

                    {history.map((historyItem) => (
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
                                            <p className="text-body">{historyItem.overview}</p>
                                        </div>
                                    </div>

                                    {/* Dates */}
                                    <div className="col-md-4">
                                        <div className="bg-light-subtle border-start border-3 border-primary ps-3 ms-2 rounded">
                                            <p className="mb-2 small text-primary-emphasis">
                                                <strong>Checked out:</strong> {historyItem.checkoutDate}
                                            </p>
                                            <p className="mb-0 small text-success-emphasis">
                                                <strong>Returned on:</strong> {historyItem.returnedDate}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr className="opacity-25" />
                        </div>
                    ))}
                </>
            ) : (
                <div className="text-center mt-5">
                    <h4 className="text-muted">No history found.</h4>
                    <Link
                        className="btn main-color text-white mt-3 px-4 py-2 rounded-pill shadow-sm"
                        to={'search'}
                    >
                        Search for Books
                    </Link>
                </div>
            )}

            {totalPages > 1 && (
                <div className="mt-4">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        paginate={paginate}
                    />
                </div>
            )}
        </div>

    );
}