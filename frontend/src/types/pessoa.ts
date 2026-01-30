export type CreatePessoaRequest = {
    nome: string;
    idade: number;
};

export type PessoaResponse = {
    pessoaId: number;
    nome: string;
    idade: number;
};
