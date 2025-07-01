import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import Message from "../../../models/Message";
import { BreathingLoader } from "../../Widgets/BreathingLoader";
import { Pagination } from "../../Widgets/Pagination";
import { AdminMessage } from "./AdminMessage";
import MessageRequest from "../../../models/MessageRequest";

export const AdminInbox = () => {

    const { authState } = useOktaAuth();

    const [isLoadingInbox, setIsLoadingInbox] = useState(true);
    const [httpError, setHttpError] = useState(null);

    const [inbox, setInbox] = useState<Message[]>([]);
    const [questionsPerPage, setQuestionsPerPage] = useState(5);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const [buttonSubmit, setButtonSubmit] = useState(false);


    useEffect(() => {
        const fetchInbox = async () => {
            if (authState && authState.isAuthenticated) {
                const apiUrl = `http://localhost:8080/api/messages/search/findByClosed?closed=false&page=${currentPage - 1}&size=${questionsPerPage}`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'

                    }
                };
                const response = await fetch(apiUrl, requestOptions);
                if (!response.ok) {
                    throw new Error("Something went wrong!");
                }
                const data = await response.json();

                setInbox(data._embedded.messages);
                setTotalPages(data.page.totalPages);
            }
            setIsLoadingInbox(false);
        }
        fetchInbox().catch((error: any) => {
            setIsLoadingInbox(false);
            setHttpError(error.message || "Something went wrong!");
        })
        window.scrollTo(0, 0);
    }, [authState, currentPage, buttonSubmit]);

    if (isLoadingInbox) {
        return <BreathingLoader />;
    }

    if (httpError) {
        return <p className="text-red-500 text-center">{httpError}</p>;
    }


    async function handleSubmitResponse(id: number, responseText: string) {
        if (!authState || !authState.isAuthenticated || responseText === '' || id == null) {
            return;
        }

        const apiUrl = 'http://localhost:8080/api/messages/secure/admin/message';

        const messageRequestModel: MessageRequest = new MessageRequest(id, responseText);
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(messageRequestModel),
        };

        try {
            const fetchResponse = await fetch(apiUrl, requestOptions);
            if (!fetchResponse.ok) {
                throw new Error('Something went wrong while submitting the response!');
            }
            setButtonSubmit(prev => !prev);
        } catch (error) {
            console.error(error);
            // optionally show a user-friendly error notification here
        }
    }


    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="mt-4">
            {inbox.length > 0 ? (
                <>
                    <h4 className="mb-4 text-dark fw-bold border-bottom pb-2">📩 Pending Questions</h4>

                    <div className="d-flex flex-column gap-4">
                        {inbox.map((message) => (
                            <AdminMessage message={message} key={message.id} handleSubmitResponse={handleSubmitResponse} />
                        ))}
                    </div>
                </>
            ) : (
                <div className="text-center text-muted">
                    <h5>No pending questions at the moment.</h5>
                </div>
            )}

            {totalPages > 1 && (
                <div className="mt-4 d-flex justify-content-center">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        paginate={paginate}
                    />
                </div>
            )}
        </div>
    );

}