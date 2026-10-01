import { Link } from 'react-router-dom'
import heroDesktop from '../assets/hero-desktop.webp'
import heroMobile from '../assets/hero-mobile.webp'
import ex1 from '../assets/ex1.webp'
import ex2 from '../assets/ex2.webp'
import ex3 from '../assets/ex3.webp'
import hidraulica from '../assets/hidraulica.webp'
import iluminacao from '../assets/iluminacao.webp'
import acabamento from '../assets/acabamentos.webp'
import atualizacao from '../assets/AT.png'
import pintura from '../assets/P&P.png'
import ferramentasIcon from '../assets/Fet.png'
import ferragens from '../assets/Feg.png'
import infop from '../assets/ferramenta.webp'
import ProjectsCarousel from '../components/ProjectsCarousel'
import { useScrollReveal } from '../hooks/useScrollReveal'
import './Home.css'

const SERVICOS = [
  {
    icon: atualizacao,
    titulo: 'Atualização',
    texto: 'Equipe sempre atualizada com os melhores e mais recentes produtos para indicar e explicar.',
  },
  {
    icon: pintura,
    titulo: 'Pintura & Proteção',
    texto: 'A tinta certa para cada caso, impermeabilizantes e vernizes. Conte com as dicas do nosso time.',
  },
  {
    icon: ferramentasIcon,
    titulo: 'Ferramentas',
    texto: 'Comprar online é ótimo, mas comprar ao vivo é melhor ainda: garantia da escolha certa.',
  },
  {
    icon: ferragens,
    titulo: 'Ferragens',
    texto: 'Milhares de opções de ferragens para aplicações em todo tipo de material.',
  },
]

const NUMEROS = [
  { valor: '+30', legenda: 'anos de experiência' },
  { valor: '+100 mil', legenda: 'clientes satisfeitos' },
  { valor: '+150', legenda: 'entregas ao mês' },
  { valor: '12 ton', legenda: 'entregues mensalmente' },
]

const CATEGORIAS = [
  { img: hidraulica, titulo: 'Elétrica / Hidráulica' },
  { img: acabamento, titulo: 'Acabamentos' },
  { img: iluminacao, titulo: 'Decoração' },
]

const PROJETOS = [
  { src: ex1, alt: 'Ambiente reformado 1' },
  { src: ex2, alt: 'Ambiente reformado 2' },
  { src: ex3, alt: 'Ambiente reformado 3' },
]

function Home() {
  useScrollReveal()

  return (
    <main>
      <section id="presentation" className="hero">
        <picture className="hero__media">
          <source media="(max-width: 760px)" srcSet={heroMobile} />
          <img
            src={heroDesktop}
            alt=""
            width="1256"
            height="1052"
            fetchPriority="high"
            decoding="async"
          />
        </picture>
        <div className="hero__overlay">
          <div className="container hero__content">
            <p className="hero__kicker reveal">Materiais de construção</p>
            <h1 className="reveal reveal-delay-1">
              <span className="hero__highlight">Reformar,</span>
              <br /> construir e curtir.
            </h1>
            <p className="hero__subtitle reveal reveal-delay-2">
              Tudo o que sua obra precisa em um só lugar, com atendimento
              especializado do início ao acabamento.
            </p>
            <div className="hero__actions reveal reveal-delay-3">
              <a href="#servicos" className="btn btn--primary">Conheça nossos serviços</a>
              <Link to="/contato" className="btn btn--on-dark">Fale conosco</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section services-section" id="servicos">
        <div className="container">
          <div className="section-header reveal">
            <p className="eyebrow">Tudo num só lugar</p>
            <h2>O atendimento personalizado é seu melhor aliado na hora da compra.</h2>
          </div>
          <div className="services-grid">
            {SERVICOS.map((s, i) => (
              <div className={`service-card reveal reveal-delay-${(i % 3) + 1}`} key={s.titulo}>
                <div className="service-card__icon">
                  <img src={s.icon} alt="" aria-hidden="true" />
                </div>
                <h3>{s.titulo}</h3>
                <p>{s.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section gallery-section">
        <div className="container">
          <div className="section-header reveal">
            <p className="eyebrow">Nosso trabalho</p>
            <h2>Projetos entregues com cuidado e precisão.</h2>
          </div>
          <div className="reveal reveal--fade">
            <ProjectsCarousel items={PROJETOS} />
          </div>
        </div>
      </section>

      <section className="section phases-section">
        <div className="container phases-section__inner reveal">
          <h2>Para todas as fases, do alicerce ao telhado.</h2>
          <p>Você encontra tudo aqui, com quem realmente entende de obra.</p>
        </div>
      </section>

      <section className="section stats-section">
        <div className="container stats-section__grid">
          <div className="stats-section__media reveal reveal--zoom">
            <img src={infop} alt="Ferramentas e materiais de construção" />
          </div>
          <div className="stats-section__numbers">
            {NUMEROS.map((n, i) => (
              <div className={`stat-card reveal reveal-delay-${(i % 3) + 1}`} key={n.legenda}>
                <h3>{n.valor}</h3>
                <p>{n.legenda}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section categories-section">
        <div className="container">
          <div className="section-header reveal">
            <p className="eyebrow">Explore por categoria</p>
            <h2>Encontre exatamente o que precisa.</h2>
          </div>
          <div className="categories-grid">
            {CATEGORIAS.map((c, i) => (
              <Link
                to="/produtos"
                className={`category-card reveal reveal--zoom reveal-delay-${(i % 3) + 1}`}
                key={c.titulo}
              >
                <img src={c.img} alt={c.titulo} />
                <div className="category-card__label">
                  <span>{c.titulo}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home
