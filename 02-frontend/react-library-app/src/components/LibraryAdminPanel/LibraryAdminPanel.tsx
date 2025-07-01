import { useOktaAuth } from "@okta/okta-react";
import { useState } from "react";
import { Redirect } from "react-router-dom";
import { AdminInbox } from "./Layouts/AdminInbox";

export const LibraryAdminPanel = () => {

    const { authState } = useOktaAuth();

    const [updateBooksQuantity, setUpdateBooksQuantity] = useState(false);
    const [messagesSectionToggled, setMessagesSectionToggled] = useState(false);

    function addBookToggle() {
        setUpdateBooksQuantity(false);
        setMessagesSectionToggled(false);
    }

    function updateBooksQuantityToggle() {
        setUpdateBooksQuantity(true);
        setMessagesSectionToggled(false);
    }

    function messagesSectionToggle() {
        setUpdateBooksQuantity(false);
        setMessagesSectionToggled(true);
    }

    if (authState?.accessToken?.claims.userType === undefined) {
        return <Redirect to='/home' />
    }

    return (
        <div className='container mt-5'>
            <div className="mt-3">
                <h1 className="text-dark fw-bold mb-4 pb-2 text-center">⚙️ Library Management</h1>
                <nav>
                    <div
                        className="nav nav-tabs justify-content-center gap-3 pb-3"
                        id="nav-tab"
                        role="tablist"
                    >
                        <button
                            onClick={addBookToggle}
                            className={`nav-link rounded-pill fw-semibold ${!messagesSectionToggled && !updateBooksQuantity
                                ? 'active bg-primary text-white fw-bold shadow-sm'
                                : 'text-primary bg-white border border-primary'
                                }`}
                            id="nav-add-book-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#nav-add-book"
                            type="button"
                            role="tab"
                            aria-controls="nav-add-book"
                            aria-selected='false'
                        >
                            Add new book
                        </button>

                        <button
                            onClick={updateBooksQuantityToggle}
                            className={`nav-link rounded-pill fw-semibold ${!messagesSectionToggled && updateBooksQuantity
                                ? 'active bg-primary text-white fw-bold shadow-sm'
                                : 'text-primary bg-white border border-primary'
                                }`}
                            id="nav-update-quantity-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#nav-update-quantity"
                            type="button"
                            role="tab"
                            aria-controls="nav-update-quantity"
                            aria-selected='true'
                        >
                            Update quantity
                        </button>

                        <button
                            onClick={messagesSectionToggle}
                            className={`nav-link rounded-pill fw-semibold ${messagesSectionToggled && !updateBooksQuantity
                                ? 'active bg-primary text-white fw-bold shadow-sm'
                                : 'text-primary bg-white border border-primary'
                                }`}
                            id="nav-messages-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#nav-messages"
                            type="button"
                            role="tab"
                            aria-controls="nav-messages"
                            aria-selected='true'
                        >
                            Messages
                        </button>
                    </div>
                </nav>

                <div className="tab-content" id="nav-tabContent">
                    <div className="tab-pane fade show active" id="nav-add-book" role="tabpanel"
                        aria-labelledby="nav-add-book-tab">
                        Add new book
                    </div>
                    <div className="tab-pane fade" id="nav-update-quantity" role="tabpanel"
                        aria-labelledby="nav-update-quantity-tab">
                        {updateBooksQuantity ? <p>Update book quantity form goes here</p> : <></>}
                    </div>
                    <div className="tab-pane fade" id="nav-messages" role="tabpanel"
                        aria-labelledby="nav-messages-tab">
                        {messagesSectionToggled ? <AdminInbox /> : <></>}
                    </div>
                </div>
            </div>
        </div>
    );
}