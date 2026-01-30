import { useEffect, useMemo, useState } from "react";
import { categoriasApi } from "../api/categoriasApi";
import { ApiError } from "../api/httpClient";
import type { CreateCategoriaRequest, CategoriaResponse } from "../types/categoria";
import { FinalidadeCategoria } from "../types/enums";

type UiState = {
    loading: boolean;
    submitting: boolean;
    error: string | null;
    success: string | null;
};

function getErrorMessage(err: unknown): string {
    if (err instanceof ApiError) return err.message;
    if (err instanceof Error) return err.message;
    return "Erro inesperado.";
}

function finalidadeLabel(value: CreateCategoriaRequest["finalidade"]) {
    switch (value) {
        case FinalidadeCategoria.Despesa:
            return "Despesa";
        case FinalidadeCategoria.Receita:
            return "Receita";
        case FinalidadeCategoria.DespesaReceita:
            return "Despesa + Receita";
        default:
            return String(value);
    }
}

function toFinalidadeCategoria(value: string): CreateCategoriaRequest["finalidade"] {
    const n = Number(value);

    if (n === FinalidadeCategoria.Despesa) return FinalidadeCategoria.Despesa;
    if (n === FinalidadeCategoria.Receita) return FinalidadeCategoria.Receita;
    if (n === FinalidadeCategoria.DespesaReceita) return FinalidadeCategoria.DespesaReceita;

    return FinalidadeCategoria.Despesa;
}

export default function Categorias() {
    const [categorias, setCategorias] = useState<CategoriaResponse[]>([]);
    const [ui, setUi] = useState<UiState>({
        loading: false,
        submitting: false,
        error: null,
        success: null,
    });

    const [form, setForm] = useState<CreateCategoriaRequest>({
        descricao: "",
        finalidade: FinalidadeCategoria.Despesa,
    });

    const canSubmit = useMemo(() => {
        const descricaoOk = form.descricao.trim().length > 0;
        const finalidadeOk = typeof form.finalidade === "number" && form.finalidade > 0;
        return descricaoOk && finalidadeOk && !ui.submitting;
    }, [form, ui.submitting]);

    async function load() {
        setUi((p) => ({ ...p, loading: true, error: null, success: null }));
        try {
            const data = await categoriasApi.list();
            setCategorias(data);
        } catch (err) {
            setUi((p) => ({ ...p, error: getErrorMessage(err) }));
        } finally {
            setUi((p) => ({ ...p, loading: false }));
        }
    }

    useEffect(() => {
        void load();
    }, []);

    async function onCreate() {
        setUi((p) => ({ ...p, submitting: true, error: null, success: null }));

        try {
            const payload: CreateCategoriaRequest = {
                descricao: form.descricao.trim(),
                finalidade: form.finalidade,
            };

            const created = await categoriasApi.create(payload);

            setCategorias((prev) =>
                [...prev, created].sort((a, b) => a.categoriaId - b.categoriaId),
            );

            setForm({
                descricao: "",
                finalidade: FinalidadeCategoria.Despesa,
            });

            setUi((p) => ({ ...p, success: "Categoria criada com sucesso." }));
        } catch (err) {
            setUi((p) => ({ ...p, error: getErrorMessage(err) }));
        } finally {
            setUi((p) => ({ ...p, submitting: false }));
        }
    }

    return (
        <div className="page">
            <h1 className="page-title">Categorias</h1>

            {(ui.loading || ui.error || ui.success) && (
                <div className="stack">
                    {ui.loading && <div className="muted">Carregando...</div>}

                    {ui.error && (
                        <div className="alert alert--error">
                            <strong>Erro:</strong> {ui.error}
                        </div>
                    )}

                    {ui.success && (
                        <div className="alert alert--success">{ui.success}</div>
                    )}
                </div>
            )}

            <section className="card">
                <div className="card-header">
                    <h2>Criar categoria</h2>
                </div>

                <div className="card-body">
                    <div className="form-grid form-grid--cat">
                        <label className="form-field">
                            <span className="form-label">Descrição</span>
                            <input
                                value={form.descricao}
                                onChange={(e) =>
                                    setForm((p) => ({ ...p, descricao: e.target.value }))
                                }
                                placeholder="Ex.: Alimentação"
                                disabled={ui.submitting}
                            />
                        </label>

                        <label className="form-field">
                            <span className="form-label">Finalidade</span>
                            <select
                                value={form.finalidade}
                                onChange={(e) =>
                                    setForm((p) => ({
                                        ...p,
                                        finalidade: toFinalidadeCategoria(
                                            e.target.value,
                                        ),
                                    }))
                                }
                                disabled={ui.submitting}
                            >
                                <option value={FinalidadeCategoria.Despesa}>Despesa</option>
                                <option value={FinalidadeCategoria.Receita}>Receita</option>
                                <option value={FinalidadeCategoria.DespesaReceita}>
                                    Despesa + Receita
                                </option>
                            </select>
                        </label>
                    </div>

                    <div className="card-actions">
                        <button
                            className="btn btn--primary"
                            onClick={() => void onCreate()}
                            disabled={!canSubmit}
                        >
                            {ui.submitting ? "Salvando..." : "Salvar"}
                        </button>
                    </div>
                </div>
            </section>

            <section className="card">
                <div className="card-header">
                    <h2>Lista</h2>
                </div>

                <div className="card-body">
                    {categorias.length === 0 && !ui.loading ? (
                        <p className="muted">Nenhuma categoria cadastrada.</p>
                    ) : (
                        <div className="table-wrap">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Descrição</th>
                                        <th>Finalidade</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categorias.map((c) => (
                                        <tr key={c.categoriaId}>
                                            <td>{c.categoriaId}</td>
                                            <td>{c.descricao}</td>
                                            <td>{finalidadeLabel(c.finalidade)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
