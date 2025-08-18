// src/components/SimpleBanner.tsx
import React, { useEffect, useRef, useState } from "react";
import "./BannerSlider.css";

export type BannerItem = {
  title: string;
  subtitle?: string;
  link?: string;
  image: string; // ex: "/imagens/slider/banner-exemplo.webp"
  thumb?: string;  // miniatura opcional
};

interface Props {
  items: BannerItem[];
  autoplay?: boolean;
  interval?: number; // ms
  height?: string;   // ex: "600px"
  showThumb?: boolean;
}

export default function SimpleBanner({
  items,
  autoplay = true,
  interval = 5000,
  height = "600px",
  showThumb = true,
}: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!autoplay || paused || items.length <= 1) return;

    timerRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, interval);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [autoplay, paused, interval, items.length]);

  const goTo = (i: number) => setIndex((i + items.length) % items.length);
  const next = () => setIndex((i) => (i + 1) % items.length);
  const prev = () => setIndex((i) => (i - 1 + items.length) % items.length);

  if (!items || items.length === 0) return null;

  return (
    <section
      className="bs-slick-banner"
      style={{ height }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Banner principal"
    >
      <div className="simple-banner__viewport" style={{ transform: `translateX(-${index * 100}%)` }}>
        {items.map((it, i) => {
          const bg = it.image.startsWith("/") ? it.image : `/${it.image}`;
          return (
            <div
              key={i}
              className="bs-slick-slide"
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} de ${items.length}`}
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url("${bg}")`,
              }}
            >
              <div className="simple-banner__inner">
                <div className="simple-banner__content">
                  <h2 className="simple-banner__title">{it.title}</h2>
                  {it.subtitle && <p className="simple-banner__subtitle">{it.subtitle}</p>}
                  {it.link && (
                    <a className="btn btn--primary simple-banner__btn" href={it.link}>
                      Saiba mais
                    </a>
                  )}
                </div>

                {showThumb && it.thumb && (
                  <div className="simple-banner__thumb">
                    <img src={it.thumb.startsWith("/") ? it.thumb : `/${it.thumb}`} alt={`${it.title} miniatura`} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <button className="simple-banner__arrow simple-banner__arrow--left" onClick={prev} aria-label="Anterior"><i className="fa-solid fa-angle-left"></i></button>
      <button className="simple-banner__arrow simple-banner__arrow--right" onClick={next} aria-label="Próximo"><i className="fa-solid fa-angle-right"></i></button>

      {/* Dots */}
      <div className="simple-banner__dots">
        {items.map((_, i) => (
          <button
            key={i}
            className={`simple-banner__dot ${i === index ? "is-active" : ""}`}
            onClick={() => goTo(i)}
            aria-label={`Ir para slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
