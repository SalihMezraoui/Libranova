import UserLoansSummary from "../../../models/UserLoansSummary";
import { useTranslation } from "react-i18next";

export const LoanDetailsModal: React.FC<{
    userLoanSummary: UserLoansSummary, mobile: boolean, returnBook: any
    , extendLoan: any
}>
    = (props) => {

        const { t } = useTranslation();

        const modalId = props.mobile
            ? `manageMobileLoanModal${props.userLoanSummary.book.id}`
            : `manageLoanModal${props.userLoanSummary.book.id}`;

        return (
            <div className="modal fade" id={modalId} data-bs-backdrop="static" data-bs-keyboard="false"
                aria-labelledby={`${modalId}Label`} aria-hidden="true" key={props.userLoanSummary.book.id}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content shadow-lg rounded-4">
                        <div className="modal-header main-color border-0 text-white">
                            <h5 className="modal-title fw-semibold" id={`${modalId}Label`}>
                                {t("loanDetails.title")}
                            </h5>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close">
                            </button>
                        </div>
                        <div className="modal-body px-4">
                            <div className="d-flex align-items-start gap-3">
                                <div className="flex-shrink-0">
                                    {props.userLoanSummary.book?.image ? (
                                        <img src={props.userLoanSummary.book?.image}
                                            width='100'
                                            height='140'
                                            alt='Book'
                                            className="rounded shadow-sm"
                                        />
                                    ) : (
                                        <img src={require('../../../Images/Books/book-1.png')}
                                            width='70'
                                            height='100'
                                            alt='Book'
                                            className="rounded shadow-sm"
                                        />
                                    )}
                                </div>
                                <div className="flex-grow-1">
                                    <h6 className="mb-1 text-muted">{props.userLoanSummary.book.author}</h6>
                                    <h5 className="fw-bold">{props.userLoanSummary.book.title}</h5>
                                </div>
                            </div>

                            <hr />

                            {props.userLoanSummary.daysRemaining > 0 && (
                                <p className='text-muted'>
                                    <strong>{t("loanDetails.remainingDays")} </strong>{props.userLoanSummary.daysRemaining}
                                </p>
                            )}
                            {props.userLoanSummary.daysRemaining === 0 && (
                                <p className='text-success fw-semibold'>
                                    {t("loanDetails.dueToday")}
                                </p>
                            )}
                            {props.userLoanSummary.daysRemaining < 0 && (
                                <p className='text-danger fw-semibold'>
                                    <strong>{t("loanDetails.days")}: </strong> {Math.abs(props.userLoanSummary.daysRemaining)} days
                                </p>
                            )}

                            <div className="btn-group-vertical w-100 mt-4" role="group">
                                <button
                                    onClick={() => props.returnBook(props.userLoanSummary.book.id)}
                                    type="button"
                                    data-bs-dismiss="modal"
                                    className="btn btn-outline-success rounded-pill py-1 px-2 mb-2 small"
                                >
                                    {t("loanDetails.returnBook")}
                                </button>
                                <button onClick={
                                    props.userLoanSummary.daysRemaining < 0 ?
                                        (event) => event.preventDefault()
                                        :
                                        () => props.extendLoan(props.userLoanSummary.book.id)
                                }
                                    type="button"
                                    data-bs-dismiss="modal"
                                    className={
                                        props.userLoanSummary.daysRemaining < 0
                                            ? "btn btn-outline-secondary rounded-pill py-1 px-2 small disabled"
                                            : "btn btn-outline-primary rounded-pill py-1 px-2 small"
                                    }
                                >
                                    {props.userLoanSummary.daysRemaining < 0
                                        ? t("loanDetails.extendDisabled")
                                        : t("loanDetails.extendLoan")}
                                </button>
                            </div>
                        </div>

                        <div className="modal-footer border-0">
                            <button type="button" className="btn btn-light border" data-bs-dismiss="modal">
                                {t("loanDetails.close")}
                            </button>
                        </div>
                    </div>
                </div >
            </div >
        );
    }