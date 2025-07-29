import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import { BreathingLoader } from "../Widgets/BreathingLoader";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Link } from "react-router-dom";
import PaymentDetailsRequest from "../../models/PaymentDetailsRequest";

export const PaymentDashboard = () => {

    const { authState } = useOktaAuth();
    const [httpError, setHttpError] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [submitDisactivated, setSubmitDisactivated] = useState(false);
    const [charges, setCharges] = useState(0);
    const [loadingCharges, setLoadingCharges] = useState(true);

    useEffect(() => {
        const fetchCharges = async () => {
            if (authState && authState.isAuthenticated) {
                const apiUrl = `${process.env.REACT_APP_API_URL}/payments/search/findByUserEmail?userEmail=${authState.accessToken?.claims.sub}`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
                const response = await fetch(apiUrl, requestOptions);
                if (!response.ok) {
                    throw new Error('Failed to fetch payment data');
                }
                const data = await response.json();
                setCharges(data.amount);
                setLoadingCharges(false);
            }
        }
        fetchCharges().catch((error: any) => {
            setLoadingCharges(false);
            setHttpError(error.message);
        });
    }, [authState]);

    const elements = useElements();
    const stripe = useStripe();

    async function handlePayment() {
        if (!stripe || !elements || !elements.getElement(CardElement)) {
            return;
        }

        setSubmitDisactivated(true);

        let paymentDetails = new PaymentDetailsRequest(Math.round(charges * 100), 'USD', authState?.accessToken?.claims.sub);

        const apiUrl = `${process.env.REACT_APP_API_URL}/payments/secure/intent`;
        const requestOptions = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentDetails)
        };
        const response = await fetch(apiUrl, requestOptions);
        if (!response.ok) {
            setHttpError(true);
            setSubmitDisactivated(false);
            throw new Error('Failed to create payment intent');
        }
        const data = await response.json();

        stripe.confirmCardPayment(
            data.client_secret, {
            payment_method: {
                card: elements.getElement(CardElement)!,
                billing_details: {
                    email: authState?.accessToken?.claims.sub,
                }
            }
        }, { handleActions: false }
        ).then(async function (outcome: any) {
            if (outcome.error) {
                setSubmitDisactivated(false);
                alert('Payment failed: ' + outcome.error.message);
            } else {
                const paymentApiUrl = `${process.env.REACT_APP_API_URL}/payments/secure/execute`;
                const paymentRequestOptions = {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                        'Content-Type': 'application/json',
                    }
                };
                const paymentResponse = await fetch(paymentApiUrl, paymentRequestOptions);
                if (!paymentResponse.ok) {
                    setHttpError(true);
                    setSubmitDisactivated(false);
                    throw new Error('Failed to execute payment');
                }
                setCharges(0);
                setShowSuccessToast(true);
                setTimeout(() => {
                    setShowSuccessToast(false);
                }, 3000);
                setSubmitDisactivated(false);
            }
        });
        setHttpError(false);
    }

    if (loadingCharges) {
        return <BreathingLoader />;
    }

    if (httpError) {
        return (
            <div className='container mt-5'>
                <p>{httpError}</p>
            </div>
        );
    }

    return (
        <>
            {showSuccessToast && (
                <div className="position-fixed top-0 start-50 translate-middle-x mt-4 z-3">
                    <div className="toast show align-items-center text-white bg-success border-0 shadow" role="alert">
                        <div className="d-flex">
                            <div className="toast-body fw-semibold px-3">
                                ✅ Payment completed successfully!
                            </div>
                            <button
                                type="button"
                                className="btn-close btn-close-white me-2 m-auto"
                                aria-label="Close"
                                onClick={() => setShowSuccessToast(false)}
                            ></button>
                        </div>
                    </div>
                </div>
            )}
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        {charges > 0 ? (
                            <div className="shadow rounded bg-light p-4">
                                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                                    <h4 className="fw-bold text-primary m-0">Pending Payment</h4>
                                    <span className="badge bg-danger fs-6">${charges}</span>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="card-element" className="form-label fw-semibold">
                                        Enter Credit Card Details
                                    </label>
                                    <div className="border rounded px-3 py-2 bg-white">
                                        <CardElement id="card-element" />
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-primary w-100 mt-3"
                                    disabled={submitDisactivated}
                                    onClick={handlePayment}
                                >
                                    Submit Payment
                                </button>
                            </div>
                        ) : (

                            <div className="text-center shadow rounded bg-light bg-opacity-10 p-5">
                                <h4 className="fw-bold text-success mb-3">No Payment Pending 🎉</h4>
                                <Link to="search" className="btn btn-outline-success px-4 py-2">
                                    Go to Library
                                </Link>
                            </div>
                        )}
                        {submitDisactivated && (
                            <div className="text-center mt-4">
                                <BreathingLoader />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}