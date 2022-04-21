import React, { useEffect } from "react";
import { Spinner } from "reactstrap";
import Cookies from "js-cookie";

import { GITHUB_TOKEN_COOKIE } from "./github";

import styles from "../styles/editor.module.css";

export interface Config {
    clientId: string;
    authCode: string;
    OWNER: string;
    REPO: string;
}

const configs: {[host: string]: Config} = {
    "localhost:8421": {
        clientId: "f62f2bd4954bf930bc3f",
        authCode: "/vFaDdbb7id6+cPgsIKTdvwk4lOLBkBpBsXDdBvZsnU0U/PBLxgzxDzmUfE/0OIWWvlxh7SigvVv1JzBffbEc2364W8GPmQt9QeuVW1juAHdvdT7kRrHv8LjEuxJP9ie9+BP3tXNWpVxdg7S3sbZA5ShBFOYxdr3izjn9L+cmzDT9YVKB+Grv8hvLcEFOy7KHeixa29HPY2pqtk6XHFqiwlDP+02AWmY",
        OWNER: "isaacphysics",
        REPO: "isaac-content-2",
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
    return <div className={styles.centered}>
        <Spinner size="large" />
        <br />
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
