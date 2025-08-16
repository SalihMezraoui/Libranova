import { useOktaAuth } from "@okta/okta-react";
import { useState } from "react";
import { Redirect } from "react-router-dom";
import { AdminInbox } from "./Layouts/AdminInbox";
import { AddBook } from "./Layouts/AddBook";
import { UpdateBooksQuantity } from "./Layouts/UpdateBooksQuantity";
import { useTranslation } from "react-i18next";
export const LibraryAdminPanel = () => {

    const { authState } = useOktaAuth();
    const { t } = useTranslation();

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

    if (!authState?.accessToken?.claims?.userType) {
        return <Redirect to='/home' />
    }

    return (
        <div className='container mt-5'>
            <div className="mt-3">
                <h1 className="text-dark fw-bold mb-4 pb-2 text-center">⚙️ {t("adminPanel.title")}</h1>
                <nav>
                    <div
                        className="nav nav-tabs justify-content-center gap-3 pb-3"
                        id="admin-nav-tab"
                        role="tablist"
                    >
                        <button
                            onClick={addBookToggle}
                            className={`nav-link rounded-pill fw-semibold ${!messagesSectionToggled && !updateBooksQuantity
                                ? 'active bg-primary text-white fw-bold shadow-sm'
                                : 'text-primary bg-white border border-primary'
                                }`}
                            id="admin-add-book-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#admin-add-book"
                            type="button"
                            role="tab"
                            aria-controls="admin-add-book"
                            aria-selected={!messagesSectionToggled && !updateBooksQuantity ? 'true' : 'false'}
                        >
                            {t("adminPanel.addBook")}
                        </button>

                        <button
                            onClick={updateBooksQuantityToggle}
                            className={`nav-link rounded-pill fw-semibold ${!messagesSectionToggled && updateBooksQuantity
                                ? 'active bg-primary text-white fw-bold shadow-sm'
                                : 'text-primary bg-white border border-primary'
                                }`}
                            id="admin-update-quantity-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#admin-update-quantity"
                            type="button"
                            role="tab"
                            aria-controls="admin-update-quantity"
                            aria-selected={!messagesSectionToggled && updateBooksQuantity ? 'true' : 'false'}
                        >
                            {t("adminPanel.manageBooks")}
                        </button>

                        <button
                            onClick={messagesSectionToggle}
                            className={`nav-link rounded-pill fw-semibold ${messagesSectionToggled && !updateBooksQuantity
                                ? 'active bg-primary text-white fw-bold shadow-sm'
                                : 'text-primary bg-white border border-primary'
                                }`}
                            id="admin-messages-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#admin-messages"
                            type="button"
                            role="tab"
                            aria-controls="admin-messages"
                            aria-selected={messagesSectionToggled && !updateBooksQuantity ? 'true' : 'false'}
                        >
                            {t("adminPanel.messages")}
                        </button>
                    </div>
                </nav>

                <div className="tab-content" id="admin-nav-tabContent">
                    <div
                        className={`tab-pane fade ${!messagesSectionToggled && !updateBooksQuantity ? 'show active' : ''}`}
                        id="admin-add-book"
                        role="tabpanel"
                        aria-labelledby="admin-add-book-tab"
                    >
                        <AddBook />
                    </div>
                    <div
                        className={`tab-pane fade ${!messagesSectionToggled && updateBooksQuantity ? 'show active' : ''}`}
                        id="admin-update-quantity"
                        role="tabpanel"
                        aria-labelledby="admin-update-quantity-tab"
                    >
                        {updateBooksQuantity ? <UpdateBooksQuantity /> : <></>}
                    </div>
                    <div
                        className={`tab-pane fade ${messagesSectionToggled && !updateBooksQuantity ? 'show active' : ''}`}
                        id="admin-messages"
                        role="tabpanel"
                        aria-labelledby="admin-messages-tab"
                    >
                        {messagesSectionToggled ? <AdminInbox /> : <></>}
                    </div>
                </div>
            </div>
        </div>
    );

}