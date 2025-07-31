import { Link } from "react-router-dom";
import Book from "../../models/Book";
import { PostAReview } from "../Widgets/PostAReview";
import { useTranslation } from "react-i18next";

export const CheckoutAndReviewBox: React.FC<{
    book: Book | undefined, mobile: boolean,
    currentLoans: number, isAuthenticated: any, isCheckedOut: boolean
    checkoutBook: any, isReviewRemaining: boolean, submitReview: any
}> = (props) => {

    const { t } = useTranslation();


    function renderButton() {
        if (props.isAuthenticated) {
            if (!props.isCheckedOut && props.currentLoans < 5) {
                return (
                    <button onClick={() => props.checkoutBook()}
                        className="btn btn-success btn-lg"> {t("checkout.checkout")}</button>
                )
            }
            else if (props.isCheckedOut) {
                return (<p><b> {t("checkout.alreadyCheckedOut")}</b></p>)
            }
            else if (!props.isCheckedOut) {
                return (
                    <p className="text-danger"> {t("checkout.maxReached")}</p>
                )
            }
        }
        return (
            <Link to='/login' className="btn btn-success btn-lg"> {t("checkout.signIn")}</Link>
        )
    }

    function renderReview() {
        if (props.isAuthenticated && !props.isReviewRemaining) {
            return (
                <p><PostAReview submitReview={props.submitReview} /></p>
            )
        }
        else if (props.isAuthenticated && props.isReviewRemaining) {
            return (
                <p><b>{t("checkout.thankYouReview")}</b></p>
            )
        }
        return (
            <div><hr /><p> {t("checkout.signInToReview")}</p></div>
        )
    }

    return (
        <div className={props.mobile ? "card d-flex mt-5" : "card col-3 container d-flex mb-5"}>
            <div className="card-body container">
                <div className="mt-3">
                    <p>
                        <b>{props.currentLoans}/5 </b>
                        {t("checkout.booksCheckedOut")}
                    </p>
                    <hr />
                    {props.book && props.book.copiesInStock && props.book.copiesInStock > 0

                        ? <p className="text-success">{t("checkout.available")}</p>
                        : <p className="text-danger">{t("checkout.notAvailable")}</p>
                    }
                    <div className="row">
                        <p className="col-6 lead">
                            <b>{props.book?.totalCopies} </b>
                            {t("checkout.copies")}
                        </p>
                        <p className="col-6 lead">
                            <b>{props.book?.copiesInStock} </b>
                             {t("checkout.available")}
                        </p>
                    </div>
                </div>
                {renderButton()}
                <hr />
                <p className="mt-3">
                    {t("checkout.dynamicAvailabilityNote")}
                </p>
                {renderReview()}


            </div>
        </div>

    )
}