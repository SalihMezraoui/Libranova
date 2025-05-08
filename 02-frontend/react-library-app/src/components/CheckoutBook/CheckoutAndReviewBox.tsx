import { Link } from "react-router-dom";
import Book from "../../models/Book";

export const CheckoutAndReviewBox: React.FC<{ book: Book | undefined, mobile: boolean }> = (props) => {
    return (
        <div className={props.mobile ? "card d-flex mt-5" : "card col-3 container d-flex mb-5"}>
            <div className="card-body container">
                <div className="mt-3">
                    <p>
                        <b>0/5 </b>
                        books checked out
                    </p>
                    <hr />
                    {props.book && props.book.copiesInStock && props.book.copiesInStock > 0

                        ? <p className="text-success">Available</p>
                        : <p className="text-danger">Not Available</p>
                    }
                    <div className="row">
                        <p className="col-6 lead">
                            <b>{props.book?.totalCopies} </b>
                            copies
                        </p>
                        <p className="col-6 lead">
                            <b>{props.book?.copiesInStock} </b>
                            available
                        </p>
                    </div>
                </div>
                <Link to='/#' className="btn btn-success btn-lg"> Sign in</Link>
                <hr />
                <p className="mt-3">
                    this number can change until placing the order.
                </p>
                <p>
                    Sign in to be able to leave a review.
                </p>


            </div>
        </div>

    )
}