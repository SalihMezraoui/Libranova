import { Link } from "react-router-dom";
import Book from "../../models/Book";
import { PostAReview } from "../Widgets/PostAReview";
import { useTranslation } from "react-i18next";
import React, { useMemo } from "react";

export const ReviewCheckoutPanel: React.FC<{
  book: Book | undefined;
  mobile: boolean;
  currentLoans: number;
  isAuthenticated: any;
  isCheckedOut: boolean;
  checkoutBook: any;
  isReviewRemaining: boolean;
  submitReview: any;
}> = (props) => {
  const { t } = useTranslation();

  const checkoutButton = useMemo(() => {
    if (!props.isAuthenticated) {
      return (
        <Link to="/login" className="btn btn-success btn-lg w-100">
          {t("checkout.signIn")}
        </Link>
      );
    }

    if (!props.isCheckedOut && props.currentLoans < 5) {
      if (!props.book?.copiesInStock || props.book.copiesInStock <= 0) {
        return (
          <button
            className="btn btn-success btn-lg w-100 shadow-sm"
            disabled
          >
            {t("checkout.checkout")}
          </button>
        );
      }

      return (
        <button
          onClick={() => props.checkoutBook()}
          className="btn btn-success btn-lg w-100 shadow-sm"
          aria-label={t("checkout.checkout")}
        >
          {t("checkout.checkout")}
        </button>
      );
    }

    if (props.isCheckedOut) {
      return (
        <p className="text-success fw-semibold text-center">
          <i className="bi bi-check-circle-fill me-2"></i>
          {t("checkout.alreadyCheckedOut")}
        </p>
      );
    }

    return (
      <p className="text-danger fw-semibold text-center">
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        {t("checkout.maxReached")}
      </p>
    );
  }, [
    props.isAuthenticated,
    props.isCheckedOut,
    props.currentLoans,
    props.checkoutBook,
    t,
  ]);

  const reviewSection = useMemo(() => {
    if (!props.isAuthenticated) {
      return (
        <div className="mt-4 text-center text-muted fst-italic">
          {t("checkout.signInToReview")}
        </div>
      );
    }

    if (!props.isReviewRemaining) {
      return (
        <div className="mt-4">
          <PostAReview submitReview={props.submitReview} />
        </div>
      );
    }

    return (
      <p className="mt-4 fw-semibold text-center text-primary">
        {t("checkout.thankYouReview")}
      </p>
    );
  }, [props.isAuthenticated, props.isReviewRemaining, props.submitReview, t]);

  return (
    <section
      className={`card shadow-lg rounded-4 p-4 ${props.mobile ? "mx-3 my-5" : "col-3 mx-auto my-5"
        }`}
      aria-label={t("checkout.panel")}
    >
      <header className="mb-4 text-center">
        <p className="fs-5 fw-bold text-dark">
          {props.currentLoans}/5 {t("checkout.booksCheckedOut")}
        </p>
        <hr />
        {props.book?.copiesInStock && props.book.copiesInStock > 0 ? (
          <p className="text-success fs-6 fw-semibold">{t("checkout.available")}</p>
        ) : (
          <p className="text-danger fs-6 fw-semibold">{t("checkout.notAvailable")}</p>
        )}
        <div className="d-flex justify-content-between mt-3">
          <p className="mb-0">
            <strong>{props.book?.totalCopies ?? 0}</strong> {t("checkout.copies")}
          </p>
          <p className="mb-0">
            <strong>{props.book?.copiesInStock ?? 0}</strong> {t("checkout.available")}
          </p>
        </div>
      </header>

      {checkoutButton}

      <hr className="my-4" />

      <p className="text-center fst-italic text-muted small">
        {t("checkout.dynamicAvailabilityNote")}
      </p>

      {reviewSection}
    </section>
  );
};
