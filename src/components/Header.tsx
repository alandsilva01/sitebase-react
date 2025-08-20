// src/components/Header.tsx
import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import menuData from "../data/items-menu.json";
import "../styles/header.css";

type MenuItemJSON = {
  url?: string;
  icon?: string;
  image?: string;
  hideLabel?: boolean;
  submenu?: Record<string, MenuItemJSON>;
};

type MenuJSON = Record<string, MenuItemJSON>;

type Contact = {
  ddd: string;
  number: string;
  icon?: string;
  whatsapp?: boolean;
};

function isExternal(raw?: string) {
  if (!raw) return false;
  return raw.startsWith("http") || raw.startsWith("mailto:") || raw.startsWith("tel:") || raw.startsWith("//");
}

export default function Header({
  address = "Rua Exemplo, Bairro - Cidade - UF",
  contacts = [{ ddd: "11", number: "99999-9999", whatsapp: true }],
  email = "contato@exemplo.com",
  logoSrc,
  menu = menuData as unknown as MenuJSON
}: {
  address?: string;
  contacts?: Contact[];
  email?: string;
  logoSrc?: string;
  menu?: MenuJSON;
}) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSubmenuIndex, setOpenSubmenuIndex] = useState<number | null>(null);

  useEffect(() => {
    document.body.classList.toggle("lock-scroll", mobileOpen);
    return () => document.body.classList.remove("lock-scroll");
  }, [mobileOpen]);

  const menuKeys = Object.keys(menu || {});

  function resolveUrl(raw?: string) {
    if (!raw) return "/";
    return raw.startsWith("http") || raw.startsWith("/") ? raw : `/${raw}`;
  }

  function sanitizeTel(ddd: string, number: string) {
    return `${ddd}${number}`.replace(/\D/g, "");
  }

  // Força navegação SPA (usado quando decidimos renderizar <a> mas queremos SPA)
  function handleInternalNav(e: React.MouseEvent, to: string) {
    e.preventDefault();
    setMobileOpen(false);
    navigate(to);
  }

  return (
    <header id="site-header" className="site-header">
      <div className="topbar">
        <div className="wrapper d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center light gap-10">
            <i className="fas fa-map-marker-alt" aria-hidden="true" />
            <span>{address}</span>
          </div>

          <div className="d-flex align-items-center light gap-10">
            {contacts.slice(0, 3).map((c, i) => {
              const tel = sanitizeTel(c.ddd, c.number);
              const icon = c.icon ?? (c.whatsapp ? "fab fa-whatsapp" : "fas fa-phone");
              const href = c.whatsapp ? `https://wa.me/${tel}` : `tel:${tel}`;
              return (
                <a key={i} href={href} className="d-flex align-items-center light gap-10" rel="nofollow" style={{ textDecoration: "none" }}>
                  <i className={icon} />
                  <span className="hide-mobile">{`(${c.ddd}) ${c.number}`}</span>
                </a>
              );
            })}
            {email && (
              <a href={`mailto:${email}`} className="d-flex align-items-center light gap-10" rel="nofollow">
                <i className="fas fa-envelope" />
                <span className="hide-mobile">{email}</span>
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="mainbar">
        <div className="wrapper d-flex align-items-center justify-content-between">
          <div className="logo">
            <Link to="/" title="Início" aria-label="Ir para página inicial" style={{ textDecoration: "none" }}>
              {logoSrc ? <img src={logoSrc} alt="Logo" style={{ maxWidth: 220 }} /> : <div className="logo-placeholder">Logo</div>}
            </Link>
          </div>

          {/* Desktop nav */}
          <nav className="nav-desktop" aria-label="Menu principal">
            <ul>
              {menuKeys.map((label, idx) => {
                const item = menu[label] as MenuItemJSON;
                const hasSub = !!item?.submenu && Object.keys(item.submenu).length > 0;
                const hideLabel = !!item?.hideLabel;
                const url = resolveUrl(item?.url);

                return (
                  <li key={label + idx} className={hasSub ? "dropdown" : undefined}>
                    {/* Desktop: se for externo usa <a>, se interno usamos NavLink (ou fallback handleInternalNav) */}
                    {isExternal(item?.url) ? (
                      <a href={item?.url} aria-haspopup={hasSub ? "true" : undefined}>
                        {item?.icon && <i className={item.icon} style={{ marginRight: hideLabel ? 0 : 8 }} />}
                        {!hideLabel && label}
                      </a>
                    ) : (
                      // ainda usamos NavLink (visível como <a> no DOM), mas também garantimos behavior com onClick fallback
                      <NavLink
                        to={url}
                        aria-haspopup={hasSub ? "true" : undefined}
                        className={({ isActive }) => (isActive ? "active" : "")}
                        onClick={(e) => {
                          // Interceptar e usar navigate (redundante com NavLink, mas evita recarregamentos estranhos)
                          if (!isExternal(item?.url)) handleInternalNav(e, url);
                        }}
                      >
                        {item?.icon && <i className={item.icon} style={{ marginRight: hideLabel ? 0 : 8 }} />}
                        {!hideLabel && label}
                      </NavLink>
                    )}

                    {hasSub && (
                      <div className="sub-menu" role="menu" aria-label={`${label} submenu`}>
                        <div className="sub-menu__items wrapper">
                          <ul className="sub-menu__list">
                            {Object.entries(item.submenu!).map(([sLabel, sItem]) => {
                              const sUrl = resolveUrl(sItem.url);
                              return (
                                <li key={sLabel}>
                                  {isExternal(sItem.url) ? (
                                    <a href={sItem.url}>
                                      {sItem.icon && <i className={sItem.icon} style={{ marginRight: 8 }} />}
                                      {sLabel}
                                    </a>
                                  ) : (
                                    <NavLink to={sUrl} onClick={(e) => handleInternalNav(e, sUrl)}>
                                      {sItem.icon && <i className={sItem.icon} style={{ marginRight: 8 }} />}
                                      {sLabel}
                                    </NavLink>
                                  )}
                                </li>
                              );
                            })}
                          </ul>

                          {(() => {
                            const firstWithImage = Object.values(item.submenu!).find(si => si.image);
                            if (firstWithImage && firstWithImage.image) {
                              return (
                                <div className="sub-menu__image" aria-hidden>
                                  <img src={firstWithImage.image} alt={`${label} imagem`} style={{ maxWidth: 180 }} />
                                </div>
                              );
                            }
                            return null;
                          })()}
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Mobile hamburger button */}
          <div className="nav-mobile" aria-hidden={false}>
            <button
              className={`collapse__icon ${mobileOpen ? "active" : ""}`}
              aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
              onClick={() => {
                setMobileOpen(!mobileOpen);
                setOpenSubmenuIndex(null);
              }}
            >
              <span className="collapse__icon--1"></span>
              <span className="collapse__icon--2"></span>
              <span className="collapse__icon--3"></span>
            </button>
          </div>
        </div>
      </div>

      {/* overlay */}
      <div className={`mobile-dark-overlay ${mobileOpen ? "active" : ""}`} onClick={() => setMobileOpen(false)} />

      {/* mobile collapsible menu (painel lateral da direita) */}
      <div className={`menu__collapsible ${mobileOpen ? "open" : ""}`} role="dialog" aria-modal="true" id="mobile-menu">
        <div className="menu__inner">
          <div className="menu__close">
            <button
              className="collapse__icon active"
              aria-label="Fechar menu"
              onClick={() => {
                setMobileOpen(false);
                setOpenSubmenuIndex(null);
              }}
            >
              <span className="collapse__icon--1"></span>
              <span className="collapse__icon--2"></span>
              <span className="collapse__icon--3"></span>
            </button>
          </div>

          <div className="wrapper">
            <ul className="menu__items">
              {menuKeys.map((label, idx) => {
                const item = menu[label] as MenuItemJSON;
                const hasSub = !!item?.submenu && Object.keys(item.submenu).length > 0;
                const url = resolveUrl(item?.url);

                return (
                  <li key={label + idx} className="menu__item">
                    <div className="d-flex align-items-center justify-content-between">
                      {hasSub ? (
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setOpenSubmenuIndex(openSubmenuIndex === idx ? null : idx);
                          }}
                          style={{ textDecoration: "none" }}
                        >
                          {item?.icon && <i className={item.icon} style={{ marginRight: 8 }} />}
                          {item?.hideLabel ? null : label}
                        </a>
                      ) : (
                        <>
                          {isExternal(item?.url) ? (
                            <a href={item?.url} onClick={() => setMobileOpen(false)} style={{ textDecoration: "none" }}>
                              {item?.icon && <i className={item.icon} style={{ marginRight: 8 }} />}
                              {item?.hideLabel ? null : label}
                            </a>
                          ) : (
                            <a
                              href={url}
                              onClick={(e) => handleInternalNav(e, url)}
                              style={{ textDecoration: "none" }}
                            >
                              {item?.icon && <i className={item.icon} style={{ marginRight: 8 }} />}
                              {item?.hideLabel ? null : label}
                            </a>
                          )}
                        </>
                      )}

                      {hasSub && (
                        <button
                          aria-expanded={openSubmenuIndex === idx}
                          aria-controls={`submenu-${idx}`}
                          onClick={() => setOpenSubmenuIndex(openSubmenuIndex === idx ? null : idx)}
                          className="submenu-toggle"
                          style={{ background: "transparent", border: 0, cursor: "pointer" }}
                        >
                          <i className="fas fa-chevron-down" />
                        </button>
                      )}
                    </div>

                    {hasSub && openSubmenuIndex === idx && (
                      <ul id={`submenu-${idx}`} className="submenu-mobile">
                        {Object.entries(item.submenu!).map(([sLabel, sItem]) => {
                          const sUrl = resolveUrl(sItem.url);
                          return (
                            <li key={sLabel}>
                              {isExternal(sItem.url) ? (
                                <a href={sItem.url} onClick={() => setMobileOpen(false)}>
                                  {sItem.icon && <i className={sItem.icon} style={{ marginRight: 8 }} />}
                                  {sLabel}
                                </a>
                              ) : (
                                <a href={sUrl} onClick={(e) => handleInternalNav(e, sUrl)}>
                                  {sItem.icon && <i className={sItem.icon} style={{ marginRight: 8 }} />}
                                  {sLabel}
                                </a>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
