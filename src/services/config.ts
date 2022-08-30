import {siteSpecific} from "./site";

export interface Config {
    clientId: string;
    authCode: string;
    OWNER: string;
    REPO: string;
    APP_REPO: string;
    previewServer: string;
}

const configs: { [host: string]: Config } = {
    "localhost:8421": siteSpecific({
        clientId: "f62f2bd4954bf930bc3f",
        authCode: "/vFaDdbb7id6+cPgsIKTdvwk4lOLBkBpBsXDdBvZsnU0U/PBLxgzxDzmUfE/0OIWWvlxh7SigvVv1JzBffbEc2364W8GPmQt9QeuVW1juAHdvdT7kRrHv8LjEuxJP9ie9+BP3tXNWpVxdg7S3sbZA5ShBFOYxdr3izjn9L+cmzDT9YVKB+Grv8hvLcEFOy7KHeixa29HPY2pqtk6XHFqiwlDP+02AWmY",
        OWNER: "isaacphysics",
        REPO: "rutherford-content",
        APP_REPO: "isaac-react-app",
        previewServer: "http://localhost:3002",
    }, {
        clientId: "f62f2bd4954bf930bc3f",
        authCode: "/vFaDdbb7id6+cPgsIKTdvwk4lOLBkBpBsXDdBvZsnU0U/PBLxgzxDzmUfE/0OIWWvlxh7SigvVv1JzBffbEc2364W8GPmQt9QeuVW1juAHdvdT7kRrHv8LjEuxJP9ie9+BP3tXNWpVxdg7S3sbZA5ShBFOYxdr3izjn9L+cmzDT9YVKB+Grv8hvLcEFOy7KHeixa29HPY2pqtk6XHFqiwlDP+02AWmY",
        OWNER: "isaacphysics",
        REPO: "isaac-content-2",
        APP_REPO: "isaac-react-app",
        previewServer: "http://localhost:3001",
    }),
    "editor.isaacphysics.org": {
        clientId : "012d68f7ffd3a99110ff",
        authCode : "j4GsAFDYXaxqwN146vTeQ4vbV7ucQtGC8B4AI7EVQPIUTQG/nz9Yfgm1o3d0FLrDlgGyig2YyxA8IMS1wVF+mZ7rCMzOZUXGIn48gDxFGzsWZKhK36kwra5PE3C6mCeRQjXx6cCyl9VRH1VR+RsjIXM6vIdD0g1JqcupsKDNmojZAcuMkPreJfl2h+bbss1DGw3CdvNLF8lwd895OTNwZfGjQxcmywIS3VIC7o6JIq3fcw==",
        OWNER: "isaacphysics",
        REPO: "rutherford-content",
        APP_REPO: "isaac-react-app",
        previewServer: "https://editor-preview.isaacphysics.org",
    },
    "editor.isaaccomputerscience.org": {
        clientId : "f929345390ca5ca6e1ba",
        authCode : "WD4uGrm2iTFxmvwHjybnCSzIpgFk3r//7twVti62RpnQWyFteaKK11q6wLBQX6bb/yy9NY9t0m79MxokXUVZpRNzczPvBAkW6WGfmdCUa5tNs3UMswWmpITiv/TiGHJKxDRZ9m2KYgly3jqLzEU1EY7KznCCa16x7MLzdcQzyYKYS49RB3V/+B7IsuyDPQLRVffRTe/2MkrZmx98kj9x14eMgteIRQ7aYhi1pDsYE1dVGOMyojgoPsf6",
        OWNER: "isaacphysics",
        REPO: "isaac-content-2",
        APP_REPO: "isaac-react-app",
        previewServer: "https://editor-preview.isaaccomputerscience.org",
    },
};

export function getConfig() {
    return configs[window.location.host];
}
