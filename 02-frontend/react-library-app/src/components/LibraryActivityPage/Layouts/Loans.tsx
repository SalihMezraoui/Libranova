import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import UserLoansSummary from "../../../models/UserLoansSummary";
import { BreathingLoader } from "../../Widgets/BreathingLoader";
import { Link } from "react-router-dom";
import { LoanDetailsModal } from "./LoanDetailsModal";
import { useTranslation } from "react-i18next";

export const Loans = () => {

    const { authState } = useOktaAuth();
    const { t } = useTranslation();
    const [httpError, setHttpError] = useState(null);

    const [userLoansSummary, setUserLoansSummary] = useState<UserLoansSummary[]>([]);
    const [loadingLoans, setLoadingLoans] = useState(true);
    const [checkout, setCheckout] = useState(false);

    useEffect(() => {
        const fetchUserLoans = async () => {
            if (!authState?.isAuthenticated) {
                setLoadingLoans(false);
                return;
            }

            try {
                const response = await fetch(
                    `${process.env.REACT_APP_API_URL}/books/secure/active-loans`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error('Something went wrong!');
                }

                const data = await response.json();
                setUserLoansSummary(data);
            } catch (error: any) {
                setHttpError(error.message || 'Failed to retrieve loans.');
            } finally {
                setLoadingLoans(false);
            }
        };

        fetchUserLoans();
        window.scrollTo(0, 0);
    }, [authState, checkout]);


    if (loadingLoans) {
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

    async function returnBook(bookId: number) {
        const apiUrl = `${process.env.REACT_APP_API_URL}/books/secure/loans/return?bookId=${bookId}`;
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }
        };
        const data = await fetch(apiUrl, requestOptions);
        if (!data.ok) {
            throw new Error('Something went wrong while returning the book!');
        }
        setCheckout(!checkout);
    }

    async function extendLoan(bookId: number) {
        const apiUrl = `${process.env.REACT_APP_API_URL}/books/secure/loans/extend?bookId=${bookId}`;
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }
        };

        const data = await fetch(apiUrl, requestOptions);
        if (!data.ok) {
            throw new Error('Something went wrong while extending the loan!');
        }
        setCheckout(!checkout);
    }

    return (
        <div>
            {/* Desktop view */}
            <div className="d-none d-lg-block py-3">
                {userLoansSummary.length > 0 ?
                    <>
                        <h3 className="mb-5 fw-bold text-dark border-bottom pb-2">
                            <i className="bi bi-book-half me-2"></i>{t("loans.currentLoans")}
                        </h3>

                        {userLoansSummary.map(userLoanSummary => (
                            <div key={userLoanSummary.book.id}>
                                <div className="row mt-3 mb-4 align-items-center">
                                    <div className="col-md-4 bg-light d-flex align-items-center justify-content-center p-3">
                                        <img
                                            src={userLoanSummary.book?.image || require("../../../Images/Books/book-1.png")}
                                            alt="Book cover"
                                            className="img-fluid rounded-3"
                                            style={{
                                                width: "222px",
                                                height: "333px",
                                                objectFit: "cover",
                                            }}
                                        />

                                    </div>
                                    <div className="card col-3 col-md-5 container d-flex">
                                        <div className="card-body position-relative" >
                                            <div className="mt-3">
                                                {userLoanSummary.book.deleted && (
                                                    <div className="position-absolute top-0 end-0 m-3">
                                                        <button
                                                            className="btn btn-sm btn-danger fw-bold"
                                                            data-bs-toggle="modal"
                                                            data-bs-target={`#deletedWarningModal${userLoanSummary.book.id}`}
                                                        >
                                                            {t("loans.important")}
                                                        </button>
                                                    </div>
                                                )}
                                                <h4 className="fw-bold text-dark mb-3">
                                                    {t("loans.loanOptions")}
                                                    <span className="position-absolute bottom-0 start-0 border-bottom border-2 border-dark" style={{ width: 'fit-content' }}></span>
                                                </h4>
                                                {userLoanSummary.daysRemaining > 0 &&
                                                    <p className='text-secondary'>
                                                        <strong>{t("loans.daysRemaining")} </strong>{userLoanSummary.daysRemaining}
                                                    </p>
                                                }
                                                {userLoanSummary.daysRemaining === 0 &&
                                                    <p className="text-warning fw-semibold">
                                                        <i className="bi bi-exclamation-circle me-1"></i>{t("loans.dueToday")}
                                                    </p>
                                                }
                                                {userLoanSummary.daysRemaining < 0 &&
                                                    <p className="text-danger fw-semibold">
                                                        <i className="bi bi-x-circle me-1"></i>
                                                        {t("loans.overdueBy")}: {Math.abs(userLoanSummary.daysRemaining)} {t("loans.days")}
                                                    </p>
                                                }
                                                <div className="d-flex gap-2 mb-3">
                                                    <button
                                                        className="btn btn-outline-primary rounded-pill d-flex align-items-center"
                                                        data-bs-toggle="modal"
                                                        data-bs-target={`#manageLoanModal${userLoanSummary.book.id}`}
                                                    >
                                                        <i className="bi bi-pencil-square me-2"></i>
                                                        {t("loans.manageLoan")}
                                                    </button>

                                                    <Link
                                                        to={'search'}
                                                        className="btn btn-outline-secondary rounded-pill d-flex align-items-center"
                                                    >
                                                        <i className="bi bi-search me-2"></i>
                                                        {t("loans.moreBooks")}
                                                    </Link>
                                                </div>
                                            </div>
                                            <hr />
                                            <p className="text-muted">{t("loans.feedbackPrompt")}</p>
                                            <Link
                                                to={`/checkout/${userLoanSummary.book.id}`}
                                                className="btn btn-success rounded-pill px-4 text-white shadow-sm invert-hover"
                                            >
                                                <i className="bi bi-star-fill me-2"></i>{t("loans.writeReview")}
                                            </Link>
                                        </div>
                                        {userLoanSummary.book.deleted && (
                                            <div className="modal fade" id={`deletedWarningModal${userLoanSummary.book.id}`} tabIndex={-1} aria-labelledby="deletedWarningModalLabel" aria-hidden="true">
                                                <div className="modal-dialog modal-dialog-centered">
                                                    <div className="modal-content shadow">
                                                        <div className="modal-header bg-danger text-white">
                                                            <h5 className="modal-title" id="deletedWarningModalLabel">{t("loans.important")}</h5>
                                                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                                                        </div>
                                                        <div className="modal-body">
                                                            <p>{t("loans.deletedBookMessage")}</p>
                                                        </div>
                                                        <div className="modal-footer">
                                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">{t("loans.close")}</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                </div>
                                <hr />
                                <LoanDetailsModal userLoanSummary={userLoanSummary} mobile={false} returnBook={returnBook} extendLoan={extendLoan} />
                            </div>
                        ))}
                    </> :
                    <>
                        <h5 className="text-center mb-4">{t("loans.noLoansTitle")}</h5>
                        <p className="text-center">
                            {t("loans.noLoansText")} <Link to={'search'}>{t("loans.bookSearchLink")}</Link>.
                        </p>

                    </>
                }
            </div>


            {/* Mobile view */}
            <div className="container d-lg-none mt-3">
                {userLoansSummary.length > 0 ? (
                    <>
                        <h4 className="fw-bold text-dark border-bottom pb-2 mb-4">
                            <i className="bi bi-book-half me-2"></i>{t("loans.currentLoans")}
                        </h4>

                        {userLoansSummary.map(userLoanSummary => (
                            <div key={userLoanSummary.book.id} className="mb-5">

                                {/* Book image container */}
                                <div className="bg-light rounded-3 d-flex align-items-center justify-content-center p-3 shadow-sm" style={{ width: '220px', height: '330px' }}>
                                    <img
                                        src={userLoanSummary.book?.image || require('../../../Images/Books/book-1.png')}
                                        alt="Book cover"
                                        className="img-fluid rounded-3"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                        }}
                                    />
                                </div>


                                {/* Card details */}
                                <div className="card mt-4 shadow-sm rounded-3 border-0">
                                    <div className="card-body position-relative">

                                        {userLoanSummary.book.deleted && (
                                            <div className="position-absolute top-0 end-0 m-3">
                                                <button
                                                    className="btn btn-sm btn-danger fw-bold"
                                                    data-bs-toggle="modal"
                                                    data-bs-target={`#deletedWarningModal${userLoanSummary.book.id}`}
                                                >
                                                    {t("loans.important")}
                                                </button>
                                            </div>
                                        )}

                                        <h5 className="fw-bold text-dark mb-3">
                                            {t("loans.loanOptions")}
                                        </h5>

                                        {/* Loan status */}
                                        {userLoanSummary.daysRemaining > 0 && (
                                            <p className="text-secondary">
                                                <strong>{t("loans.daysRemaining")}:</strong> {userLoanSummary.daysRemaining}
                                            </p>
                                        )}
                                        {userLoanSummary.daysRemaining === 0 && (
                                            <p className="text-warning fw-semibold">
                                                <i className="bi bi-exclamation-circle me-1"></i>{t("loans.dueToday")}
                                            </p>
                                        )}
                                        {userLoanSummary.daysRemaining < 0 && (
                                            <p className="text-danger fw-semibold">
                                                <i className="bi bi-x-circle me-1"></i>
                                                {t("loans.overdueBy")}: {Math.abs(userLoanSummary.daysRemaining)} {t("loans.days")}
                                            </p>
                                        )}

                                        {/* Action buttons */}
                                        <div className="d-flex flex-column gap-2 mb-3">
                                            <button
                                                className="btn btn-outline-primary rounded-pill d-flex align-items-center justify-content-center"
                                                data-bs-toggle="modal"
                                                data-bs-target={`#manageMobileLoanModal${userLoanSummary.book.id}`}
                                            >
                                                <i className="bi bi-pencil-square me-2"></i>
                                                {t("loans.manageLoan")}
                                            </button>

                                            <Link
                                                to={'search'}
                                                className="btn btn-outline-secondary rounded-pill d-flex align-items-center justify-content-center"
                                            >
                                                <i className="bi bi-search me-2"></i>
                                                {t("loans.moreBooks")}
                                            </Link>
                                        </div>

                                        <hr />
                                        <p className="text-muted">{t("loans.feedbackPrompt")}</p>
                                        <Link
                                            to={`/checkout/${userLoanSummary.book.id}`}
                                            className="btn btn-success rounded-pill px-4 text-white shadow-sm invert-hover"
                                        >
                                            <i className="bi bi-star-fill me-2"></i>{t("loans.writeReview")}
                                        </Link>
                                    </div>
                                </div>

                                <LoanDetailsModal
                                    userLoanSummary={userLoanSummary}
                                    mobile={true}
                                    returnBook={returnBook}
                                    extendLoan={extendLoan}
                                />
                            </div>
                        ))}
                    </>
                ) : (
                    <>
                        <h5 className="text-center mb-4">{t("loans.noLoansTitle")}</h5>
                        <p className="text-center">
                            {t("loans.noLoansText")} <Link to={'search'}>{t("loans.bookSearchLink")}</Link>.
                        </p>
                    </>
                )}

                {/* Deleted book modals */}
                {userLoansSummary
                    .filter(loan => loan.book.deleted)
                    .map(loan => (
                        <div
                            className="modal fade"
                            id={`deletedWarningModal${loan.book.id}`}
                            tabIndex={-1}
                            key={`deletedWarningModal${loan.book.id}`}
                            aria-labelledby={`deletedWarningModalLabel${loan.book.id}`}
                            aria-hidden="true"
                        >
                            <div className="modal-dialog modal-dialog-centered modal-fullscreen-sm-down">
                                <div className="modal-content shadow">
                                    <div className="modal-header bg-danger text-white">
                                        <h5 className="modal-title" id={`deletedWarningModalLabel${loan.book.id}`}>
                                            {t("loans.important")}
                                        </h5>
                                        <button
                                            type="button"
                                            className="btn-close btn-close-white"
                                            data-bs-dismiss="modal"
                                            aria-label="Close"
                                        ></button>
                                    </div>
                                    <div className="modal-body">
                                        <p>{t("loans.deletedBookMessage")}</p>
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            data-bs-dismiss="modal"
                                        >
                                            {t("loans.close")}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>


        </div>
    );
}