import { useOktaAuth } from "@okta/okta-react";
import { useState } from "react";
import Message from "../../../models/Message";

export const PostNewMessage = () => {

    const { authState } = useOktaAuth();
    const [subject, setSubject] = useState("");
    const [inquiry, setInquiry] = useState("");
    const [showWarning, setShowWarning] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    async function submitNewMessage() {
        const apiUrl = `${process.env.REACT_APP_API_URL}/messages/secure/post/message`;
        if (authState?.isAuthenticated && subject !== "" && inquiry !== "") {
            const messageRequest: Message = new Message(subject, inquiry);
            const requestOptions = {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(messageRequest)
            };
            const response = await fetch(apiUrl, requestOptions);
            if (!response.ok) {
                throw new Error('Something went wrong while posting the message!');
            }
            setSubject("");
            setInquiry("");
            setShowWarning(false);
            setShowSuccess(true);
        } else {
            setShowWarning(true);
            setShowSuccess(false);
        }
    }

    return (
        <div className="container mt-5 d-flex justify-content-center">
            <div className="card shadow-lg border-0 w-100" style={{ maxWidth: "600px" }}>


                <div className="card-header bg-dark text-white	text-center py-3 rounded-top">
                    <h4 className="mb-0">Post New Message</h4>
                </div>
                <div className="card-body bg-light">
                    <form method="post">
                        {showWarning && (
                            <div className="alert alert-warning text-center" role="alert">
                                ⚠️ Please fill in all fields before submitting.
                            </div>
                        )}
                        {showSuccess && (
                            <div className="alert alert-success mb-0 rounded-top text-center" role="alert">
                                Your message has been successfully sent!
                            </div>
                        )}
                        <div className="mb-3">
                            <label htmlFor="sampleInputSubject1" className="form-label fw-bold fs-5 text-dark">
                                Subject
                            </label>
                            <input
                                type="text"
                                className="form-control form-control-lg"
                                id="sampleInputSubject1"
                                placeholder="Enter subject"
                                onChange={(e) => setSubject(e.target.value)}
                                value={subject} />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="sampleInputInquiry1" className="form-label fw-bold fs-5 text-dark">
                                Inquiry
                            </label>
                            <textarea
                                className="form-control form-control-lg"
                                id="sampleInputInquiry1"
                                placeholder="Type your message..."
                                rows={4}
                                onChange={(e) => setInquiry(e.target.value)}
                                value={inquiry} />
                        </div>
                        <div className="d-grid justify-content-center">
                            <button
                                type="button"
                                className="btn btn-primary btn-lg mt-2 w-200"
                                onClick={submitNewMessage}>
                                Submit Message
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}