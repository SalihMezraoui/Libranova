import { useState } from "react";
import { PostMessage } from "./Layouts/PostMessage";
import { Messages } from "./Layouts/Messages";
import { useTranslation } from "react-i18next";

export const MessagePage = () => {
    const [messagesToggled, setMessagesToggled] = useState(false);
    const { t } = useTranslation();

    return (
        <div className="container mt-5">
            <div className="mt-3">
                <nav>
                    <div
                        className="nav nav-pills justify-content-center gap-3 pb-3 border-bottom"
                        id="nav-tab"
                        role="tablist"
                    >
                        <button
                            onClick={() => setMessagesToggled(false)}
                            className={`nav-link d-flex align-items-center px-4 py-2 rounded-3 fw-semibold shadow-sm ${!messagesToggled
                                    ? "active bg-success text-white"
                                    : "text-success bg-light border border-success"
                                }`}
                            id="nav-sent-messages-tab"
                            type="button"
                            role="tab"
                            aria-controls="nav-send-message"
                            aria-selected={!messagesToggled}
                        >
                            <i className="bi bi-pencil-square me-2"></i>
                            {t("messagePage.submitQuestion")}
                        </button>

                        <button
                            onClick={() => setMessagesToggled(true)}
                            className={`nav-link d-flex align-items-center px-4 py-2 rounded-3 fw-semibold shadow-sm ${messagesToggled
                                    ? "active bg-success text-white"
                                    : "text-success bg-light border border-success"
                                }`}
                            id="nav-message-tab"
                            type="button"
                            role="tab"
                            aria-controls="nav-message"
                            aria-selected={messagesToggled}
                        >
                            <i className="bi bi-envelope-open me-2"></i>
                            {t("messagePage.receivedMessages")}
                        </button>
                    </div>
                </nav>

                {/* Tab Content */}
                <div className="tab-content mt-4" id="nav-tabContent">
                    <div
                        className={`tab-pane fade ${!messagesToggled ? "show active" : ""
                            }`}
                        id="nav-sent-message"
                        role="tabpanel"
                        aria-labelledby="nav-sent-messages-tab"
                    >
                        <PostMessage />
                    </div>

                    <div
                        className={`tab-pane fade ${messagesToggled ? "show active" : ""
                            }`}
                        id="nav-message"
                        role="tabpanel"
                        aria-labelledby="nav-message-tab"
                    >
                        <Messages />
                    </div>
                </div>
            </div>
        </div>
    );
};
