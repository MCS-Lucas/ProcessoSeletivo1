import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="page">
      <h1 className="page-title">Home</h1>
      <section className="card">
          <div className="card-header">
            <h2>Bem-vindo</h2>
          </div>
        <div className="card-body">
          <p className="muted">
            Use o menu superior para navegar
            Fique à vontade para explorar as seções
          </p>
          <div className="btn-row">
            <Link className="btn btn--primary" to="/pessoas">
              Ir para Pessoas
            </Link>
            <Link className="btn" to="/categorias">
              Ir para Categorias
            </Link>
            <Link className="btn" to="/transacoes">
              Ir para Transações
            </Link>
            <Link className="btn" to="/relatorios">
              Ir para Relatórios
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
