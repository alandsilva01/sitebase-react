// src/components/AboutSection.tsx
import React from "react";
import "../styles/about.css";

export type Specialty = {
  id?: string;
  icon?: string;    // classe FontAwesome ex: "fas fa-industry" OR caminho de imagem em 'img'
  img?: string;     // se preferir usar imagem em vez de icon
  title: string;
  text?: string;
};

export interface AboutSectionProps {
  isHome?: boolean;               // true => usar H1 (home); false => usar H2 (interna)
  siteName: string;
  slogan?: string;
  image?: string;                 // imagem principal (ex: "/imagens/quem-somos.webp")
  imageAlt?: string;
  paragraphs?: string[];          // textos de descrição
  cta?: { text: string; href: string };
  specialties?: Specialty[];      // blocos de especialidade
  includeStructuredData?: boolean;// gera JSON-LD Organization
  url?: string;                   // base url do site (para JSON-LD e links)
  className?: string;
}

export default function AboutSection({
  isHome = true,
  siteName,
  slogan,
  image,
  imageAlt,
  paragraphs = [],
  cta,
  specialties = [],
  includeStructuredData = true,
  url = "/",
  className = "",
}: AboutSectionProps) {
  const Title = isHome ? "h1" : "h2";
  const headingText = isHome ? `${siteName}${slogan ? ` ${slogan}` : ""}` : `${siteName}`;

  const ld = includeStructuredData ? {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": siteName,
    "url": url,
    "logo": image ? (new URL(image, window.location.origin).toString()) : undefined
  } : null;

  return (
    <section id="about" className={`about-section ${className}`} aria-labelledby="about-heading">
      <div className="container">
        <div className="wrapper about-row gap-10">
          <div className="about-media col-md-12">
            {/* imagem principal - responsiva */}
            {image && (
              <figure className="about-figure">
                <img
                  src={image}
                  alt={imageAlt ?? siteName}
                  width={800}
                  height={520}
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            )}
          </div>

          <div className="about-content col-md-12">
            <div className="sobre-title">
              {React.createElement(
                Title,
                { id: "about-heading", className: `about-heading mb-0 fs-30 fw-800 text-uppercase lh` },
                headingText
              )}
            </div>

            <div className="about-text">
              {paragraphs.map((p, i) => (
                <p key={i} className="m-0 mb-3">{p}</p>
              ))}

              {cta && (
                <p className="mt-3">
                  <a className="btn btn--primary text-uppercase fw-700" href={cta.href} title={cta.text}>
                    {cta.text}
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>

        {specialties && specialties.length > 0 && (
          <div className="bg-light p-5 mt-4 specialties-section">
            <div className="text-center especialidade-text w-50 m-auto over-hidden">
              <h2 className="text-uppercase dark">Nossa Especialidade</h2>
              <p>Atendemos clientes em diversos segmentos com qualidade e segurança.</p>
            </div>

            <div className="grid-col-4 mt-5 pt-5 text-center specialties-grid">
              {specialties.map((s, idx) => (
                <div key={s.id ?? idx} className="card-mvv">
                  {s.img ? (
                    <img width={60} height={60} src={s.img} alt={s.title} loading="lazy" />
                  ) : s.icon ? (
                    <i className={`${s.icon} fa-2x`} aria-hidden />
                  ) : null}
                  <p>{s.title}</p>
                  {s.text && <small className="d-block text-muted">{s.text}</small>}
                </div>
              ))}
            </div>
            <div className="clear" />
          </div>
        )}
      </div>

      {/* JSON-LD */}
      {ld && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      )}
    </section>
  );
}
