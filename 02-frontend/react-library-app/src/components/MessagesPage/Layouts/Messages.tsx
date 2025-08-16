import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import Message from "../../../models/Message";
import { BreathingLoader } from "../../Widgets/BreathingLoader";
import { Pagination } from "../../Widgets/Pagination";
import { useTranslation } from "react-i18next";

export const Messages = () => {

    const { authState } = useOktaAuth();
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    const [messages, setMessages] = useState<Message[]>([]);

    const [messagesPerPage, setMessagesPerPage] = useState(5);
    const [actualPage, setActualPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const loadMessages = async () => {
            if (authState && authState?.isAuthenticated) {
                const apiUrl = `${process.env.REACT_APP_API_URL}/messages/search/findMessagesByUserEmail?userEmail=${authState?.accessToken?.claims.sub}&page=${actualPage - 1}&size=${messagesPerPage}`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                        'Content-Type': 'application/json',
                    }
                };
                const data = await fetch(apiUrl, requestOptions);
                if (!data.ok) {
                    throw new Error('Something went wrong while fetching messages!');
                }
                const responseData = await data.json();
                setMessages(responseData._embedded.messages);
                setTotalPages(responseData.page.totalPages);
            }
            setIsLoading(false);
        }
        loadMessages().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message || "Something went wrong while fetching messages!");
        })
        window.scrollTo(0, 0);

    }, [authState, actualPage]);

    if (isLoading) {
        return <BreathingLoader />;
    }

    if (httpError) {
        return (
            <div className="alert alert-danger text-center" role="alert">
                {httpError}
            </div>
        );
    }

    const paginate = (pageNumber: number) => {
        setActualPage(pageNumber);
    }

    return (
        <div className="mt-4">
            {messages.length > 0 ?
                <>
                    <h4 className="text-center mb-4 fw-semibold text-secondary">{t("messages.historyTitle")}</h4>
                    {messages.map(message => (
                        <div key={message.id} className="mb-4">
                            <div className="card shadow-sm border-0">
                                <div className="card-body">
                                    <div className="mb-2"></div>
                                    <h5 className="card-title text-dark">
                                        <span className="text-muted">{t("messages.case")}
                                            <span className="text-muted">({message.id}):</span>
                                        </span>
                                        <span className="text-dark"> {message.subject}</span>
                                    </h5>
                                    <h6 className="card-subtitle text-secondary mb-2">{message.userEmail}</h6>
                                    <p className="card-text">{message.inquiry}</p>
                                    <hr />
                                    <div>
                                        <h6 className="text-success fw-bold mb-2">{t("messages.response")}</h6>
                                        {message.response && message.adminEmail ? (
                                            <>
                                                <p className="mb-1">
                                                    <strong>{t("messages.admin")}:</strong> {message.adminEmail}
                                                </p>
                                                <p>{message.response}</p>
                                            </>
                                        ) : (
                                            <p className="text-muted fst-italic">
                                                {t("messages.noResponse")}
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
                        {t("messages.noMessages")}
                    </div>
                </div>
            }
            {totalPages > 1 && (
                <div className="mt-4">
                    <Pagination
                        currentPage={actualPage}
                        totalPages={totalPages}
                        paginate={paginate}
                    />
                </div>
            )}
        </div >
    );
}