import Cookies from "js-cookie";
import { Config, doAuth, getConfig } from "./auth";

export const GITHUB_TOKEN_COOKIE = "github-token";

export const fetcher = async (path: string, options?: RequestInit) => {
    const config = getConfig();
    const fullPath = "https://api.github.com/" + path.replace(/\$([A-Z_]+)/g, (_, match) => {
        return config[match as keyof Config];
    });
    const result = await fetch(fullPath, {
        ...options,
        headers: {
            ...options?.headers,
            authorization: `token ${Cookies.get(GITHUB_TOKEN_COOKIE)}`,
        },
    });
    return result.json();
};

export async function processCode(code: string | null) {
    if (code) {
        // Exchange the code for a token, put that in a cookie
        const result = await doAuth(code);
        Cookies.set(GITHUB_TOKEN_COOKIE, result.access_token, {
            expires: 7,
            sameSite: "strict",
        });

        const dest = new URL(window.location.href);
        if (dest.pathname === "" || dest.pathname === "/") {
            dest.pathname = "edit/master";
        }
        // Either way, take code out of query string
        dest.searchParams.delete("code");
        window.location.replace(dest);
    }
}

export interface User {
    login: string;
}

export const defaultGithubContext = {
    branch: "master",
    user: new Promise<User>((resolve) => resolve({login: "invalid-user" as string})),
};
