import { httpClient } from "./httpClient";
import type {
    CreateTransacaoRequest,
    TransacaoResponse,
} from "../types/transacao";
import type { TipoTransacao } from "../types/enums";

const base = "/api/transacoes";

type TransacaoWire = {
    transacaoId?: number;
    TransacaoId?: number;

    descricao?: string;
    Descricao?: string;

    valor?: number;
    Valor?: number;

    tipo?: TipoTransacao;
    Tipo?: TipoTransacao;

    pessoaId?: number;
    PessoaId?: number;

    pessoaNome?: string;
    PessoaNome?: string;

    categoriaId?: number;
    CategoriaId?: number;

    categoriaDescricao?: string;
    CategoriaDescricao?: string;
};

function normalizeTransacao(w: TransacaoWire): TransacaoResponse {
    const transacaoId = w.transacaoId ?? w.TransacaoId;
    const descricao = w.descricao ?? w.Descricao;
    const valor = w.valor ?? w.Valor;
    const tipo = w.tipo ?? w.Tipo;

    const pessoaId = w.pessoaId ?? w.PessoaId;
    const pessoaNome = w.pessoaNome ?? w.PessoaNome;

    const categoriaId = w.categoriaId ?? w.CategoriaId;
    const categoriaDescricao = w.categoriaDescricao ?? w.CategoriaDescricao;

    if (
        typeof transacaoId !== "number" ||
        typeof descricao !== "string" ||
        typeof valor !== "number" ||
        typeof tipo !== "number" ||
        typeof pessoaId !== "number" ||
        typeof pessoaNome !== "string" ||
        typeof categoriaId !== "number" ||
        typeof categoriaDescricao !== "string"
    ) {
        throw new Error("Resposta inválida da API (Transação).");
    }

    return {
        transacaoId,
        descricao,
        valor,
        tipo,
        pessoaId,
        pessoaNome,
        categoriaId,
        categoriaDescricao,
    };
}

export const transacoesApi = {
    async list(): Promise<TransacaoResponse[]> {
        const data = await httpClient.get<TransacaoWire[]>(base);
        return data.map(normalizeTransacao);
    },

    async create(body: CreateTransacaoRequest): Promise<TransacaoResponse> {
        const data = await httpClient.post<TransacaoWire>(base, body);
        return normalizeTransacao(data);
    },
};
