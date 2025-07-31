import { Link, NavLink } from 'react-router-dom';
import styles from './Header.module.css';
import { useOktaAuth } from '@okta/okta-react';
import { BreathingLoader } from '../Widgets/BreathingLoader';
import { ok } from 'assert';
import { useTranslation } from 'react-i18next';


export const Header = () => {

    const { oktaAuth, authState } = useOktaAuth();
    const { t, i18n } = useTranslation();


    if (!authState) {
        return <BreathingLoader />;
    }

    const manageLogout = async () => oktaAuth.signOut();


    console.log('authState', authState);

    return (
        <nav className='navbar navbar-expand-lg navbar-dark main-color py-3'>
            <div className='container-fluid'>
                <span className='navbar-brand fw-bold fs-4'>Libranova</span>
                <button className='navbar-toggler' type='button'
                    data-bs-toggle='collapse' data-bs-target='#navbarContent'
                    aria-controls='navbarContent' aria-expanded='false'
                    aria-label='Toggle Navigation'
                >
                    <span className='navbar-toggler-animated'></span>
                </button>
                <div className='collapse navbar-collapse' id='navbarContent'>
                    <ul className='navbar-nav me-auto'>
                        <li className='nav-item'>
                            <NavLink className='nav-link hover-underline' to='/home'> {t("header.home")}</NavLink>
                        </li>
                        <li className='nav-item'>
                            <NavLink className='nav-link hover-underline' to='/search'> {t("header.searchBooks")}</NavLink>
                        </li>
                        {authState.isAuthenticated &&
                            <li className='nav-item'>
                                <NavLink className='nav-link hover-underline' to='/libraryActivity'> {t("header.libraryActivity")}</NavLink>
                            </li>
                        }
                        {authState.isAuthenticated &&
                            <li className='nav-item'>
                                <NavLink className='nav-link hover-underline' to='/charges'> {t("header.overdueCharges")}</NavLink>
                            </li>
                        }
                        {authState.isAuthenticated && authState.accessToken?.claims?.userType === 'admin' &&
                            <li className='nav-item'>
                                <NavLink className='nav-link hover-underline' to='/admin'> {t("header.admin")}</NavLink>
                            </li>
                        }
                    </ul>
                    <div className="d-flex align-items-center gap-2">

                        <button
                            onClick={() => i18n.changeLanguage('en')}
                            className="btn btn-sm btn-outline-secondary-light"
                        >
                            EN
                        </button>
                        <button
                            onClick={() => i18n.changeLanguage('de')}
                            className="btn btn-sm btn-outline-secondary-light"
                        >
                            DE
                        </button>

                        {!authState.isAuthenticated ? (
                            <Link type="button" className="btn btn-auth rounded-pill px-4 ms-2" to="/login">
                                {t("header.login")}
                            </Link>
                        ) : (
                            <button className="btn btn-auth rounded-pill px-4 ms-2" onClick={manageLogout}>
                                {t("header.logout")}
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </nav>

    );
}