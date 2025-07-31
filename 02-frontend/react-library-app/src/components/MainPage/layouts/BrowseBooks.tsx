import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const BrowseBooks = () => {
    const { t } = useTranslation();
    return (

        <div className='p-5 mb-4 bg-dark header'>
            <div className='container-fluid py-5 text-white 
                d-flex justify-content-center align-items-center'>
                <div className='text-center'>
                    <h1 className='display-5 fw-bold'>{t('browseBooks.title')}</h1>
                    <p className='col-md-8 fs-4 mx-auto'>{t('browseBooks.subtitle')}</p>
                    <Link type='button' className='btn main-color btn-lg text-white mt-3 hover-scale' to='/search'>
                        {t('browseBooks.button')}</Link>
                </div>
            </div>
        </div>
    );
}