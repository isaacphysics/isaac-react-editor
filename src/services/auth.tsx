import React, { useEffect } from "react";
import { Spinner } from "reactstrap";
import Cookies from "js-cookie";

import { GITHUB_TOKEN_COOKIE } from "./github";

export interface Config {
    clientId: string;
    authCode: string;
    OWNER: string;
    REPO: string;
}

const configs: {[host: string]: Config} = {
    "localhost:3000": {
        clientId: "dedb469b757ebafa9ba2",
        authCode: "S2b8x//dzuTJa1/uLCR6p7hzCNia6+IM0rMSWsovT7CtsUQJKIzAcpjpY2FU2gsT0LL5EQWek5L7u0Lzx6FGp2Chxo88tj43MnCUKrXchbujhp+Bv/ctuAQk/wQeydH8qXzVmkiRTHpVl1FBBqN+wX0K0qNf4Y6r0e+2XAly+aGSz8O8vhAHJDJy91weCPMAlXexuCGD9kmMPtNAzTPM6cuKyr5lEZ6Z",
        OWNER: "lambdacambridge",
        REPO: "isaac-cs-editor",
    },
};

export function getConfig() {
    return configs[window.location.host];
}

export function authorizationURL() {
    const config = getConfig();

    return `https://gitHub.com/login/oauth/authorize?scope=repo&client_id=${config.clientId}&redirect_uri=${encodeURIComponent(document.location.href)}`;
}

export async function doAuth(github_code: string) {
    const config = getConfig();

    const url = `https://editor-auth.isaacphysics.org/_/api/authenticate?auth_code=${
        // The OAuth proxy expects this format; it doesn't work with the format URLSearchParams produces
        encodeURIComponent(config.authCode)
    }&${
        new URLSearchParams({
            client_id: config.clientId,
            github_code
        })
    }`;
    const result = await fetch(url);

    return result.json();
}

export function LoginPrompt() {
    return <div>
        You are not logged in. <a href={authorizationURL()}>Click here to log in.</a>
    </div>;
}

export function LoadingScreen({message = "Logging in..."}: { message?: string }) {
    return <div style={{display: "flex", alignContent: "center", alignItems: "center"}}>
        <Spinner size="large"/>
        <h4>{message}</h4>
    </div>;
}

export function Logout() {
    useEffect(() => {
        Cookies.remove(GITHUB_TOKEN_COOKIE);
        window.location.replace("/");
    });
    return <LoadingScreen message="Logging out..."/>;
}

export function isLoggedIn() {
    return Cookies.get(GITHUB_TOKEN_COOKIE) !== undefined;
}
