export type SITES = "CS" | "PHY";

const DEFAULT_DEV_SITE: SITES = "PHY";

function getCurrentSite(): SITES {
    switch(document.location.host) {
        case "localhost:3000":
        case "localhost:8421":
            return DEFAULT_DEV_SITE;
        case "editor.isaacphysics.org": return "PHY";
        case "editor.isaaccomputerscience.org": return "CS";
    }
    return DEFAULT_DEV_SITE;
}

export const SITE: SITES = getCurrentSite();

export const isPhy = SITE === "PHY";
export const isCS = SITE === "CS";

export function siteSpecific<P, C>(phy: P, cs: C) {
    return isPhy ? phy : cs;
}
