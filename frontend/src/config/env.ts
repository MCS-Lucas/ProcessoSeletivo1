function normalizeUrl(url: string) {
    return url.replace(/\/+$/, "");
}

const rawApiUrl = import.meta.env.VITE_API_URL as string | undefined;

export const env = {
    API_URL: rawApiUrl ? normalizeUrl(rawApiUrl) : "http://localhost:5259",
};

// Ajuda no debug
if (!rawApiUrl) {
    console.warn(
        "[env] VITE_API_URL não definido. Usando fallback:",
        env.API_URL,
    );
}
