import { Redirect } from "react-router-dom";
import { useOktaAuth } from "@okta/okta-react";
import { BreathingLoader } from "../components/Widgets/BreathingLoader";
import OktaAuthWidget from "./OktaAuthWidget";

const OktaLoginWidget = ({ config }) => {
    const { oktaAuth, authState } = useOktaAuth();
    const onSuccess = (tokens) => {
        const loginEndTime = Date.now();

        if (window.__loginStartTime) {
            const duration = loginEndTime - window.__loginStartTime;
            console.log(`✅ Login response time: ${duration} ms`);
            if (tokens.accessToken) {
                console.log(`Access token expires at: ${new Date(tokens.accessToken.expiresAt * 1000)}`);
            }
        } else {
            console.warn("⚠️ Login start time not captured.");
        }

        console.info("Handling Okta login redirect now...");
        oktaAuth.handleLoginRedirect(tokens);
    };

    const onError = (err) => {
        console.error("Login error: ", err);
    };

    if (!authState) {
        console.debug("Auth state is undefined, showing loader.");
        return <BreathingLoader />;
    }

    console.debug("Auth state loaded: ", authState);

    return authState.isAuthenticated ?
        <Redirect to={{ pathname: "/" }} />
        :
        <OktaAuthWidget config={config} onSuccess={onSuccess} onError={onError} />;
};

export default OktaLoginWidget;