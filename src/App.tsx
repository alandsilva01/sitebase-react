// src/App.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import EmpresaPage from "./pages/EmpresaPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App(): JSX.Element {
  return (
    <>
      <Header
        address="Av. Exemplo, 123 - São Paulo - SP"
        contacts={[{ ddd: "11", number: "99999-9999", whatsapp: true }]}
        email="contato@lorem.com.br"
        logoSrc="/imagens/logo.png"
      />

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/empresa" element={<EmpresaPage />} />
          {/* adicione outras rotas aqui */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  );
}
