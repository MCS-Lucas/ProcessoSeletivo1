import { httpClient } from "./httpClient";
import type { CreatePessoaRequest, PessoaResponse } from "../types/pessoa";

type PessoaWire = {
    pessoaId?: number;
    PessoaId?: number;
    nome?: string;
    Nome?: string;
    idade?: number;
    Idade?: number;
};

function normalizePessoa(w: PessoaWire): PessoaResponse {
    const pessoaId = w.pessoaId ?? w.PessoaId;
    const nome = w.nome ?? w.Nome;
    const idade = w.idade ?? w.Idade;

    if (
        typeof pessoaId !== "number" ||
        typeof nome !== "string" ||
        typeof idade !== "number"
    ) {
        throw new Error("Resposta inválida da API (Pessoa).");
    }

    return { pessoaId, nome, idade };
}

export const pessoasApi = {
    async list(): Promise<PessoaResponse[]> {
        // Normaliza camelCase/PascalCase para evitar retrabalho no backend
        const data = await httpClient.get<PessoaWire[]>("/api/pessoas");
        return data.map(normalizePessoa);
    },

    async create(body: CreatePessoaRequest): Promise<PessoaResponse> {
        const data = await httpClient.post<PessoaWire>("/api/pessoas", body);
        return normalizePessoa(data);
    },

    async remove(id: number): Promise<void> {
        await httpClient.del<void>(`/api/pessoas/${id}`);
    },
};
