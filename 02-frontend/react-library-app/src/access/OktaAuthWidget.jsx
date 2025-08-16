import { useEffect, useRef } from "react";
import OktaSignIn from "@okta/okta-signin-widget";
import '@okta/okta-signin-widget/dist/css/okta-sign-in.min.css';
import { oktaConfig } from "../lib/oktaConfig";


const OktaAuthWidget = ({ onSuccess, onError }) => {
    const widgetRef = useRef();
    const loginStartRef = useRef(null);
    const widgetInstanceRef = useRef(null);

    useEffect(() => {

        if (!widgetRef.current) return;

        console.info("[OktaAuthWidget] Initializing widget at", new Date().toISOString());


        const widget = new OktaSignIn(oktaConfig);

        widgetInstanceRef.current = widget;

        // Attach 'afterRender' listener first
        widget.on("afterRender", () => {
            console.info("[OktaAuthWidget] Widget rendered at", new Date().toISOString());
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
            console.info("[OktaAuthWidget] Cleaning up widget at", new Date().toISOString());
            widget.remove();
        };

    }, [onSuccess, onError]);

    return (
        <div className='container mt-5 mb-5'>
            <div ref={widgetRef} />
        </div>
    );
}

export default OktaAuthWidget;