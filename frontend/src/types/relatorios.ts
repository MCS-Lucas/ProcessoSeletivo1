export type TotalPorPessoaItemResponse = {
    pessoaId: number;
    nome: string;
    totalReceitas: number;
    totalDespesas: number;
    saldoLiquido: number;
};

export type TotaisPorPessoaResponse = {
    itens: TotalPorPessoaItemResponse[];
    totalReceitasGeral: number;
    totalDespesasGeral: number;
    saldoLiquidoGeral: number;
};

export type TotalPorCategoriaItemResponse = {
    categoriaId: number;
    descricao: string;
    totalReceitas: number;
    totalDespesas: number;
    saldoLiquido: number;
};

export type TotaisPorCategoriaResponse = {
    itens: TotalPorCategoriaItemResponse[];
    totalReceitasGeral: number;
    totalDespesasGeral: number;
    saldoLiquidoGeral: number;
};
