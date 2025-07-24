import { useEffect, useRef } from "react";
import OktaSignIn from "@okta/okta-signin-widget";
import '@okta/okta-signin-widget/dist/css/okta-sign-in.min.css';
import { oktaConfig } from "../lib/oktaConfig";


const OktaSigninWidget = ({ onSuccess, onError }) => {
    const widgetRef = useRef();
    const loginStartRef = useRef(null);
    const widgetInstanceRef = useRef(null);

    useEffect(() => {

        if (!widgetRef.current) return;

        const widget = new OktaSignIn(oktaConfig);

        widgetInstanceRef.current = widget;

        // Attach 'afterRender' listener first
        widget.on("afterRender", () => {
            const signInBtn = document.querySelector('input[type="submit"]');

            if (signInBtn) {
                signInBtn.addEventListener("click", () => {
                    window.__loginStartTime = Date.now();
                    console.log("⏱ Sign-in button clicked");
                });
            }
        });

        widget
            .showSignInToGetTokens({
                el: widgetRef.current,
            }).then(onSuccess).catch(onError);

        return () => {
            widget.remove();
        };

    }, [onSuccess, onError]);

    return (
        <div className='container mt-5 mb-5'>
            <div ref={widgetRef} />
        </div>
    );
}

export default OktaSigninWidget;