import { useState } from "react";
import { RatingStars } from "./RatingStars";
import { useTranslation } from "react-i18next";

interface PostAReviewProps {
  submitReview: (rating: number, comment: string) => void;
}

const ratingOptions = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

export const PostAReview: React.FC<PostAReviewProps> = ({ submitReview }) => {
  const { t } = useTranslation();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleRatingSelect = (value: number) => {
    setRating(value);
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (rating > 0) {
      submitReview(rating, comment.trim());
    }
  };

  return (
    <div className="dropdown" style={{ cursor: "pointer" }}>
      <h5
        className="dropdown-toggle"
        id="submitReviewDropdown"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {t("post_review.title")}
      </h5>

      <ul
        id="submitReviewRating"
        className="dropdown-menu"
        aria-labelledby="submitReviewDropdown"
      >
        {ratingOptions.map((value) => (
          <li key={value}>
            <button
              type="button"
              onClick={() => handleRatingSelect(value)}
              className="dropdown-item"
            >
              {t("post_review.star_option", { count: value })}
            </button>
          </li>
        ))}
      </ul>

      <RatingStars rating={rating} size={30} />

      {showForm && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="mt-3"
        >
          <div className="mb-3">
            <label htmlFor="commentInput" className="form-label">
              {t("post_review.label")}
            </label>
            <textarea
              id="commentInput"
              className="form-control"
              placeholder={t("post_review.placeholder")}
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              // required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={rating === 0}
          >
            {t("post_review.submit_button")}
          </button>
        </form>
      )}
    </div>
  );
};
