import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import Message from "../../../models/Message";
import { BreathingLoader } from "../../Widgets/BreathingLoader";
import { Pagination } from "../../Widgets/Pagination";

export const Messages = () => {

    const { authState } = useOktaAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    const [messages, setMessages] = useState<Message[]>([]);

    const [messagesPerPage, setMessagesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchMessages = async () => {
            if (authState && authState?.isAuthenticated) {
                const apiUrl = `http://localhost:8080/api/messages/search/findByUserEmail?userEmail=${authState?.accessToken?.claims.sub}&page=${currentPage - 1}&size=${messagesPerPage}`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                        'Content-Type': 'application/json',
                    }
                };
                const response = await fetch(apiUrl, requestOptions);
                if (!response.ok) {
                    throw new Error('Something went wrong while fetching messages!');
                }
                const responseData = await response.json();
                setMessages(responseData._embedded.messages);
                setTotalPages(responseData.page.totalPages);
            }
            setIsLoading(false);
        }
        fetchMessages().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message || "Something went wrong while fetching messages!");
        })
        window.scrollTo(0, 0);

    }, [authState, currentPage]);

    if (isLoading) {
        return <BreathingLoader />;
    }

    if (httpError) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger text-center" role="alert">
                    {httpError}
                </div>
            </div>
        );
    }

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    }

    return (
        <div className="mt-4">
            {messages.length > 0 ?
                <>
                    <h4 className="text-center mb-4 fw-semibold text-secondary">Your Message History</h4>
                    {messages.map(message => (
                        <div key={message.id} className="mb-4">
                            <div className="card shadow-sm border-0">
                                <div className="card-body">
                                    <div className="mb-2"></div>
                                    <h5 className="card-title text-dark">
                                        <span className="text-muted">Case #{message.id}:</span> {message.subject}
                                    </h5>
                                    <h6 className="card-subtitle text-secondary mb-2">{message.userEmail}</h6>
                                    <p className="card-text">{message.inquiry}</p>
                                    <hr />
                                    <div>
                                        <h6 className="text-success fw-bold mb-2">Response</h6>
                                        {message.response && message.adminEmail ? (
                                            <>
                                                <p className="mb-1">
                                                    <strong>Admin:</strong> {message.adminEmail}
                                                </p>
                                                <p>{message.response}</p>
                                            </>
                                        ) : (
                                            <p className="text-muted fst-italic">
                                                No response yet. Please be patient.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </>
                :
                <div className="container mt-5">
                    <div className="alert alert-info text-center" role="alert">
                        You have no messages yet. Please post a new message.
                    </div>
                </div>
            }
            {totalPages > 1 && (
                <div className="mt-4">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        paginate={paginate}
                    />
                </div>
            )}
        </div >
    );
}