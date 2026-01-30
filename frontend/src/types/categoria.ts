import type { FinalidadeCategoria } from "./enums";

export type CreateCategoriaRequest = {
    descricao: string;
    finalidade: FinalidadeCategoria;
};

export type CategoriaResponse = {
    categoriaId: number;
    descricao: string;
    finalidade: FinalidadeCategoria;
};
