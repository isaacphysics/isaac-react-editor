export interface Config {
    clientId: string;
    authCode: string;
    OWNER: string;
    REPO: string;
    previewServer: string;
}

const configs: { [host: string]: Config } = {
    "localhost:8421": {
        clientId: "f62f2bd4954bf930bc3f",
        authCode: "/vFaDdbb7id6+cPgsIKTdvwk4lOLBkBpBsXDdBvZsnU0U/PBLxgzxDzmUfE/0OIWWvlxh7SigvVv1JzBffbEc2364W8GPmQt9QeuVW1juAHdvdT7kRrHv8LjEuxJP9ie9+BP3tXNWpVxdg7S3sbZA5ShBFOYxdr3izjn9L+cmzDT9YVKB+Grv8hvLcEFOy7KHeixa29HPY2pqtk6XHFqiwlDP+02AWmY",
        OWNER: "isaacphysics",
        REPO: "isaac-content-2",
        previewServer: "http://localhost:3001",
    },
};

export function getConfig() {
    return configs[window.location.host];
}
