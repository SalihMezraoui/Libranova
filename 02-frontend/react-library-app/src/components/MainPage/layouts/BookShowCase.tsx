import { useOktaAuth } from "@okta/okta-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const BookShowCase = () => {
  const { authState } = useOktaAuth();
  const { t } = useTranslation();

  return (
    <section className="py-5 bg-light">
      <div className="text-center text-dark py-5 hero-section">
        <h1 className="display-5 fw-bold">{t("bookShowCase.welcomeMessage")}</h1>
        <p className="lead mb-4">{t("bookShowCase.welcomeDescription")}</p>

        {authState?.isAuthenticated ? (
          <Link className="btn btn-lg btn-outline-dark shadow-sm" to="/search">
            {t("bookShowCase.browseBooks")}
          </Link>
        ) : (
          <Link className="btn btn-lg btn-dark shadow-sm" to="/login">
            {t("bookShowCase.signIn")}
          </Link>
        )}
      </div>

      {/* Features section */}
      <div className="container mt-5">
        <div className="row text-center">
          <div className="col-md-4 mb-4">
            <div className="p-4 bg-white shadow-sm rounded h-100">
              <i className="bi bi-book-half display-5 text-primary mb-3"></i>
              <h5>{t("bookShowCase.browseBooks")}</h5>
              <p className="text-muted">{t("bookShowCase.browseBooksDescription")}</p>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="p-4 bg-white shadow-sm rounded h-100">
              <i className="bi bi-stars display-5 text-warning mb-3"></i>
              <h5>{t("bookShowCase.personalRecommendations")}</h5>
              <p className="text-muted">{t("bookShowCase.personalRecommendationsDescription")}</p>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="p-4 bg-white shadow-sm rounded h-100">
              <i className="bi bi-journal-check display-5 text-success mb-3"></i>
              <h5>{t("bookShowCase.trackReadingProgress")}</h5>
              <p className="text-muted">{t("bookShowCase.trackReadingProgressDescription")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
