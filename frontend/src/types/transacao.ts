import type { TipoTransacao } from "./enums";

export type Transacao = {
    id: number;
    descricao: string;
    valor: number;
    tipo: TipoTransacao;

    pessoaId: number;
    categoriaId: number;
};

export type TransacaoCreateDTO = {
    descricao: string;
    valor: number;
    tipo: TipoTransacao;
    pessoaId: number;
    categoriaId: number;
};
