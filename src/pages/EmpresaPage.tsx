// src/pages/EmpresaPage.tsx
import React from "react";
import Breadcrumb from "../components/BreadCrumb";
import "../styles/about.css";

export default function EmpresaPage() {
  return (
    <>
      {/* breadcrumb usa o menuData para gerar trilha automaticamente.
          Se quiser um título customizado: <Breadcrumb title="Sobre a Empresa" /> */}
      <Breadcrumb />

      <div className="container">
        <div className="wrapper mb-5" style={{ padding: "2rem 0" }}>
          <h2>Empresa</h2>

          <div className="g-cols cgap-20 rgap-40">
            <div className="g-col-9 g-col-md-12 bg-light p-5 rounded">
              <h3 className="mt-0 mb-5">Quem somos</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aqui vai o texto da empresa...
              </p>
              <p>
                Adicione mais parágrafos e detalhes reais da empresa. Este é o conteúdo que deve aparecer
                quando a rota <code>/empresa</code> for acessada.
              </p>
            </div>

            <aside className="g-col-3 g-col-md-12 bg-light p-5 rounded">
              <h3>Informações</h3>
              <p>Contato, telefone e links rápidos.</p>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
