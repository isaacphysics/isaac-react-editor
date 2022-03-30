export function safeLowercase(label: string | undefined) {
    return label?.replace(/(^|[^a-zA-Z0-9])[A-Z][a-z]/g, (match) => match.toLowerCase());
}
