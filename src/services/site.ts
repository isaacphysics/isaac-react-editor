export type SITES = "CS" | "PHY";

function getCurrentSite(): SITES {
    switch(document.location.host) {
        case "localhost:3000": return "CS";
        case "editor.isaacphysics.org": return "PHY";
        case "editor.isaaccomputerscience.org": return "CS";
    }
    return "CS";
}

export const SITE: SITES = getCurrentSite();
