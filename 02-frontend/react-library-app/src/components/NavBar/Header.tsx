import { Link, NavLink } from 'react-router-dom';
import styles from './Header.module.css';
import { useOktaAuth } from '@okta/okta-react';
import { BreathingLoader } from '../Widgets/BreathingLoader';
import { ok } from 'assert';

export const Header = () => {

    const { oktaAuth, authState } = useOktaAuth();

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
                            <NavLink className='nav-link hover-underline' to='/home'> Startseite</NavLink>
                        </li>
                        <li className='nav-item'>
                            <NavLink className='nav-link hover-underline' to='/search'> Bücher suchen</NavLink>
                        </li>
                        { authState.isAuthenticated &&
                        <li className='nav-item'>
                            <NavLink className='nav-link hover-underline' to='/libraryActivity'> Bibliotheksaktivität</NavLink>
                        </li>
                        }
                    </ul>
                    {!authState.isAuthenticated ?
                        <div className='d-flex'>
                            <Link type='button' className='btn btn-auth rounded-pill px-4' to='/login'>
                                Login
                            </Link>
                        </div>
                        :
                        <div className='d-flex'>
                            <button className='btn btn-auth rounded-pill px-4' onClick={manageLogout}>
                                Logout
                            </button>
                        </div>
                    }
                </div>
            </div>
        </nav>

    );
}