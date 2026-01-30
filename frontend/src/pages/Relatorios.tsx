import { useEffect, useState } from "react";
import { relatoriosApi } from "../api/relatoriosApi";
import { ApiError } from "../api/httpClient";
import type {
    TotaisPorCategoriaResponse,
    TotaisPorPessoaResponse,
} from "../types/relatorios";

type UiState = {
    loading: boolean;
    error: string | null;
};

function getErrorMessage(err: unknown): string {
    if (err instanceof ApiError) return err.message;
    if (err instanceof Error) return err.message;
    return "Erro inesperado.";
}

function formatMoney(value: number) {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function Relatorios() {
    const [ui, setUi] = useState<UiState>({ loading: false, error: null });

    const [porPessoa, setPorPessoa] =
        useState<TotaisPorPessoaResponse | null>(null);

    const [porCategoria, setPorCategoria] =
        useState<TotaisPorCategoriaResponse | null>(null);

    const [categoriaIndisponivel, setCategoriaIndisponivel] =
        useState<boolean>(false);

    async function load() {
        setUi({ loading: true, error: null });
        setCategoriaIndisponivel(false);

        try {
            const pessoaData = await relatoriosApi.totaisPorPessoa();
            setPorPessoa(pessoaData);
        } catch (err) {
            setUi({ loading: false, error: getErrorMessage(err) });
            return;
        }

        try {
            const categoriaData = await relatoriosApi.totaisPorCategoria();
            setPorCategoria(categoriaData);
        } catch {
            setPorCategoria(null);
            setCategoriaIndisponivel(true);
        }

        setUi({ loading: false, error: null });
    }

    useEffect(() => {
        const id = window.setTimeout(() => {
            void load();
        }, 0);

        return () => window.clearTimeout(id);
    }, []);

    return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <h1>Relatórios</h1>

      <div className="card">
        <div className="card-body">
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <button onClick={() => void load()} disabled={ui.loading}>
              {ui.loading ? "Carregando..." : "Atualizar"}
            </button>

            {ui.error && (
              <div className="alert alert--error">
                <strong>Erro:</strong> {ui.error}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Totais por Pessoa</h2>
        </div>
        <div className="card-body">
          {!porPessoa ? (
            <p className="muted">Nenhum dado carregado.</p>
          ) : porPessoa.itens.length === 0 ? (
            <p className="muted">Sem dados para exibir.</p>
          ) : (
            <>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 12 }}>
                <div>
                  <strong>Receitas:</strong> {formatMoney(porPessoa.totalReceitasGeral)}
                </div>
                <div>
                  <strong>Despesas:</strong> {formatMoney(porPessoa.totalDespesasGeral)}
                </div>
                <div>
                  <strong>Saldo:</strong> {formatMoney(porPessoa.saldoLiquidoGeral)}
                </div>
              </div>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Pessoa</th>
                      <th>Receitas</th>
                      <th>Despesas</th>
                      <th>Saldo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {porPessoa.itens.map((x) => (
                      <tr key={x.pessoaId}>
                        <td>{x.nome}</td>
                        <td>{formatMoney(x.totalReceitas)}</td>
                        <td>{formatMoney(x.totalDespesas)}</td>
                        <td>{formatMoney(x.saldoLiquido)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Totais por Categoria</h2>
        </div>
        <div className="card-body">
          {categoriaIndisponivel ? (
            <div className="alert">
              Relatório por categoria indisponível.
            </div>
          ) : !porCategoria ? (
            <p className="muted">Nenhum dado carregado.</p>
          ) : porCategoria.itens.length === 0 ? (
            <p className="muted">Sem dados para exibir.</p>
          ) : (
            <>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 12 }}>
                <div>
                  <strong>Receitas:</strong> {formatMoney(porCategoria.totalReceitasGeral)}
                </div>
                <div>
                  <strong>Despesas:</strong> {formatMoney(porCategoria.totalDespesasGeral)}
                </div>
                <div>
                  <strong>Saldo:</strong> {formatMoney(porCategoria.saldoLiquidoGeral)}
                </div>
              </div>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Categoria</th>
                      <th>Receitas</th>
                      <th>Despesas</th>
                      <th>Saldo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {porCategoria.itens.map((x) => (
                      <tr key={x.categoriaId}>
                        <td>{x.descricao}</td>
                        <td>{formatMoney(x.totalReceitas)}</td>
                        <td>{formatMoney(x.totalDespesas)}</td>
                        <td>{formatMoney(x.saldoLiquido)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
