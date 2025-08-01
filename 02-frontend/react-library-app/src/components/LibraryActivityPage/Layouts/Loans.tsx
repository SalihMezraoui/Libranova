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
    const [isLoadingUserLoans, setIsLoadingUserLoans] = useState(true);
    const [checkout, setCheckout] = useState(false);

    useEffect(() => {
        const fetchUserLoans = async () => {
            if (authState && authState.isAuthenticated) {
                const apiUrl = `${process.env.REACT_APP_API_URL}/books/secure/currentloans`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };
                const response = await fetch(apiUrl, requestOptions);
                if (!response.ok) {
                    throw new Error('Something went wrong!');
                }
                const jsonResponse = await response.json();
                setUserLoansSummary(jsonResponse);
            }
            setIsLoadingUserLoans(false);
        }
        fetchUserLoans().catch((error: any) => {
            setIsLoadingUserLoans(false);
            setHttpError(error.message);
        })
        window.scrollTo(0, 0);
    }, [authState, checkout]);

    if (isLoadingUserLoans) {
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
        const apiUrl = `${process.env.REACT_APP_API_URL}/books/secure/return?bookId=${bookId}`;
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }
        };
        const response = await fetch(apiUrl, requestOptions);
        if (!response.ok) {
            throw new Error('Something went wrong while returning the book!');
        }
        setCheckout(!checkout);
    }

    async function extendLoan(bookId: number) {
        const apiUrl = `${process.env.REACT_APP_API_URL}/books/secure/extend/loan?bookId=${bookId}`;
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }
        };

        const response = await fetch(apiUrl, requestOptions);
        if (!response.ok) {
            throw new Error('Something went wrong while extending the loan!');
        }
        setCheckout(!checkout);
    }

    return (
        <div>
            {/* Desktop view */}
            <div className="d-none d-lg-block mt-2 py-4">
                {userLoansSummary.length > 0 ?
                    <>
                        <h3 className="mb-4 fw-semibold text-secondary">{t("loans.currentLoans")}</h3>

                        {userLoansSummary.map(userLoanSummary => (
                            <div key={userLoanSummary.book.id}>
                                <div className="row mt-3 mb-3">
                                    <div className="col-4 col-md-4 container">
                                        {userLoanSummary.book?.image ?
                                            <img src={userLoanSummary.book?.image} width='222' height='333' alt="Book cover" />
                                            :
                                            <img src={require('../../../Images/Books/book-1.png')} width='222' height='333' alt="Book cover" />
                                        }
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
                                                <h4 className="text-dark fw-bold position-relative">
                                                    {t("loans.loanOptions")}
                                                    <span className="position-absolute bottom-0 start-0 border-bottom border-2 border-dark" style={{ width: 'fit-content' }}></span>
                                                </h4>
                                                {userLoanSummary.daysRemaining > 0 &&
                                                    <p className='text-secondary'>
                                                        <strong>{t("loans.daysRemaining")} </strong>{userLoanSummary.daysRemaining}
                                                    </p>
                                                }
                                                {userLoanSummary.daysRemaining === 0 &&
                                                    <p className='text-success'>
                                                        <strong>{t("loans.dueToday")}</strong>
                                                    </p>
                                                }
                                                {userLoanSummary.daysRemaining < 0 &&
                                                    <p className='text-danger'>
                                                        <strong>{t("loans.overdueBy")}: </strong>{Math.abs(userLoanSummary.daysRemaining)} days
                                                    </p>
                                                }
                                                <div className="d-flex gap-2 mb-3">
                                                    <button
                                                        className="btn btn-outline-primary d-flex align-items-center"
                                                        data-bs-toggle="modal"
                                                        data-bs-target={`#manageLoanModal${userLoanSummary.book.id}`}
                                                    >
                                                        <i className="bi bi-pencil-square me-2"></i>
                                                        {t("loans.manageLoan")}
                                                    </button>

                                                    <Link
                                                        to={'search'}
                                                        className="btn btn-outline-secondary d-flex align-items-center"
                                                    >
                                                        <i className="bi bi-search me-2"></i>
                                                        {t("loans.moreBooks")}
                                                    </Link>
                                                </div>
                                            </div>
                                            <hr />
                                            <p className="mt-3">
                                                {t("loans.feedbackPrompt")}
                                            </p>
                                            <Link to={`/checkout/${userLoanSummary.book.id}`} className="btn btn-md main-color rounded-pill text-white invert-hover">
                                                {t("loans.writeReview")}
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
            <div className="container d-lg-none mt-2">
                {userLoansSummary.length > 0 ?
                    <>
                        <h5 className="mb-3">{t("loans.currentLoans")}</h5>

                        {userLoansSummary.map(userLoanSummary => (
                            <div key={userLoanSummary.book.id}>
                                <div className="d-flex justify-content-center align-items-center">
                                    {userLoanSummary.book?.image ?
                                        <img src={userLoanSummary.book?.image} width='222' height='333' alt="Book cover" />
                                        :
                                        <img src={require('../../../Images/Books/book-1.png')} width='222' height='333' alt="Book cover" />
                                    }
                                </div>
                                <div className="card d-flex mt-5 mb-3">
                                    <div className="card-body container" >
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
                                        <div className="mt-3">
                                            <h4 className="text-dark fw-bold position-relative">
                                                {t("loans.loanOptions")}
                                                <span className="position-absolute bottom-0 start-0 border-bottom border-2 border-dark" style={{ width: 'fit-content' }}></span>
                                            </h4>
                                            {userLoanSummary.daysRemaining > 0 &&
                                                <p className='text-secondary'>
                                                    <strong>{t("loans.daysRemaining")} : </strong>{userLoanSummary.daysRemaining}
                                                </p>
                                            }
                                            {userLoanSummary.daysRemaining === 0 &&
                                                <p className='text-success'>
                                                    <strong>{t("loans.dueToday")} :</strong>
                                                </p>
                                            }
                                            {userLoanSummary.daysRemaining < 0 &&
                                                <p className='text-danger'>
                                                    <strong>{t("loans.overdueBy")} : </strong>{Math.abs(userLoanSummary.daysRemaining)} days
                                                </p>
                                            }
                                            <div className="d-flex gap-2 mb-3">
                                                <button
                                                    className="btn btn-outline-primary d-flex align-items-center"
                                                    data-bs-toggle="modal"
                                                    data-bs-target={`#manageMobileLoanModal${userLoanSummary.book.id}`}
                                                >
                                                    <i className="bi bi-pencil-square me-2"></i>
                                                    {t("loans.manageLoan")}
                                                </button>

                                                <Link
                                                    to={'search'}
                                                    className="btn btn-outline-secondary d-flex align-items-center"
                                                >
                                                    <i className="bi bi-search me-2"></i>
                                                     {t("loans.moreBooks")}
                                                </Link>
                                            </div>
                                        </div>
                                        <hr />
                                        <p className="mt-3">
                                            {t("loans.feedbackPrompt")}
                                        </p>
                                        <Link to={`/checkout/${userLoanSummary.book.id}`} className="btn btn-md main-color rounded-pill text-white invert-hover">
                                            {t("loans.writeReview")}
                                        </Link>

                                        

                                        
                                    </div>
                                </div>

                                <hr />
                                <LoanDetailsModal userLoanSummary={userLoanSummary} mobile={true} returnBook={returnBook} extendLoan={extendLoan} />
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