import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import { BreathingLoader } from "../Widgets/BreathingLoader";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Link } from "react-router-dom";
import PaymentDetailsRequest from "../../models/PaymentDetailsRequest";
import { useTranslation } from "react-i18next";
import PaymentHistory from "../../models/PaymentHistory";


export const PaymentDashboard = () => {

    // Hooks
    const { authState } = useOktaAuth();
    const { t } = useTranslation();

    // UI / interaction states
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [submitDisactivated, setSubmitDisactivated] = useState(false);

    // Data states
    const [charges, setCharges] = useState(0);

    // Status / error states
    const [loadingCharges, setLoadingCharges] = useState(true);
    const [httpError, setHttpError] = useState(false);

    // Payment history states
    const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
    const [loadingPaymentHistory, setLoadingPaymentHistory] = useState(true);
    const [paymentHistoryError, setPaymentHistoryError] = useState<string | null>(null);


    useEffect(() => {
        const loadCharges = async () => {
            if (authState && authState.isAuthenticated) {
                const apiUrl = `${process.env.REACT_APP_API_URL}/payments/search/findPaymentsByUserEmail?userEmail=${authState.accessToken?.claims.sub}`;
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
        loadCharges().catch((error: any) => {
            setLoadingCharges(false);
            setHttpError(error.message);
        });
    }, [authState]);

    useEffect(() => {
        const fetchPaymentHistory = async () => {
            if (!(authState && authState.isAuthenticated)) {
                setLoadingPaymentHistory(false);
                return;
            }

            try {
                const email = String(authState.accessToken?.claims.sub || "");
                const base = `${process.env.REACT_APP_API_URL}/paymentHistories/search/findByUserEmail`;

                // no pagination params, just sort by date descending
                const url = `${base}?userEmail=${encodeURIComponent(email)}&sort=paymentDate,desc`;

                const res = await fetch(url, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                if (!res.ok) throw new Error("Failed to fetch payment history");

                const data = await res.json();
                const items: PaymentHistory[] = data?._embedded?.paymentHistories ?? [];

                setPaymentHistory(items);
                setPaymentHistoryError(null);
            } catch (err: any) {
                setPaymentHistoryError(err?.message || "Unable to load payment history");
            } finally {
                setLoadingPaymentHistory(false);
            }
        };

        fetchPaymentHistory();
    }, [authState]);

    const stripe = useStripe();
    const elements = useElements();

    async function handlePayment() {
        const cardElement = elements?.getElement(CardElement);

        if (!stripe || !elements || !cardElement) {
            console.warn("Stripe, elements, or card element not ready.");
            return;
        }

        setSubmitDisactivated(true);
        setHttpError(false);

        try {
            const userEmail = authState?.accessToken?.claims.sub;
            const amountInCents = Math.round(charges * 100);
            const currency = "EUR";

            const paymentDetails = new PaymentDetailsRequest(amountInCents, currency, userEmail);

            // Create payment intent
            const intentResponse = await fetch(
                `${process.env.REACT_APP_API_URL}/payments/secure/intent`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(paymentDetails),
                }
            );

            if (!intentResponse.ok) {
                setHttpError(true);
                throw new Error("Failed to create payment intent");
            }

            const { client_secret } = await intentResponse.json();

            // Confirm payment
            const outcome = await stripe.confirmCardPayment(client_secret, {
                payment_method: {
                    card: cardElement,
                    billing_details: { email: userEmail },
                },
            }, { handleActions: false });

            if (outcome.error) {
                alert("Payment failed: " + outcome.error.message);
                return;
            }

            // Execute payment
            const executeResponse = await fetch(
                `${process.env.REACT_APP_API_URL}/payments/secure/execute`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!executeResponse.ok) {
                setHttpError(true);
                throw new Error("Failed to execute payment");
            }

            // Reset state
            setCharges(0);
            setShowSuccessToast(true);
            setTimeout(() => setShowSuccessToast(false), 3000);

        } catch (error: any) {
            console.error(error);
            setHttpError(true);
        } finally {
            setSubmitDisactivated(false);
        }
    }


    if (loadingCharges) {
        return <BreathingLoader />;
    }

    if (httpError) {
        return (
            <div className='alert alert-danger text-center mt-5'>
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
                                ✅ {t('payment.success_toast')}
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
                        {/* Payment section */}
                        {charges > 0 ? (
                            <div className="shadow rounded bg-light p-4 mb-5">
                                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                                    <h4 className="fw-bold text-primary m-0">{t('payment.pending_payment')}</h4>
                                    <span className="badge bg-danger fs-6">€{charges}</span>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="card-element" className="form-label fw-semibold">
                                        {t('payment.card_details')}
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
                                    {t('payment.submit_payment')}
                                </button>
                            </div>
                        ) : (
                            <div className="text-center shadow rounded bg-light bg-opacity-10 p-5 mb-5">
                                <h4 className="fw-bold text-success mb-3">{t('payment.no_payment')} 🎉</h4>
                                <Link to="search" className="btn btn-outline-success px-4 py-2">
                                    {t('payment.go_to_library')}
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

                {/* Payment history table section (new row) */}
                <div className="row justify-content-center">
                    <div className="col-12"> {/* Full width table */}
                        <hr className="my-5 border border-secondary" />
                        <h5 className="fw-bold mb-3">{t('paymenthistory.history')}</h5>

                        {loadingPaymentHistory ? (
                            <BreathingLoader />
                        ) : paymentHistoryError ? (
                            <div className="alert alert-danger">{paymentHistoryError}</div>
                        ) : paymentHistory.length === 0 ? (
                            <p className="text-muted">{t('paymenthistory.no_history')}</p>
                        ) : (
                            <div className="table-responsive">
                                <table
                                    className="table align-middle shadow-sm rounded overflow-hidden"
                                    style={{ tableLayout: "auto", width: "100%" }}
                                >
                                    <thead style={{ backgroundColor: "#c17078ff", color: "white" }}>
                                        <tr>
                                            <th style={{ minWidth: "200px", padding: "12px 20px" }}>
                                                {t('paymenthistory.invoice_ref')}
                                            </th>
                                            <th style={{ minWidth: "180px", padding: "12px 20px" }}>
                                                {t('paymenthistory.date')}
                                            </th>
                                            <th style={{ minWidth: "120px", padding: "12px 20px" }}>
                                                {t('paymenthistory.amount')}
                                            </th>
                                            <th style={{ minWidth: "150px", padding: "12px 20px" }}>
                                                {t('paymenthistory.method')}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody style={{ backgroundColor: "white" }}>
                                        {paymentHistory.map((payment) => (
                                            <tr key={payment.id}>
                                                <td className="fw-semibold text-gray">{payment.invoiceReference}</td>
                                                <td>
                                                    {new Date(payment.paymentDate).toLocaleDateString(undefined, {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </td>
                                                <td className="fw-bold text-success">€{payment.amount?.toFixed(2)}</td>
                                                <td>{payment.methodType}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </>
    );

}