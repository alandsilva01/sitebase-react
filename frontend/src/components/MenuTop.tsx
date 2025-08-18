import React from 'react';

export interface MenuItem {
  title: string;
  url?: string;
  children?: MenuItem[];
  icon?: string;
  active?: boolean;
}

export default function MenuTop({ items }: { items: MenuItem[] }) {
  return (
    <nav id="menu" aria-label="Main menu">
      <ul>
        {items.map((it, idx) => (
          <li key={idx} className={it.children && it.children.length ? 'dropdown' : ''} aria-haspopup={!!it.children}>
            <a href={it.url || '#'} className={it.active ? 'active-menu-topo' : ''}>
              {it.title}
            </a>
            {it.children && it.children.length > 0 && (
              <ul className="sub-menu" role="menu" aria-label={`${it.title} submenu`}>
                {it.children.map((c, j) => (
                  <li key={j}><a href={c.url || '#'} className={c.active ? 'active-menu-topo' : ''}>{c.title}</a></li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
