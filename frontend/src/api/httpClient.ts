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

type ProblemDetails = {
    title?: string;
    detail?: string;
    message?: string;
    error?: string;
};

//Usei isRecord e getString pois os acessos a title/detail/message/error estavam tendo problemas com o any
function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function tryParseJson(text: string): unknown | null {
    try {
        return JSON.parse(text);
    } catch {
        return null;
    }
}

function getString(
    obj: Record<string, unknown>,
    key: string,
): string | undefined {
    const value = obj[key];
    return typeof value === "string" ? value : undefined;
}

function readProblemDetails(data: unknown): ProblemDetails {
    if (!isRecord(data)) return {};
    return {
        title: getString(data, "title"),
        detail: getString(data, "detail"),
        message: getString(data, "message"),
        error: getString(data, "error"),
    };
}

async function parseErrorBody(response: Response) {
    // Lê o body uma única vez
    const text = await response.text().catch(() => "");

    const data = text ? tryParseJson(text) : null;
    const pd = readProblemDetails(data);

    // Suporte ao padrão ProblemDetails do backend (title/detail)
    const message =
        (pd.title && pd.detail && `${pd.title}: ${pd.detail}`) ||
        pd.title ||
        pd.message ||
        pd.error ||
        text ||
        `Erro HTTP ${response.status}`;

    return { message, data: data ?? text };
}

async function request<T>(
    path: string,
    options: RequestOptions = {},
): Promise<T> {
    const url = `${env.API_URL}${path.startsWith("/") ? "" : "/"}${path}`;

    let response: Response;
    try {
        response = await fetch(url, {
            method: options.method ?? "GET",
            headers: {
                ...(options.body !== undefined
                    ? { "Content-Type": "application/json" }
                    : {}),
                ...(options.headers ?? {}),
            },
            body:
                options.body !== undefined
                    ? JSON.stringify(options.body)
                    : undefined,
        });
    } catch {
        throw new ApiError("Erro ao conectar com a API.", 0);
    }

    if (!response.ok) {
        const parsed = await parseErrorBody(response);
        throw new ApiError(parsed.message, response.status, parsed.data);
    }

    if (response.status === 204) return undefined as T;

    const text = await response.text().catch(() => "");
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
