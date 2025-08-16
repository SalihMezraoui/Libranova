import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import 'bootstrap-icons/font/bootstrap-icons.css';

export const Footer = () => {
    const { t } = useTranslation();
    
    return (
        <div className='main-color'>
            <footer className="container py-5 main-color text-white">
                
                <div className="d-flex justify-content-between align-items-center flex-wrap">
                    
                    <p className="mb-0 d-flex align-items-center">
                        <i className="bi bi-book-half me-2"></i>
                        © Libranova App, Inc
                    </p>

                    <nav className="nav">
                        <Link to="/home" className="nav-link text-white hover-underline">
                            <i className="bi bi-house-door me-1"></i>
                            {t("footer.home")}
                        </Link>
                        <Link to="/search" className="nav-link text-white hover-underline">
                            <i className="bi bi-search me-1"></i>
                            {t("footer.searchBooks")}
                        </Link>
                        <Link to="/aboutUs" className="nav-link text-white hover-underline">
                            <i className="bi bi-info-circle me-1"></i>
                            {t("footer.aboutUs")}
                        </Link>
                        <Link to="/accessibility" className="nav-link text-white hover-underline">
                            <i className="bi bi-universal-access me-1"></i>
                            {t("footer.accessibility")}
                        </Link>
                    </nav>
                </div>

            </footer>
        </div>
    );
};
