// src/pages/HomePage.tsx
import React from "react";
import BannerHome from "../components/BannerHome";
import AboutSection from "../components/AboutSection";

export default function HomePage() {
  const images = ["/imagens/slider/banner-exemplo.webp"];
  const captions = ["Solução completa para o seu negócio"];

  return (
    <>
      <BannerHome
        images={images}
        captions={captions}
        interval={5000}
        hideOnMobile={false}
        showControls={true}
        showDots={true}
      />

      <AboutSection
        isHome={true}
        siteName="Nome do Site"
        slogan="Exemplo de Slogan"
        image="/imagens/quem-somos.webp"
        imageAlt="Quem somos"
        paragraphs={[
          "A CEAG surgiu com o intuito de elevar o nível de qualidade...",
          "CENTRO DE ESPECIALIDADES EM ANÁLISES GEOTÉCNICAS é uma empresa dedicada..."
        ]}
        cta={{ text: "Saiba Mais", href: "/quem-somos" }}
      />
    </>
  );
}
