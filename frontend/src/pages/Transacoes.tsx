import { useEffect, useMemo, useState } from "react";
import { ApiError } from "../api/httpClient";
import { categoriasApi } from "../api/categoriasApi";
import { pessoasApi } from "../api/pessoasApi";
import { transacoesApi } from "../api/transacoesApi";
import type { CategoriaResponse } from "../types/categoria";
import type { PessoaResponse } from "../types/pessoa";
import type { CreateTransacaoRequest, TransacaoResponse } from "../types/transacao";
import { FinalidadeCategoria, TipoTransacao } from "../types/enums";

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

function tipoLabel(value: CreateTransacaoRequest["tipo"]) {
    if (value === TipoTransacao.Despesa) return "Despesa";
    if (value === TipoTransacao.Receita) return "Receita";
    return String(value);
}

function toTipoTransacao(value: string): CreateTransacaoRequest["tipo"] {
    const n = Number(value);

    if (n === TipoTransacao.Despesa) return TipoTransacao.Despesa;
    if (n === TipoTransacao.Receita) return TipoTransacao.Receita;

    return TipoTransacao.Despesa;
}

function formatMoney(value: number) {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function Transacoes() {
    const [transacoes, setTransacoes] = useState<TransacaoResponse[]>([]);
    const [pessoas, setPessoas] = useState<PessoaResponse[]>([]);
    const [categorias, setCategorias] = useState<CategoriaResponse[]>([]);

    const [ui, setUi] = useState<UiState>({
        loading: false,
        submitting: false,
        error: null,
        success: null,
    });

    const [form, setForm] = useState<CreateTransacaoRequest>({
        descricao: "",
        valor: 0,
        tipo: TipoTransacao.Despesa,
        pessoaId: 0,
        categoriaId: 0,
    });

    const categoriasDisponiveis = useMemo(() => {
        if (form.tipo === TipoTransacao.Receita) {
            return categorias.filter(
                (c) =>
                    c.finalidade === FinalidadeCategoria.Receita ||
                    c.finalidade === FinalidadeCategoria.DespesaReceita,
            );
        }

        return categorias.filter(
            (c) =>
                c.finalidade === FinalidadeCategoria.Despesa ||
                c.finalidade === FinalidadeCategoria.DespesaReceita,
        );
    }, [categorias, form.tipo]);

    const canSubmit = useMemo(() => {
        const descricaoOk = form.descricao.trim().length > 0;
        const valorOk = typeof form.valor === "number" && form.valor > 0;
        const pessoaOk = typeof form.pessoaId === "number" && form.pessoaId > 0;
        const categoriaOk = typeof form.categoriaId === "number" && form.categoriaId > 0;
        return descricaoOk && valorOk && pessoaOk && categoriaOk && !ui.submitting;
    }, [form, ui.submitting]);

    async function loadAll() {
        setUi((p) => ({ ...p, loading: true, error: null, success: null }));

        try {
            const [pessoasData, categoriasData, transacoesData] = await Promise.all([
                pessoasApi.list(),
                categoriasApi.list(),
                transacoesApi.list(),
            ]);

            setPessoas(pessoasData);
            setCategorias(categoriasData);
            setTransacoes(transacoesData);

            setForm((prev) => ({
                ...prev,
                pessoaId: prev.pessoaId > 0 ? prev.pessoaId : (pessoasData[0]?.pessoaId ?? 0),
                categoriaId:
                    prev.categoriaId > 0
                        ? prev.categoriaId
                        : (categoriasData[0]?.categoriaId ?? 0),
            }));
        } catch (err) {
            setUi((p) => ({ ...p, error: getErrorMessage(err) }));
        } finally {
            setUi((p) => ({ ...p, loading: false }));
        }
    }

    useEffect(() => {
        void loadAll();
    }, []);

    useEffect(() => {
        if (form.categoriaId <= 0) return;

        const ok = categoriasDisponiveis.some((c) => c.categoriaId === form.categoriaId);
        if (!ok) {
            setForm((p) => ({
                ...p,
                categoriaId: categoriasDisponiveis[0]?.categoriaId ?? 0,
            }));
        }
    }, [categoriasDisponiveis, form.categoriaId]);

    async function onCreate() {
        setUi((p) => ({ ...p, submitting: true, error: null, success: null }));

        try {
            const payload: CreateTransacaoRequest = {
                descricao: form.descricao.trim(),
                valor: Number(form.valor),
                tipo: form.tipo,
                pessoaId: Number(form.pessoaId),
                categoriaId: Number(form.categoriaId),
            };

            const created = await transacoesApi.create(payload);

            setTransacoes((prev) =>
                [...prev, created].sort((a, b) => a.transacaoId - b.transacaoId),
            );

            setForm((p) => ({
                ...p,
                descricao: "",
                valor: 0,
            }));

            setUi((p) => ({ ...p, success: "TransaÃ§Ã£o criada com sucesso." }));
        } catch (err) {
            setUi((p) => ({ ...p, error: getErrorMessage(err) }));
        } finally {
            setUi((p) => ({ ...p, submitting: false }));
        }
    }

    return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <h1>Transações</h1>

      {(ui.loading || ui.error || ui.success) && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {ui.loading && <div className="alert">Carregando...</div>}
          {ui.error && (
            <div className="alert alert--error">
              <strong>Erro:</strong> {ui.error}
            </div>
          )}
          {ui.success && <div className="alert alert--success">{ui.success}</div>}
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h2>Criar transação</h2>
        </div>
        <div className="card-body">
          {pessoas.length === 0 || categorias.length === 0 ? (
            <p className="muted">
              Para criar transações, cadastre ao menos <strong>uma pessoa</strong> e{" "}
              <strong>uma categoria</strong>.
            </p>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 160px", gap: 12 }}>
                <label>
                  Descrição
                  <input
                    value={form.descricao}
                    onChange={(e) => setForm((p) => ({ ...p, descricao: e.target.value }))}
                    placeholder="Ex.: Mercado"
                    disabled={ui.submitting}
                  />
                </label>

                <label>
                  Valor
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={form.valor}
                    onChange={(e) => setForm((p) => ({ ...p, valor: Number(e.target.value) }))}
                    disabled={ui.submitting}
                  />
                </label>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "180px 1fr 1fr",
                  gap: 12,
                  marginTop: 12,
                }}
              >
                <label>
                  Tipo
                  <select
                    value={form.tipo}
                    onChange={(e) => setForm((p) => ({ ...p, tipo: toTipoTransacao(e.target.value) }))}
                    disabled={ui.submitting}
                  >
                    <option value={TipoTransacao.Despesa}>Despesa</option>
                    <option value={TipoTransacao.Receita}>Receita</option>
                  </select>
                </label>

                <label>
                  Pessoa
                  <select
                    value={form.pessoaId}
                    onChange={(e) => setForm((p) => ({ ...p, pessoaId: Number(e.target.value) }))}
                    disabled={ui.submitting}
                  >
                    {pessoas.map((p) => (
                      <option key={p.pessoaId} value={p.pessoaId}>
                        {p.nome} (ID {p.pessoaId})
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Categoria
                  <select
                    value={form.categoriaId}
                    onChange={(e) => setForm((p) => ({ ...p, categoriaId: Number(e.target.value) }))}
                    disabled={ui.submitting}
                  >
                    {categoriasDisponiveis.map((c) => (
                      <option key={c.categoriaId} value={c.categoriaId}>
                        {c.descricao} (ID {c.categoriaId})
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="card-actions">
                <button onClick={() => void onCreate()} disabled={!canSubmit}>
                  {ui.submitting ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Lista</h2>
        </div>
        <div className="card-body">
          {transacoes.length === 0 && !ui.loading ? (
            <p className="muted">Nenhuma transação cadastrada.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Descrição</th>
                    <th>Tipo</th>
                    <th>Valor</th>
                    <th>Pessoa</th>
                    <th>Categoria</th>
                  </tr>
                </thead>
                <tbody>
                  {transacoes.map((t) => (
                    <tr key={t.transacaoId}>
                      <td>{t.transacaoId}</td>
                      <td>{t.descricao}</td>
                      <td>{tipoLabel(t.tipo)}</td>
                      <td>{formatMoney(t.valor)}</td>
                      <td>{t.pessoaNome}</td>
                      <td>{t.categoriaDescricao}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
