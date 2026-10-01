import { NavLink } from 'react-router-dom';
import logoFooter from '../assets/logotipo-rodape.png';
import './Footer.css';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__brand">
          <img src={logoFooter} alt="Nikkei" className="site-footer__logo" />
          <p className="site-footer__tagline">
            Materiais de construção com atendimento próximo e especializado.
          </p>
        </div>

        <nav className="site-footer__nav" aria-label="Links do rodapé">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/produtos">Produtos</NavLink>
          <NavLink to="/contato">Contato</NavLink>
          <NavLink to="/sobre">Sobre Nós</NavLink>
        </nav>

        <div className="site-footer__info">
          <p>(19) 3261-1271</p>
          <p>R. Edson Luiz Rigonatto, 1295 — Jd. Sta. Clara, Campinas/SP</p>
        </div>
          
      </div>

      <div className="site-footer__bottom">
        <p>© {new Date().getFullYear()} Nikkei. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;
