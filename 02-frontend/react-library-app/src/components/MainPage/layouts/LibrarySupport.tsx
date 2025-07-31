import { useOktaAuth } from "@okta/okta-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";


export const LibrarySupport = () => {

    const { authState } = useOktaAuth();
    const { t } = useTranslation();

    return (
        <div className='container my-5'>
            <div className='row p-4 align-items-center border shadow-lg rounded-4 bg-body-secondary'>
                <div className='col-lg-7 p-3'>
                    <h1 className='display-4 fw-bold'>
                        {t("librarySupport.title")}
                    </h1>
                    <p className='lead mb-4'>
                         {t("librarySupport.subtitle")}
                    </p>
                    <div className='d-grid gap-2 justify-content-md-start mb-4 mb-lg-3'>
                        {authState?.isAuthenticated ?
                            <Link type='button' className='btn main-color btn-lg  
                            text-white hover-scale'
                                to='/messages'>{t("librarySupport.button.authenticated")}</Link>
                            :
                            <Link type='button' className='btn main-color btn-lg text-white hover-scale'
                                to='/login'>{t("librarySupport.button.unauthenticated")}</Link>
                        }
                    </div>
                </div>
                <div className='col-lg-4 offset-lg-1 shadow-lg col-image-medium'></div>
            </div>
        </div>
    );
}