import { NavLink } from "react-router-dom";

function navClass({ isActive }: { isActive: boolean }) {
    return `nav-link${isActive ? " is-active" : ""}`;
}

export default function Header() {
  return (
    <header className="topbar">
      <div className="container topbar_inner">
        <div className="brand">
          <span className="brand_title">Processo Seletivo</span>
        </div>

        <nav className="nav" aria-label="Navegação">
          <NavLink to="/" className={navClass} end>
            Home
          </NavLink>
          <NavLink to="/pessoas" className={navClass}>
            Pessoas
          </NavLink>
          <NavLink to="/categorias" className={navClass}>
            Categorias
          </NavLink>
          <NavLink to="/transacoes" className={navClass}>
            Transações
          </NavLink>
          <NavLink to="/relatorios" className={navClass}>
            Relatórios
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
