export function safeLowercase(label: string | undefined) {
    return label?.replace(/(^|[^a-zA-Z0-9])[A-Z][a-z]/g, (match) => match.toLowerCase());
}

export function generateGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}
