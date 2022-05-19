import { SITE } from "./site";

export const StagingServer = {
    "PHY": "https://staging.isaacphysics.org",
    "CS": "https://staging.isaaccomputerscience.org",
}[SITE];

const LiveServer = {
    "PHY": "https://isaacphysics.org",
    "CS": "https://isaaccomputerscience.org",
}[SITE];

function makeFetcher(server: string) {
    return async function apiFetcher(path: string, options?: RequestInit) {
        const fullPath = `${server}/api/any/api/${path}`;

        const fullOptions: RequestInit = {
            ...options,
            mode: "cors",
        };
        const result = await fetch(fullPath, fullOptions);
        if (result.ok) {
            return result.json();
        } else {
            throw await result.json();
        }
    };
}

export const stagingFetcher = makeFetcher(StagingServer);
export const liveFetcher = makeFetcher(LiveServer);
