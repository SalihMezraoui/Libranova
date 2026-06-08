import React from 'react';
import './App.css';
import { Header } from './components/NavBar/Header';
import { Footer } from './components/Footer/Footer';
import { MainPage } from './components/MainPage/MainPage';
import { SearchBookPage } from './components/SearchBookPage/SearchBookPage';
import { Redirect, Route, Switch } from 'react-router-dom';
import { CheckoutBook } from './components/CheckoutBook/CheckoutBook';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { LoginPage } from './Auth/LoginPage';
import { ReviewList } from './components/ReviewListPage/ReviewList';
import { LibraryActivity } from './components/LibraryActivityPage/LibraryActivity';
import { MessagePage } from './components/MessagesPage/MessagePage';
import { LibraryAdminPanel } from './components/LibraryAdminPanel/LibraryAdminPanel';
import { PaymentDashboard } from './components/PaymentDashboard/PaymentDashboard';
import { WishlistPage } from './components/WishlistPage/WishlistPage';
import Accessibility from './components/Accessibility/Accessibility';
import AboutUs from './components/AboutUs/AboutUs';

const ProtectedRoute = ({ component, ...args }: any) => {
    const WrappedComponent = React.useMemo(
        () => withAuthenticationRequired(component, {
            onRedirecting: () => (
                <div className="container mt-5 text-center">
                    <div className="spinner-border" role="status" />
                </div>
            )
        }),
        [component]
    );
    return <Route {...args} component={WrappedComponent} />;
};

export const App = () => {
    const { isLoading } = useAuth0();

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center mt-5">
                <div className="spinner-border" role="status" />
            </div>
        );
    }

    return (
        <div className='d-flex flex-column min-vh-100'>
            <Header />
            <div className='flex-grow-1'>
                <Switch>
                    <Route path='/' exact>
                        <Redirect to='/home' />
                    </Route>
                    <Route path='/home'>
                        <MainPage />
                    </Route>
                    <Route path='/search'>
                        <SearchBookPage />
                    </Route>
                    <Route path='/reviewsList/:bookId'>
                        <ReviewList />
                    </Route>
                    <Route path='/checkout/:bookId'>
                        <CheckoutBook />
                    </Route>
                    <Route path='/accessibility'>
                        <Accessibility />
                    </Route>
                    <Route path='/aboutUs'>
                        <AboutUs />
                    </Route>
                    <Route path='/login'>
                        <LoginPage />
                    </Route>
                    <ProtectedRoute path='/libraryActivity' component={LibraryActivity} />
                    <ProtectedRoute path='/messages' component={MessagePage} />
                    <ProtectedRoute path='/admin' component={LibraryAdminPanel} />
                    <ProtectedRoute path='/charges' component={PaymentDashboard} />
                    <ProtectedRoute path='/wishlist' component={WishlistPage} />
                </Switch>
            </div>
            <Footer />
        </div>
    );
};
