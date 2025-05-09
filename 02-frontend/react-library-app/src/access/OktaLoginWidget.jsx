import { Redirect } from "react-router-dom";
import { useOktaAuth } from "@okta/okta-react";
import { BreathingLoader } from "../components/Widgets/BreathingLoader";
import OktaSigninWidget from "./OktaSigninWidget";

const OktaLoginWidget = ({ config }) => {
    const { oktaAuth, authState } = useOktaAuth();
    const onSuccess = (tokens) => {
        oktaAuth.handleLoginRedirect(tokens);
    };

    const onError = (err) => {
        console.error("Login error: ", err);
    };

    if (!authState) {
        return <BreathingLoader />;
    }

    return authState.isAuthenticated ? 
        <Redirect to={{ pathname: "/" }} />
        : 
        <OktaSigninWidget config={config} onSuccess={onSuccess} onError={onError} />;
};

export default OktaLoginWidget;