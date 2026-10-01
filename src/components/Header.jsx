import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import logoNikkei from '../assets/logotipo-1.png';
import iconeUsuario from '../assets/do-utilizador.png';
import './Header.css';

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/produtos', label: 'Produtos' },
  { to: '/contato', label: 'Contato' },
  { to: '/sobre', label: 'Sobre Nós' },
];

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const toggleRef = useRef(null);
  const [lastPath, setLastPath] = useState(location.pathname);

  // fecha o menu ao trocar de rota
  if (location.pathname !== lastPath) {
    setLastPath(location.pathname);
    if (menuOpen) setMenuOpen(false);
  }

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 8);
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Escape fecha o menu e devolve o foco pro botão
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="site-header__inner container">
        <NavLink to="/" className="site-header__brand" aria-label="Nikkei — página inicial">
          <img src={logoNikkei} alt="Nikkei" className="site-header__logo" />
        </NavLink>

        <nav className="site-header__nav" aria-label="Navegação principal">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `site-header__link${isActive ? ' is-active' : ''}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="site-header__actions">
          <NavLink to="/login" className="btn btn--outline btn--sm site-header__login">
            Login
            <img src={iconeUsuario} alt="" aria-hidden="true" className="site-header__login-icon" />
          </NavLink>
          <button
            ref={toggleRef}
            type="button"
            className={`site-header__toggle${menuOpen ? ' is-open' : ''}`}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={`site-header__mobile${menuOpen ? ' is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
      >
        <nav className="site-header__mobile-nav" aria-label="Navegação mobile">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `site-header__mobile-link${isActive ? ' is-active' : ''}`
              }
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink
            to="/login"
            className="btn btn--outline site-header__mobile-login"
            onClick={() => setMenuOpen(false)}
          >
            Login
            <img src={iconeUsuario} alt="" aria-hidden="true" className="site-header__login-icon" />
          </NavLink>
        </nav>
      </div>

      {menuOpen && (
        <button
          type="button"
          className="site-header__backdrop"
          aria-label="Fechar menu"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </header>
  );
}

export default Header;
