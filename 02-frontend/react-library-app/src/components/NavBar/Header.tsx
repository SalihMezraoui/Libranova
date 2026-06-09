import { Link, NavLink } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { BreathingLoader } from '../widgets/BreathingLoader';
import { useTranslation } from 'react-i18next';


export const Header = () => {

    const { isAuthenticated, isLoading, user, logout } = useAuth0();
    const { t, i18n } = useTranslation();

    if (isLoading) {
        return <BreathingLoader />;
    }

    const manageLogout = () => logout({ logoutParams: { returnTo: window.location.origin } });

    let username =
        user?.given_name ||
        user?.email ||
        'User';

    if (username.includes('@')) {
        username = username.split('@')[0];
    }

    const isAdmin = user?.['https://libranova.com/userType'] === 'admin';

    return (
        <nav className='navbar navbar-expand-lg navbar-dark main-color py-3'>
            <div className='container-fluid'>
                <NavLink to="/" className="navbar-brand d-flex align-items-center">
                    <img
                        src="/Libranova-logo.png"
                        alt="Libranova Logo"
                        height="42"
                        className="me-2"
                    />
                </NavLink>
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
                            <NavLink className='nav-link hover-underline' to='/aboutUs'> {t("header.aboutUs")}</NavLink>
                        </li>
                        <li className='nav-item'>
                            <NavLink className='nav-link hover-underline' to='/search'> {t("header.searchBooks")}</NavLink>
                        </li>
                        {isAuthenticated && isAdmin && (
                            <li className='nav-item'>
                                <NavLink className='nav-link hover-underline' to='/admin'> {t("header.admin")}</NavLink>
                            </li>
                        )}
                        {isAuthenticated && !isAdmin && (
                            <>
                                <li className='nav-item'>
                                    <NavLink className='nav-link hover-underline' to='/libraryActivity'> {t("header.libraryActivity")}</NavLink>
                                </li>
                                <li className='nav-item'>
                                    <NavLink className='nav-link hover-underline' to='/wishlist'> {t("header.wishlist")}</NavLink>
                                </li>
                                <li className='nav-item'>
                                    <NavLink className='nav-link hover-underline' to='/messages'> {t("header.messages")}</NavLink>
                                </li>
                                <li className='nav-item'>
                                    <NavLink className='nav-link hover-underline' to='/charges'> {t("header.overdueCharges")}</NavLink>
                                </li>
                            </>
                        )}
                    </ul>
                    <div className="d-flex align-items-center gap-2">
                        {isAuthenticated && (
                            <div className="d-flex align-items-center me-3 px-3 py-1 rounded-pill bg-dark text-light shadow-sm">
                                <span className="me-2">👋</span>
                                <span className="fw-semibold">{t("header.hello")}, {username}</span>
                            </div>
                        )}

                        <div className="dropdown me-2">
                            <button
                                className="btn btn-outline-light dropdown-toggle"
                                type="button"
                                id="languageDropdown"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                                style={{ fontSize: "1.6rem" }}
                            >
                                🌐 {i18n.language === 'de' ? '🇩🇪' : '🇬🇧'}
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="languageDropdown">
                                <li>
                                    <button className="dropdown-item"
                                        onClick={() => i18n.changeLanguage('en')}
                                        style={{ fontSize: "1.3rem" }}
                                    >
                                        🇬🇧 English
                                    </button>
                                </li>
                                <li>
                                    <button className="dropdown-item"
                                        onClick={() => i18n.changeLanguage('de')}
                                        style={{ fontSize: "1.3rem" }}
                                    >
                                        🇩🇪 Deutsch
                                    </button>
                                </li>
                            </ul>
                        </div>

                        {!isAuthenticated ? (
                            <Link type="button" className="btn btn-auth rounded-pill px-4 ms-2" to="/login">
                                👤 {t("header.login")}
                            </Link>
                        ) : (
                            <button className="btn btn-auth rounded-pill px-4 ms-2"
                                onClick={manageLogout}>
                                👤 {t("header.logout")}
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </nav>
    );
}
