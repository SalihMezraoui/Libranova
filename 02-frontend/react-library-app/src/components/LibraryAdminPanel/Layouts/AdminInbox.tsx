import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import Message from "../../../models/Message";
import { BreathingLoader } from "../../Widgets/BreathingLoader";
import { Pagination } from "../../Widgets/Pagination";
import { AdminMessages } from "./AdminMessages";
import MessageRequest from "../../../models/MessageRequest";
import { useTranslation } from "react-i18next";

export const AdminInbox = () => {

    // Auth & Translation hooks
    const { authState } = useOktaAuth();
    const { t } = useTranslation();

    // Loading & error states
    const [isLoadingInbox, setIsLoadingInbox] = useState(true);
    const [httpError, setHttpError] = useState(null);

    // Data states
    const [inbox, setInbox] = useState<Message[]>([]);

    // Pagination states

    const [questionsPerPage, setQuestionsPerPage] = useState(5);
    const [actualPage, setActualPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    // Button state to trigger re-fetching of inbox
    const [buttonSubmit, setButtonSubmit] = useState(false);


    useEffect(() => {
        const fetchInbox = async () => {
            if (authState && authState.isAuthenticated) {
                const apiUrl = `${process.env.REACT_APP_API_URL}/messages/search/findByAnswered?answered=false&page=${actualPage - 1}&size=${questionsPerPage}`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'

                    }
                };
                const response = await fetch(apiUrl, requestOptions);
                if (!response.ok) {
                    throw new Error("Something went wrong while fetching the messages!");
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
    }, [authState, actualPage, buttonSubmit]);

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

        const apiUrl = `${process.env.REACT_APP_API_URL}/messages/secure/admin/answer/message`;

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
        }
    }


    const paginate = (pageNumber: number) => {
        setActualPage(pageNumber);
    };

    return (
        <div className="mt-4">
            {inbox.length > 0 ? (
                <>
                    <h4 className="mb-4 text-dark fw-bold border-bottom pb-2">📩 {t("adminInbox.pendingQuestions")}</h4>

                    <div className="d-flex flex-column gap-4">
                        {inbox.map((message) => (
                            <AdminMessages message={message} key={message.id} handleSubmitResponse={handleSubmitResponse} />
                        ))}
                    </div>
                </>
            ) : (
                <div className="alert alert-secondary text-center" role="alert">
                    <h5>{t("adminInbox.noPendingQuestions")}</h5>
                </div>
            )}

            {totalPages > 1 && (
                <div className="mt-4 d-flex justify-content-center">
                    <Pagination
                        currentPage={actualPage}
                        totalPages={totalPages}
                        paginate={paginate}
                    />
                </div>
            )}
        </div>
    );

}