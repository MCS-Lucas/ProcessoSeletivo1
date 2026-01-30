import { useEffect, useMemo, useState } from "react";
import { pessoasApi } from "../api/pessoasApi";
import { ApiError } from "../api/httpClient";
import type { CreatePessoaRequest, PessoaResponse } from "../types/pessoa";

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

export default function Pessoas() {
    const [pessoas, setPessoas] = useState<PessoaResponse[]>([]);
    const [ui, setUi] = useState<UiState>({
        loading: false,
        submitting: false,
        error: null,
        success: null,
    });

    const [form, setForm] = useState<CreatePessoaRequest>({
        nome: "",
        idade: 18,
    });

    const canSubmit = useMemo(() => {
        const nomeOk = form.nome.trim().length > 0;
        const idadeOk = Number.isInteger(form.idade) && form.idade > 0;
        return nomeOk && idadeOk && !ui.submitting;
    }, [form, ui.submitting]);

    async function load() {
        setUi((p) => ({ ...p, loading: true, error: null, success: null }));
        try {
            const data = await pessoasApi.list();
            setPessoas(data);
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
            const payload: CreatePessoaRequest = {
                nome: form.nome.trim(),
                idade: Number(form.idade),
            };

            const created = await pessoasApi.create(payload);

            setPessoas((prev) =>
                [...prev, created].sort((a, b) => a.pessoaId - b.pessoaId),
            );

            setForm({ nome: "", idade: 18 });
            setUi((p) => ({ ...p, success: "Pessoa criada com sucesso." }));
        } catch (err) {
            setUi((p) => ({ ...p, error: getErrorMessage(err) }));
        } finally {
            setUi((p) => ({ ...p, submitting: false }));
        }
    }

    async function onDelete(id: number) {
        const ok = window.confirm(
            "Tem certeza que deseja deletar esta pessoa?\nAs transações vinculadas serão removidas também.",
        );
        if (!ok) return;

        setUi((p) => ({ ...p, error: null, success: null }));

        try {
            await pessoasApi.remove(id);
            setPessoas((prev) => prev.filter((x) => x.pessoaId !== id));
            setUi((p) => ({ ...p, success: "Pessoa removida." }));
        } catch (err) {
            setUi((p) => ({ ...p, error: getErrorMessage(err) }));
        }
    }

    return (
        <div className="page">
            <h1 className="page-title">Pessoas</h1>

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
                    <h2>Criar pessoa</h2>
                </div>

                <div className="card-body">
                    <div className="form-grid form-grid--2">
                        <label className="form-field">
                            <span className="form-label">Nome</span>
                            <input
                                value={form.nome}
                                onChange={(e) =>
                                    setForm((p) => ({
                                        ...p,
                                        nome: e.target.value,
                                    }))
                                }
                                placeholder="Ex.: João"
                                disabled={ui.submitting}
                            />
                        </label>

                        <label className="form-field">
                            <span className="form-label">Idade</span>
                            <input
                                type="number"
                                value={form.idade}
                                onChange={(e) =>
                                    setForm((p) => ({
                                        ...p,
                                        idade: Number(e.target.value),
                                    }))
                                }
                                min={1}
                                disabled={ui.submitting}
                            />
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
                    {pessoas.length === 0 && !ui.loading ? (
                        <p className="muted">Nenhuma pessoa cadastrada.</p>
                    ) : (
                        <div className="table-wrap">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nome</th>
                                        <th>Idade</th>
                                        <th className="actions"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pessoas.map((p) => (
                                        <tr key={p.pessoaId}>
                                            <td>{p.pessoaId}</td>
                                            <td>{p.nome}</td>
                                            <td>{p.idade}</td>
                                            <td className="actions">
                                                <button
                                                    className="btn btn--danger btn--sm"
                                                    onClick={() =>
                                                        void onDelete(p.pessoaId)
                                                    }>
                                                    Deletar
                                                </button>
                                            </td>
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
