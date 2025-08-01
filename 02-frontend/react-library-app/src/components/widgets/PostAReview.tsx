import { useState } from "react";
import { RatingStars } from "./RatingStars";
import { useTranslation } from "react-i18next";


export const PostAReview: React.FC<{ submitReview: any }> = (props) => {

    const { t } = useTranslation();
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
                {t("post_review.title")}
            </h5>
            <ul id="submitReviewRating" className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                {[0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((value) => (
                    <li key={value}>
                        <button onClick={() => starValue(value)} className="dropdown-item">
                            {t("post_review.star_option", { count: value })}
                        </button>
                    </li>
                ))}
            </ul>
            <RatingStars rating={starInput} size={30} />

            {showInput &&
                <form method="POST" action='#'>
                    <hr />

                    <div className="mb-3">
                        <label className="form-label">{t("post_review.label")}</label>
                        <textarea className="form-control" id="submitReviewDescription"
                            placeholder={t("post_review.placeholder")} rows={3}
                            onChange={e => setReviewDescription(e.target.value)}>
                        </textarea>
                    </div>
                    <div>
                        <button type="button" onClick={() => props.submitReview(starInput, reviewDescription)}
                            className="btn btn-primary mt-3">{t("post_review.submit_button")}
                        </button>
                    </div>
                </form>
            }
        </div>
    );
}