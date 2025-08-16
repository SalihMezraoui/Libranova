import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const BrowseBooks = () => {
    const { t } = useTranslation();
    return (
        <div className="py-5 mb-4 bg-dark header-image ">
            <div className="container-fluid browse-hero-container text-white d-flex justify-content-center align-items-center py-5">
                <div className="browse-hero-content text-center">
                    <h1 className="browse-hero-title display-3 fw-bold">{t("browseBooks.title")}</h1>
                    <p className="browse-hero-subtitle col-md-8 fs-3 mx-auto">{t("browseBooks.subtitle")}</p>
                    <Link
                        type="button"
                        className="btn browse-hero-btn main-color btn-lg text-white mt-3 hover-scale"
                        to="/search"
                    >
                        {t("browseBooks.button")}
                    </Link>
                </div>
            </div>
        </div>
    );

}