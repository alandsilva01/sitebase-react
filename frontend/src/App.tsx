// src/App.tsx
import React from "react";
import Header, { type SiteInfo } from "./components/Header";
import BannerSlider, { type BannerItem } from "./components/BannerSlider";

const siteInfo: SiteInfo = {
  nomeSite: "Meu Site",
  logo: "/imagens/logo.png",
  rua: "R. Exemplo, 123",
  cidade: "Belo Horizonte",
  UF: "MG",
  foneList: [
    ["31", "99999-9999", "fab fa-whatsapp"],
    ["31", "3333-3333", "fas fa-phone"],
  ],
  emailContato: "contato@exemplo.com",
  menuItems: [],
};

const banners: BannerItem[] = [
  {
    title: "Exemplo de Banner",
    subtitle: "Subtítulo chamativo do banner",
    link: "/contato",
    image: "/imagens/slider/banner-exemplo.webp",
    thumb: "/imagens/informacoes/exemplo-mpi-01.webp",
  },
  {
    title: "Segundo Banner",
    subtitle: "Outro subtítulo",
    link: "/contato",
    image: "/imagens/slider/banner-exemplo.webp",
  },
];

export default function App() {
  return (
    <div>
      <Header site={siteInfo} />
      <BannerSlider items={banners} autoplay interval={4500} height="650px" showThumb />
      <main className="container">
        <h1>Conteúdo</h1>
      </main>
    </div>
  );
}
