import { useOktaAuth } from "@okta/okta-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import librarySupportImage from '../../../Images/Public/image-2.jpg';  // relative path from LibrarySupport.tsx


export const LibrarySupport = () => {

    const { authState } = useOktaAuth();
    const { t } = useTranslation();

    return (
        <div className="container my-5">
            <div className="card shadow-lg bg-body-secondary rounded-4 p-4 p-lg-5">
                <div className="row align-items-center">
                    {/* Text Column */}
                    <div className="col-lg-7">
                        <h1 className="display-2 fw-bold mb-3">{t("librarySupport.title")}</h1>
                        <p className="lead text-secondary mb-4">{t("librarySupport.subtitle")}</p>
                        <div className="d-flex gap-3">
                            {authState?.isAuthenticated ? (
                                <Link
                                    to="/messages"
                                    className="btn btn-primary btn-lg px-4 hover-scale"
                                >
                                    {t("librarySupport.button.authenticated")}
                                </Link>
                            ) : (
                                <Link
                                    to="/login"
                                    className="btn btn-outline-primary btn-lg px-4 hover-scale"
                                >
                                    {t("librarySupport.button.unauthenticated")}
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Image Column */}
                    <div className='col-lg-4 offset-lg-1 shadow-lg'>
                        <img
                            src={librarySupportImage}
                            alt="Library Support"
                            className="img-fluid rounded"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}