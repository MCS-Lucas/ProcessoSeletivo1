import { httpClient } from "./httpClient";
import type {
    CreateCategoriaRequest,
    CategoriaResponse,
} from "../types/categoria";
import type { FinalidadeCategoria } from "../types/enums";

type CategoriaWire = {
    categoriaId?: number;
    CategoriaId?: number;
    descricao?: string;
    Descricao?: string;
    finalidade?: FinalidadeCategoria;
    Finalidade?: FinalidadeCategoria;
};

function normalizeCategoria(w: CategoriaWire): CategoriaResponse {
    const categoriaId = w.categoriaId ?? w.CategoriaId;
    const descricao = w.descricao ?? w.Descricao;
    const finalidade = w.finalidade ?? w.Finalidade;

    if (
        typeof categoriaId !== "number" ||
        typeof descricao !== "string" ||
        typeof finalidade !== "number"
    ) {
        throw new Error("Resposta inválida da API (Categoria).");
    }

    return { categoriaId, descricao, finalidade };
}

export const categoriasApi = {
    async list(): Promise<CategoriaResponse[]> {
        const data = await httpClient.get<CategoriaWire[]>("/api/categoria");
        return data.map(normalizeCategoria);
    },

    async create(body: CreateCategoriaRequest): Promise<CategoriaResponse> {
        const data = await httpClient.post<CategoriaWire>(
            "/api/categoria",
            body,
        );
        return normalizeCategoria(data);
    },
};
