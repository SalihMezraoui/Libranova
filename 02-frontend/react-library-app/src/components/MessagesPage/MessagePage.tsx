import { useState } from "react";
import { PostNewMessage } from "./Layouts/PostNewMessage";
import { Messages } from "./Layouts/Messages";

export const MessagePage = () => {

    const [messagesToggled, setMessagesToggled] = useState(false);

    return (
        <div className="container mt-5">
            <div className="mt-3">
                <nav>
                    <div className="nav nav-tabs justify-content-center gap-3 pb-3" id="nav-tab" role="tablist">
                        <button onClick={() => setMessagesToggled(false)}
                            className={`nav-link rounded-pill fw-semibold ${!messagesToggled
                                    ? 'active bg-success text-white fw-bold shadow-sm'
                                    : 'text-success bg-white border border-success'
                                }`}
                            id="nav-sent-messages-tab" data-bs-toggle="tab" data-bs-target="#nav-sent-message"
                            type="button" role="tab" aria-controls="nav-send-message" aria-selected={!messagesToggled}>
                            Submit Question
                        </button>
                        <button onClick={() => setMessagesToggled(true)} 
                        className={`nav-link rounded-pill fw-semibold ${messagesToggled
                                    ? 'active bg-success text-white fw-bold shadow-sm'
                                    : 'text-success bg-white border border-success'
                                }`}
                            id="nav-message-tab" data-bs-toggle="tab" data-bs-target="#nav-message"
                            type="button" role="tab" aria-controls="nav-message" aria-selected={messagesToggled}>
                            Received Messages
                        </button>
                    </div>
                </nav>
                <div className="tab-content" id="nav-tabContent">
                    <div className="tab-pane fade show active" id="nav-sentd-message" role="tabpanel"
                        aria-labelledby="nav-send-message-tab" >
                        <PostNewMessage />
                    </div>
                    <div className="tab-pane fade" id="nav-message" role="tabpanel"
                        aria-labelledby="nav-message-tab">
                        {messagesToggled ? <Messages /> : <></>}
                    </div>

                </div>
            </div>
        </div>
    );
}