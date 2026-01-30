//Tive que utilizar const e type porque estava tendo problemas com erasableSyntaxOnly
export const TipoTransacao = {
    Despesa: 1,
    Receita: 2,
} as const;

export type TipoTransacao = (typeof TipoTransacao)[keyof typeof TipoTransacao];

export const FinalidadeCategoria = {
    Despesa: 1,
    Receita: 2,
    DespesaReceita: 3,
} as const;

export type FinalidadeCategoria =
    (typeof FinalidadeCategoria)[keyof typeof FinalidadeCategoria];
