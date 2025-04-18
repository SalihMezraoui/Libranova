import styles from './Header.module.css';

export const Header = () => {

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
                            <a className='nav-link hover-underline' href='#'> Startseite</a>
                        </li>
                        <li className='nav-item'>
                            <a className='nav-link hover-underline' href='#'> Bücher suchen</a>
                        </li>

                    </ul>
                    <div className='d-flex'>
                        <button className='btn btn-auth rounded-pill px-4'>
                            Login
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}