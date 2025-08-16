import React from "react";
import { useTranslation } from "react-i18next";
import Review from "../../models/Review";
import { RatingStars } from "./RatingStars";

interface ReviewComponentProps {
  review: Review;
}

export const ReviewComponent: React.FC<ReviewComponentProps> = ({ review }) => {
  const { i18n } = useTranslation();

  const date = new Date(review.createdAt);
  const formattedDate = date.toLocaleDateString(i18n.language, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mb-4">
      <div className="p-4 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <div className="d-flex align-items-center gap-3">
            <div
              className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center"
              style={{ width: 40, height: 40, fontWeight: "bold" }}
            >
              {review.userEmail.charAt(0).toUpperCase()}
            </div>
            <div>
              <h6 className="mb-0 text-dark">{review.userEmail}</h6>
              <small className="text-muted">{formattedDate}</small>
            </div>
          </div>
          <RatingStars rating={review.ratingValue} size={20} />
        </div>
        <div className="mt-3">
          <p className="text-dark mb-0" style={{ lineHeight: 1.5 }}>
            {review.comment}
          </p>
        </div>
      </div>
    </div>
  );
};
