export const normalizeUrl = (url: string): string => {
    if (!url) return "";

    const trimmed = url.trim();

    if (trimmed && !trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
        return `https://${trimmed}`;
    }

    return trimmed;
};