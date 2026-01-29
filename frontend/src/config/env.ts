function normalizeUrl(url: string) {
    return url.replace(/\/+$/, "");
}

const rawApiUrl = import.meta.env.VITE_API_URL as string | undefined;

export const env = {
    // Fallback facilita rodar o projeto sem configurar .env local
    API_URL: rawApiUrl ? normalizeUrl(rawApiUrl) : "http://localhost:5259",
};

if (!rawApiUrl) {
    console.warn(
        "[env] VITE_API_URL não definido. Usando fallback:",
        env.API_URL,
    );
}
