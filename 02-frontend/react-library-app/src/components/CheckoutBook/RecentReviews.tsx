import { Link } from "react-router-dom";
import Review from "../../models/Review";
import { ReviewComponent } from "../Widgets/ReviewComponent";
import { useTranslation } from "react-i18next";

interface RecentReviewsProps {
  reviews: Review[];
  bookId: number | undefined;
  mobile: boolean;
  maxDisplay?: number;
}

export const RecentReviews: React.FC<RecentReviewsProps> = ({
  reviews,
  bookId,
  mobile,
  maxDisplay = 4,
}) => {
  const { t } = useTranslation();

  return (
    <section
      className={mobile ? "mt-4" : "row mt-5"}
      aria-label={t("recentReviews.title")}
    >
      <header className={mobile ? "" : "col-sm-3 col-md-2"}>
        <h2 className="h4 text-dark fw-bold mb-4">{t("recentReviews.title")}</h2>
      </header>
      <div className="col-sm-9 col-md-10">
        {reviews.length > 0 ? (
          <>
            <div className="d-flex flex-column gap-4">
              {reviews.slice(0, maxDisplay).map((review) => (
                <article key={review.id}>
                  <div className="card shadow-sm border-0">
                    <div className="card-body">
                      <ReviewComponent review={review} />
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-4 mb-5 text-center">
              <Link
                to={`/reviewsList/${bookId}`}
                className="btn btn-md btn-lg main-color rounded-pill text-white invert-hover"
                aria-label={t("recentReviews.seeAll")}
              >
                {t("recentReviews.seeAll")} <i className="bi bi-chevron-right"></i>
              </Link>
            </div>
          </>
        ) : (
          <div className="alert alert-warning rounded p-4 text-center" role="alert">
            <i className="bi bi-exclamation-triangle-fill fs-3 mb-2"></i>
            <p className="lead mb-0">{t("recentReviews.noReviews")}</p>
          </div>
        )}
      </div>
    </section>
  );
};
