import { env } from "../config/env";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export class ApiError extends Error {
    status: number;
    details?: unknown;

    constructor(message: string, status: number, details?: unknown) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.details = details;
    }
}

type RequestOptions = {
    method?: HttpMethod;
    body?: unknown;
    headers?: Record<string, string>;
};

async function parseErrorBody(response: Response) {
    try {
        const data = await response.json();
        const message =
            data?.message ||
            data?.error ||
            data?.title ||
            `Erro HTTP ${response.status}`;
        return { message, data };
    } catch {
        const text = await response.text().catch(() => "");
        return { message: text || `Erro HTTP ${response.status}`, data: text };
    }
}

async function request<T>(
    path: string,
    options: RequestOptions = {},
): Promise<T> {
    if (!env.API_URL) {
        throw new Error(
            "API_URL não definida. Verifique o .env (VITE_API_URL).",
        );
    }

    const url = `${env.API_URL}${path.startsWith("/") ? "" : "/"}${path}`;

    const response = await fetch(url, {
        method: options.method ?? "GET",
        headers: {
            "Content-Type": "application/json",
            ...(options.headers ?? {}),
        },
        body:
            options.body !== undefined
                ? JSON.stringify(options.body)
                : undefined,
    });

    if (!response.ok) {
        const parsed = await parseErrorBody(response);
        throw new ApiError(parsed.message, response.status, parsed.data);
    }

    // 204 = No Content
    if (response.status === 204) return undefined as T;

    const text = await response.text();
    if (!text) return undefined as T;

    return JSON.parse(text) as T;
}

export const httpClient = {
    get: <T>(path: string) => request<T>(path, { method: "GET" }),
    post: <T>(path: string, body: unknown) =>
        request<T>(path, { method: "POST", body }),
    put: <T>(path: string, body: unknown) =>
        request<T>(path, { method: "PUT", body }),
    del: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
