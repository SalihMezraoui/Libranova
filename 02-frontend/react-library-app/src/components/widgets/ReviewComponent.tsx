import Review from "../../models/Review";
import { RatingStars } from "./RatingStars";

export const ReviewComponent: React.FC<{ review: Review }> = (props) => {
    
    const date = new Date(props.review.date);

    const dateMonth = date.toLocaleString('en-us', { month: 'long' });
    const dateDay = date.getDate();
    const dateYear = date.getFullYear();

    const dateRender = dateMonth + ' ' + dateDay + ', ' + dateYear;
    
    return (
        <div className="mb-4">
            <div className='col-sm-8 col-md-8 p-3 bg-white rounded shadow-sm'>
            <h5 className="text-secondary mb-2">{props.review.userEmail}</h5>
                <div className='row align-items-center mb-2'>
                    <div className='col text-muted small'>
                        {dateRender}
                    </div>
                    <div className='col'>
                        <RatingStars rating={props.review.rating} size={19} />
                    </div>
                </div>
                <div className='mt-3'>  
                    <p className="text-dark mb-0">  
                        {props.review.reviewDescription}
                    </p>
                </div>
            </div>
            <hr className="mt-3" /> 
        </div>
    );
}