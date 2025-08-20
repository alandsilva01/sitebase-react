// src/components/BannerHome.tsx
import React, { useEffect, useRef, useState } from "react";
import "../styles/bannerHome.css"; // seu arquivo renomeado

export type BannerType = "image" | "center" | "split";

export type BannerSlide = {
  id?: string;
  type: BannerType;
  image: string;
  link?: string;
  title?: string;
  text?: string;
  button?: { text: string; href: string; ariaLabel?: string };
  thumb?: string; // somente para split
};

export interface BannerHomeProps {
  slides?: BannerSlide[];
  interval?: number;
  hideOnMobile?: boolean;
  showControls?: boolean;
  showDots?: boolean;
}

/**
 * BannerHome com comportamento adaptativo:
 * - No mobile (<=768px) slides do tipo "split" viram "center" (thumb escondida, conteúdo centralizado).
 */

const defaultSlides: BannerSlide[] = [
  {
    id: "b-1",
    type: "image",
    image: "/imagens/slider/banner-exemplo.webp",
    link: "/contato",
  },
  {
    id: "b-2",
    type: "center",
    image: "/imagens/slider/banner-exemplo.webp",
    title: "Soluções que transformam",
    text: "Tecnologia, performance e atendimento para sua empresa crescer.",
    button: { text: "Saiba mais", href: "/servicos", ariaLabel: "Saiba mais sobre serviços" },
  },
  {
    id: "b-3",
    type: "split",
    image: "/imagens/slider/banner-exemplo.webp",
    title: "Serviço em destaque",
    text: "Conheça a nova linha de soluções e cases de sucesso.",
    button: { text: "Ver detalhes", href: "/segmentos", ariaLabel: "Ver detalhes" },
    thumb: "/imagens/informacoes/exemplo-mpi-01.webp",
  },
];

export default function BannerHome({
  slides = defaultSlides,
  interval = 5000,
  hideOnMobile = false,
  showControls = true,
  showDots = true,
}: BannerHomeProps) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [isMobile, setIsMobile] = useState<boolean>(() => typeof window !== "undefined" ? window.innerWidth <= 768 : false);
  const slideCount = slides.length;
  const timerRef = useRef<number | null>(null);

  // detecta mudança de largura (responsivo) via matchMedia
  useEffect(() => {
    const mm = window.matchMedia("(max-width: 768px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    // set initial
    setIsMobile(mm.matches);
    // add listener (modern)
    if (mm.addEventListener) mm.addEventListener("change", handler);
    else mm.addListener(handler);
    return () => {
      if (mm.removeEventListener) mm.removeEventListener("change", handler);
      else mm.removeListener(handler);
    };
  }, []);

  // autoplay
  useEffect(() => {
    if (!playing || slideCount <= 1) return;
    timerRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % slideCount);
    }, interval);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [playing, slideCount, interval]);

  // touch
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
    setPlaying(false);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const onTouchEnd = () => {
    if (touchStartX.current == null || touchEndX.current == null) {
      setPlaying(true);
      return;
    }
    const diff = touchStartX.current - touchEndX.current;
    const min = 40;
    if (diff > min) setIndex((i) => (i + 1) % slideCount);
    else if (diff < -min) setIndex((i) => (i - 1 + slideCount) % slideCount);
    setPlaying(true);
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const prev = () => setIndex((i) => (i - 1 + slideCount) % slideCount);
  const next = () => setIndex((i) => (i + 1) % slideCount);
  const goTo = (i: number) => setIndex(i % slideCount);

  // decide se o banner deve ser escondido (prop + hideOnMobile)
  if (hideOnMobile && isMobile) return null;
  if (!slides || slides.length === 0) return null;

  return (
    <section
      className={hideOnMobile ? "banner-home hide-on-mobile" : "banner-home"}
      aria-label="Banner principal"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="banner-track" style={{ transform: `translateX(-${index * 100}%)` }}>
        {slides.map((s, i) => {
          // se mobile e slide split => tratar como center (oculta thumb)
          const effectiveType: BannerType = isMobile && s.type === "split" ? "center" : s.type;

          return (
            <div key={s.id ?? i} className={`banner-slide banner--${s.type} ${i === index ? "is-active" : ""}`}>
              {s.link ? (
                <a className="banner-link" href={s.link} aria-label={s.title ?? `Slide ${i + 1}`}>
                  <img src={s.image} alt={s.title ?? `Banner ${i + 1}`} loading={i === index ? "eager" : "lazy"} />
                </a>
              ) : (
                <img src={s.image} alt={s.title ?? `Banner ${i + 1}`} loading={i === index ? "eager" : "lazy"} />
              )}

              {/* Rendeira overlay conforme effectiveType */}
              {effectiveType === "center" && (
                <div className="banner-overlay center">
                  <div className="banner-center-inner">
                    {s.title && <h2 className="banner-title">{s.title}</h2>}
                    {s.text && <p className="banner-text">{s.text}</p>}
                    {s.button && (
                      <a className="btn btn--primary banner-cta" href={s.button.href} aria-label={s.button.ariaLabel ?? s.button.text}>
                        {s.button.text}
                      </a>
                    )}
                  </div>
                </div>
              )}

              {effectiveType === "split" && (
                <div className="banner-overlay split">
                  <div className="banner-split-inner wrapper d-flex">
                    <div className="banner-split-left">
                      {s.title && <h2 className="banner-title">{s.title}</h2>}
                      {s.text && <p className="banner-text">{s.text}</p>}
                      {s.button && (
                        <a className="btn btn--primary banner-cta" href={s.button.href} aria-label={s.button.ariaLabel ?? s.button.text}>
                          {s.button.text}
                        </a>
                      )}
                    </div>
                    <div className="banner-split-right">
                      {/* thumb só aparece no desktop; aqui effectiveType === 'split' significa desktop */}
                      {s.thumb && <img className="banner-thumb" src={s.thumb} alt={s.title ?? "Thumb"} />}
                    </div>
                  </div>
                </div>
              )}

              {effectiveType === "image" && <div className="banner-overlay image" aria-hidden />}
            </div>
          );
        })}
      </div>

      {showControls && slideCount > 1 && (
        <>
          <button className="banner-prev" onClick={prev} aria-label="Slide anterior"><i className="fa-solid fa-angle-left"></i></button>
          <button className="banner-next" onClick={next} aria-label="Próximo slide"><i className="fa-solid fa-angle-right"></i></button>
        </>
      )}

      {showDots && slideCount > 1 && (
        <div className="banner-dots" role="tablist" aria-label="Navegação dos banners">
          {slides.map((_, i) => (
            <button key={i} className={`banner-dot ${i === index ? "active" : ""}`} onClick={() => goTo(i)} aria-pressed={i === index} aria-label={`Ir para banner ${i + 1}`} />
          ))}
        </div>
      )}

      <button className="banner-playtoggle" onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pausar" : "Tocar"}>
        {playing ? "⏸" : "▶"}
      </button>
    </section>
  );
}
