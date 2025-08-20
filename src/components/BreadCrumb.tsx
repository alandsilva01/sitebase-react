// src/components/Breadcrumb.tsx
import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import menuData from "../data/items-menu.json";

type MenuItemJSON = {
  url?: string;
  icon?: string;
  image?: string;
  hideLabel?: boolean;
  submenu?: Record<string, MenuItemJSON>;
};

type MenuJSON = Record<string, MenuItemJSON>;

function normalizePath(p?: string) {
  if (!p) return "";
  return p.replace(/^\/+|\/+$/g, "");
}

/**
 * procura recursiva no menu (preenche result[] com pares {label, url} do caminho encontrado)
 * retorna true se encontrou
 */
function findBreadcrumb(menu: MenuJSON, target: string, result: Array<{ label: string; url: string }>): boolean {
  for (const [label, data] of Object.entries(menu)) {
    const urlNorm = normalizePath(data.url);
    if (urlNorm === target) {
      result.push({ label, url: data.url ?? "" });
      return true;
    }
    if (data.submenu) {
      if (findBreadcrumb(data.submenu, target, result)) {
        result.push({ label, url: data.url ?? "" });
        return true;
      }
    }
  }
  return false;
}

/**
 * tenta encontrar o breadcrumb para a URL atual, com fallback por segmentos.
 * Ex.: /a/b/c -> tenta "a/b/c", "a/b", "a" etc.
 */
function resolveBreadcrumbForPath(menu: MenuJSON, pathname: string) {
  const cleaned = normalizePath(pathname);
  if (!cleaned) return []; // home

  const segments = cleaned.split("/");
  for (let len = segments.length; len >= 1; len--) {
    const tryPath = segments.slice(0, len).join("/");
    const result: Array<{ label: string; url: string }> = [];
    if (findBreadcrumb(menu, tryPath, result)) {
      return result.reverse(); // retornar em ordem pai -> filho
    }
  }
  return [];
}

export default function Breadcrumb({ title }: { title?: string }) {
  const location = useLocation();
  const pathname = location.pathname;

  const trail = useMemo(() => {
    const path = resolveBreadcrumbForPath(menuData as MenuJSON, pathname);
    return path;
  }, [pathname]);

  // montar esquema JSON-LD BreadcrumbList
  const jsonLd = useMemo(() => {
    const itemList: any[] = [];
    // Home é sempre item 1
    itemList.push({
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: window.location.origin + "/"
    });

    trail.forEach((t, i) => {
      const pos = i + 2; // depois do Home
      const itemUrl = t.url && t.url.startsWith("/") ? window.location.origin + t.url : window.location.origin + "/" + normalizePath(t.url);
      itemList.push({
        "@type": "ListItem",
        position: pos,
        name: t.label,
        item: itemUrl
      });
    });

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: itemList
    };
  }, [trail]);

  // título: se o usuário passou, usa; senão usa o último do breadcrumb (se existir)
  const computedTitle = title ?? (trail.length ? trail[trail.length - 1].label : null);

  return (
    <div className="bread bread--default" aria-label="breadcrumb-wrapper">
      <div className="wrapper">
        <div className="bread__row">
          <nav aria-label="breadcrumb">
            <ol id="breadcrumb" className="breadcrumb-list">
              <li className="bread__column">
                <Link to="/">Home</Link>
              </li>

              {trail.map((item, i) => {
                const isLast = i === trail.length - 1;
                const href = item.url ? (item.url.startsWith("/") ? item.url : `/${normalizePath(item.url)}`) : "/";
                return isLast ? (
                  <li key={i} className="bread__column active" aria-current="page">
                    {item.label}
                  </li>
                ) : (
                  <li key={i} className="bread__column">
                    <Link to={href}>{item.label}</Link>
                  </li>
                );
              })}
            </ol>
          </nav>

          {computedTitle && <h1 className="bread__title">{computedTitle}</h1>}
        </div>
      </div>

      {/* JSON-LD para breadcrumbs */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
