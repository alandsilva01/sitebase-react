// src/components/Header.tsx
import React, { useEffect, useState } from 'react';
import MenuTop from './MenuTop';
import type { MenuItem } from './MenuTop';
import MenuHamburger from './MenuHamburger';

type Phone = [string, string, string];

export type SiteInfo = {
  nomeSite: string;
  slogan?: string;
  logo?: string | null;
  rua?: string;
  cidade?: string;
  UF?: string;
  foneList?: Phone[];
  whatsapp?: string | null;
  emailContato?: string | null;
  menuItems?: MenuItem[];
};

export default function Header({ site }: { site: SiteInfo }) {
  const [isMobile, setIsMobile] = useState<boolean>(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);
  const [headerFixed, setHeaderFixed] = useState<boolean>(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);

    const onScroll = () => setHeaderFixed(window.scrollY > 120);
    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const topPhones = site.foneList || [];
  const showTopo = !isMobile;

  return (
    <>
      <header id="scrollheader" className={headerFixed ? 'headerFixed' : ''}>
        {/* top bar (desktop only) */}
        {showTopo && (
          <div className="topo">
            <div className="wrapper">
              <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                <span>
                  <i className="fas fa-map-marker-alt" /> {site.rua ?? ''}{site.rua ? ' - ' : ''}{site.cidade ?? ''}{site.UF ? ` - ${site.UF}` : ''}
                </span>
                <div style={{display:'flex', gap:'0.6rem'}} className="header-top-contacts">
                  {topPhones.slice(0,3).map((p, i) => {
                    const tel = `${p[0]}${p[1]}`;
                    const isWpp = p[2] === 'fab fa-whatsapp';
                    return (
                      <span key={i}>
                        {isWpp ? (
                          <a rel="nofollow noreferrer noopener" href={`https://api.whatsapp.com/send?phone=55${tel}`} target="_blank">
                            <i className={p[2]} /> ({p[0]}) {p[1]}
                          </a>
                        ) : (
                          <a rel="nofollow" href={`tel:${tel}`}><i className={p[2]} /> ({p[0]}) {p[1]}</a>
                        )}
                      </span>
                    );
                  })}
                  {site.emailContato && <a rel="nofollow" href={`mailto:${site.emailContato}`}><i className="fas fa-envelope" /> {site.emailContato}</a>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* main header row */}
        <div className="wrapper">
          <div className="header-inner">
            {/* logo */}
            <div className="logo" style={{ flex: '0 0 auto' }}>
              <a rel="nofollow" href="/" title="Voltar a página inicial">
                {site.logo ? (
                  <img src={site.logo} alt={site.nomeSite} title={site.nomeSite}  />
                ) : (
                  <div className="logo-placeholder" style={{ height: '60px', width: '120px', background:'#ddd', display:'flex', alignItems:'center', justifyContent:'center', color:'#666' }}>Logo</div>
                )}
              </a>
            </div>

            {/* centro: menu */}
            <div className="menu-center" style={{ display: isMobile ? 'none' : 'flex', flex: 1, justifyContent: 'flex-end' }}>
              <MenuTop items={site.menuItems || []} />
            </div>

            {/* direita: ações */}
            <div style={{ flex: '0 0 auto', display: 'flex', alignItems:'center', gap:'1rem' }}>
              {isMobile ? <MenuHamburger items={site.menuItems || []} /> : null}
            </div>
          </div>
        </div>
      </header>

      {/* placeholder to prevent content jump */}
      <div id="header-block" style={{ height: headerFixed ? '80px' : '0px' }} />
    </>
  );
}
