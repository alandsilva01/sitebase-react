// src/components/MenuHamburger.tsx
import React, { useState } from 'react';
import type { MenuItem } from './MenuTop';

export default function MenuHamburger({ items }: { items: MenuItem[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="header__navigation">
      <nav id="menu-hamburger" aria-label="Mobile menu">
        <div className="menu__collapse">
          <button
            className="collapse__icon"
            aria-expanded={open}
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setOpen((s) => !s)}
          >
            <span className="collapse__icon--1" style={open ? { transform: 'rotate(45deg) translateY(7px)' } : {}} />
            <span className="collapse__icon--2" style={open ? { opacity: 0 } : {}} />
            <span className="collapse__icon--3" style={open ? { transform: 'rotate(-45deg) translateY(-7px)' } : {}} />
          </button>
        </div>

        <div className={`menu__collapsible ${open ? 'open' : ''}`}>
          <div className="wrapper p-4">
            <ul className="menu__items">
              {items.map((it, idx) => (
                <li key={idx} className="mb-2">
                  <a href={it.url || '#'} className="block p-2">{it.title}</a>
                  {it.children && it.children.length > 0 && (
                    <ul className="pl-4">
                      {it.children.map((c, j) => <li key={j}><a href={c.url || '#'} className="block p-1">{c.title}</a></li>)}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
