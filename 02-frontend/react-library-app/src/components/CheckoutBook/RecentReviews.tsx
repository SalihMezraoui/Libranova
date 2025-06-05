import { Link } from "react-router-dom";
import Review from "../../models/Review";
import { ReviewComponent } from "../Widgets/ReviewComponent";

export const RecentReviews: React.FC<{
    reviews: Review[], bookId: number | undefined, mobile: boolean
}> = (props) => {
        console.log("RecentReviews props.bookId:", props.bookId);

    return (
        <div className={props.mobile ? 'mt-4' : 'row mt-5'}>
            <div className={props.mobile ? '' : 'col-sm-3 col-md-2'}>
            <h2 className="h4 text-black mb-3">Recent Reviews</h2>
            </div>
            <div className='col-sm-9 col-md-10'>
                {props.reviews.length > 0 ? (
                    <>
                        {props.reviews.slice(0, 3).map(everyReview => (
                            <ReviewComponent review={everyReview} key={everyReview.id}></ReviewComponent>
                        ))}

                        <div className='mt-3 mb-4'>
                            <Link type='button' className='btn main-color btn-md text-white'
                                to={`/reviewsList/${props.bookId}`}>
                                See all reviews
                            </Link>
                        </div>
                        </>
                    ) : (
                        <div className='m-3 p-3 bg-light rounded'>
                            <p className='lead mb-0'>
                                No reviews yet.
                            </p>
                        </div>
                    )
                    }
            </div>
        </div>
    );
}