import { httpClient } from "./httpClient";
import type {
    TotaisPorPessoaResponse,
    TotaisPorCategoriaResponse,
} from "../types/relatorios";

type TotaisPorPessoaWire = Partial<Record<string, unknown>>;
type TotaisPorCategoriaWire = Partial<Record<string, unknown>>;

function asNumber(v: unknown): number {
    if (typeof v === "number") return v;
    if (typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v)))
        return Number(v);
    return 0;
}

function asString(v: unknown): string {
    return typeof v === "string" ? v : "";
}

function normalizeTotaisPorPessoa(
    w: TotaisPorPessoaWire,
): TotaisPorPessoaResponse {
    const itensRaw = (w.itens ?? w.Itens) as unknown;

    const itensArray = Array.isArray(itensRaw) ? itensRaw : [];

    const itens = itensArray.map((x) => {
        const obj = (x ?? {}) as Record<string, unknown>;
        const pessoaId = asNumber(obj.pessoaId ?? obj.PessoaId);
        const nome = asString(obj.nome ?? obj.Nome);
        const totalReceitas = asNumber(obj.totalReceitas ?? obj.TotalReceitas);
        const totalDespesas = asNumber(obj.totalDespesas ?? obj.TotalDespesas);
        const saldoLiquido = asNumber(obj.saldoLiquido ?? obj.SaldoLiquido);

        return { pessoaId, nome, totalReceitas, totalDespesas, saldoLiquido };
    });

    const totalReceitasGeral = asNumber(
        w.totalReceitasGeral ?? w.TotalReceitasGeral,
    );
    const totalDespesasGeral = asNumber(
        w.totalDespesasGeral ?? w.TotalDespesasGeral,
    );
    const saldoLiquidoGeral = asNumber(
        w.saldoLiquidoGeral ?? w.SaldoLiquidoGeral,
    );

    return { itens, totalReceitasGeral, totalDespesasGeral, saldoLiquidoGeral };
}

function normalizeTotaisPorCategoria(
    w: TotaisPorCategoriaWire,
): TotaisPorCategoriaResponse {
    const itensRaw = (w.itens ?? w.Itens) as unknown;

    const itensArray = Array.isArray(itensRaw) ? itensRaw : [];

    const itens = itensArray.map((x) => {
        const obj = (x ?? {}) as Record<string, unknown>;
        const categoriaId = asNumber(obj.categoriaId ?? obj.CategoriaId);
        const descricao = asString(obj.descricao ?? obj.Descricao);
        const totalReceitas = asNumber(obj.totalReceitas ?? obj.TotalReceitas);
        const totalDespesas = asNumber(obj.totalDespesas ?? obj.TotalDespesas);
        const saldoLiquido = asNumber(obj.saldoLiquido ?? obj.SaldoLiquido);

        return {
            categoriaId,
            descricao,
            totalReceitas,
            totalDespesas,
            saldoLiquido,
        };
    });

    const totalReceitasGeral = asNumber(
        w.totalReceitasGeral ?? w.TotalReceitasGeral,
    );
    const totalDespesasGeral = asNumber(
        w.totalDespesasGeral ?? w.TotalDespesasGeral,
    );
    const saldoLiquidoGeral = asNumber(
        w.saldoLiquidoGeral ?? w.SaldoLiquidoGeral,
    );

    return { itens, totalReceitasGeral, totalDespesasGeral, saldoLiquidoGeral };
}

export const relatoriosApi = {
    async totaisPorPessoa(): Promise<TotaisPorPessoaResponse> {
        const data = await httpClient.get<TotaisPorPessoaWire>(
            "/api/relatorios/pessoas",
        );
        return normalizeTotaisPorPessoa(data);
    },

    async totaisPorCategoria(): Promise<TotaisPorCategoriaResponse> {
        const data = await httpClient.get<TotaisPorCategoriaWire>(
            "/api/relatorios/categorias",
        );
        return normalizeTotaisPorCategoria(data);
    },
};
