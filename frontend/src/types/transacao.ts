import type { TipoTransacao } from "./enums";

export type CreateTransacaoRequest = {
    descricao: string;
    valor: number;
    tipo: TipoTransacao;
    categoriaId: number;
    pessoaId: number;
};

export type TransacaoResponse = {
    transacaoId: number;
    descricao: string;
    valor: number;
    tipo: TipoTransacao;

    pessoaId: number;
    pessoaNome: string;

    categoriaId: number;
    categoriaDescricao: string;
};
