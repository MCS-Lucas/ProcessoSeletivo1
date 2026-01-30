import { Navigate, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Pessoas from "../pages/Pessoas";
import Categorias from "../pages/Categorias";
import Transacoes from "../pages/Transacoes";
import Relatorios from "../pages/Relatorios";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/pessoas" element={<Pessoas />} />
      <Route path="/categorias" element={<Categorias />} />
      //Tive que utilizar o navigate porque acabei colocando categoria no singular no backend, renomear o backend daria mais trabalho que usar o navigate aqui
      <Route path="/categoria" element={<Navigate to="/categorias" replace />} />
      <Route path="/transacoes" element={<Transacoes />} />
      <Route path="/relatorios" element={<Relatorios />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
