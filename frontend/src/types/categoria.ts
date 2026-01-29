import type { Finalidade } from "./enums";

export type Categoria = {
    id: number;
    descricao: string;
    finalidade: Finalidade;
};

export type CategoriaCreateDTO = {
    descricao: string;
    finalidade: Finalidade;
};
