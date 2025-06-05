import { useState } from "react";
import { RatingStars } from "./RatingStars";

export const PostAReview: React.FC<{ submitReview: any}> = (props) => {

    const [starInput, setStarInput] = useState(0);
    const [showInput, setShowInput] = useState(false);
    const [reviewDescription, setReviewDescription] = useState("");

    function starValue(value: number) {
        setStarInput(value);
        setShowInput(true);
    }

    return (
        <div className="dropdown" style={{ cursor: "pointer" }}>
            <h5 className="dropdown-toggle" id="dropdownMenuButton1"
                data-bs-toggle="dropdown">
                Post a Review
            </h5>
            <ul id="submitReviewRating" className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                <li><button onClick={() => starValue(0)} className="dropdown-item">0 star</button></li>
                <li><button onClick={() => starValue(0.5)} className="dropdown-item">0.5 star</button></li>
                <li><button onClick={() => starValue(1)} className="dropdown-item">1 stars</button></li>
                <li><button onClick={() => starValue(1.5)} className="dropdown-item">1.5 stars</button></li>
                <li><button onClick={() => starValue(2)} className="dropdown-item">2 stars</button></li>
                <li><button onClick={() => starValue(2.5)} className="dropdown-item">2.5 stars</button></li>
                <li><button onClick={() => starValue(3)} className="dropdown-item">3 stars</button></li>
                <li><button onClick={() => starValue(3.5)} className="dropdown-item">3.5 stars</button></li>
                <li><button onClick={() => starValue(4)} className="dropdown-item">4 stars</button></li>
                <li><button onClick={() => starValue(4.5)} className="dropdown-item">4.5 stars</button></li>
                <li><button onClick={() => starValue(5)} className="dropdown-item">5 stars</button></li>
            </ul>
            <RatingStars rating={starInput} size={30} />

            {showInput &&
                <form method="POST" action='#'>
                    <hr />

                    <div className="mb-3">
                        <label className="form-label">Review Description</label>
                        <textarea className="form-control" id="submitReviewDescription"
                            placeholder="Optional" rows={3}
                            onChange={e => setReviewDescription(e.target.value)}>
                        </textarea>
                    </div>
                    <div>
                        <button type="button" onClick={() => props.submitReview(starInput, reviewDescription)}
                         className="btn btn-primary mt-3">Submit review</button>
                    </div>
                </form>
            }
        </div>
    );
}