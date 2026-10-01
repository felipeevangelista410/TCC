import { useState } from 'react'
import nisseiloja from '../assets/img-loja.webp'
import antes from '../assets/antes.webp'
import depois from '../assets/depois.webp'
import fundadora from '../assets/fundadora.jpeg'
import { useScrollReveal } from '../hooks/useScrollReveal'
import './Sobre.css'

const NUMEROS = [
  { valor: '1995', legenda: 'ano de fundação' },
  { valor: '32', legenda: 'anos de história' },
  { valor: '+100 mil', legenda: 'clientes satisfeitos' },
  { valor: '+150', legenda: 'entregas ao mês' },
]

const HISTORIA = [
  {
    titulo: 'O começo',
    texto:
      'Nossa trajetória começa com o sonho de empreender e construir algo sólido, baseado em trabalho, dedicação e valores familiares. Inspirados pela experiência no ramo de materiais de construção e movidos pelo desejo de recomeçar no Brasil, iniciamos nossas atividades em um pequeno espaço alugado no ano de 1995.',
  },
  {
    titulo: 'Crescimento',
    texto:
      'Com esforço constante e o apoio dos clientes que acreditaram em nosso trabalho, a empresa foi crescendo e conquistando seu espaço. Pouco tempo depois, conseguimos adquirir nosso próprio terreno, onde consolidamos nossa loja e seguimos evoluindo junto com o bairro, que também se desenvolveu rapidamente ao longo dos anos.',
  },
  {
    titulo: 'Evolução constante',
    texto:
      'Acreditamos que crescer significa se adaptar. Por isso, passamos por constantes melhorias e modernizações, desde a estrutura física da loja até a forma de atender nossos clientes, sempre buscando mais praticidade, organização e qualidade no atendimento.',
  },
  {
    titulo: 'Força da família',
    texto:
      'Nossa história também é marcada pela força da família. Ao longo dos anos, construímos um modelo de gestão baseado na sucessão familiar, onde experiência e inovação caminham lado a lado. Essa união entre gerações nos permite manter nossos valores originais, ao mesmo tempo em que incorporamos novas ideias e tecnologias, como o atendimento digital e soluções mais ágeis para nossos clientes.',
  },
  {
    titulo: 'Hoje',
    texto:
      'Hoje, seguimos firmes com o mesmo propósito que deu início a tudo: oferecer um atendimento de confiança, próximo e de qualidade, construindo não apenas uma empresa, mas uma história sólida baseada em respeito, evolução e parceria com cada cliente que faz parte da nossa caminhada.',
  },
]

function Sobre() {
  useScrollReveal()
  const [pos, setPos] = useState(50)

  return (
    <main className="sobre-page">
      <section className="sobre-hero">
        <div className="container sobre-hero__grid">
          <div className="sobre-hero__text reveal">
            <p className="eyebrow">Quem somos</p>
            <h1>Nikkei</h1>
            <p className="sobre-hero__lead">
              Estamos em constante renovação para proporcionar experiências
              cada vez melhores a quem confia em nosso trabalho. Cada detalhe
              desta transformação é pensado com dedicação, cuidado e
              compromisso, para oferecer mais conforto, qualidade e excelência
              aos clientes que nos prestigiam. Evoluir faz parte da nossa
              essência, porque acreditamos que sempre é possível entregar mais
              do que o esperado e tornar cada experiência ainda mais especial.
            </p>
            <ul className="sobre-fatos" aria-label="A Nikkei em números">
              {NUMEROS.map((n) => (
                <li key={n.legenda}>
                  <strong>{n.valor}</strong>
                  <span>{n.legenda}</span>
                </li>
              ))}
            </ul>
          </div>
          <figure className="sobre-hero__media reveal reveal-delay-1">
            <img src={nisseiloja} alt="Fachada da loja Nikkei" />
          </figure>
        </div>
      </section>

      <section className="sobre-historia">
        <div className="container">
          <div className="sobre-historia__head reveal">
            <p className="eyebrow">Nossa jornada</p>
            <h2>Conheça nossa história</h2>
          </div>

          <ol className="sobre-historia__lista">
            {HISTORIA.map((item, i) => (
              <li className="sobre-historia__item reveal" key={item.titulo}>
                <span className="sobre-historia__num">{String(i + 1).padStart(2, '0')}</span>
                <h3>{item.titulo}</h3>
                <p>{item.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="sobre-transformacao">
        <div className="container sobre-transformacao__grid">
          <div className="sobre-transformacao__texto reveal">
            <p className="eyebrow">A transformação</p>
            <h2>Antes e depois da nossa loja</h2>
            
          </div>

          <div
            className="sobre-compare reveal reveal-delay-1"
            style={{ '--pos': `${pos}%` }}
          >
            <img className="sobre-compare__img" src={depois} alt="Loja depois da reforma" />
            <div className="sobre-compare__before">
              <img className="sobre-compare__img" src={antes} alt="Loja antes da reforma" />
            </div>
            <span className="sobre-compare__tag sobre-compare__tag--before">Antes</span>
            <span className="sobre-compare__tag sobre-compare__tag--after">Depois</span>
            <span className="sobre-compare__line" aria-hidden="true">
              <span className="sobre-compare__handle">‹ ›</span>
            </span>
            <input
              type="range"
              min="0"
              max="100"
              value={pos}
              onChange={(e) => setPos(Number(e.target.value))}
              aria-label="Arraste para comparar a loja antes e depois da reforma"
              className="sobre-compare__range"
            />
          </div>
        </div>
      </section>

      <section className="sobre-fundadora">
        <div className="container sobre-fundadora__grid">
          <figure className="sobre-fundadora__foto reveal">
            <img src={fundadora} alt="Paolla Sakuma, CEO da Nikkei" />
          </figure>
          <div className="sobre-fundadora__texto reveal reveal-delay-1">
            <h2>Paolla Sakuma</h2>
            <p className="sobre-fundadora__cargo">CEO</p>
            <blockquote>
              <p>
                “Cresci vendo meus pais transformarem trabalho em propósito.
                Cada cliente atendido, cada entrega realizada e cada conquista
                construída ao longo dos anos fizeram da nossa história muito
                mais do que um negócio: fizeram nascer um legado familiar
                baseado em confiança, dedicação e respeito pelas pessoas.
              </p>
              <p>
                Hoje, ter a oportunidade de continuar essa trajetória ao lado
                da minha família é motivo de muito orgulho e também de
                responsabilidade. Meu desejo é preservar os valores que
                construíram nossa empresa desde o início, mas sempre olhando
                para o futuro, buscando inovação, evolução e novas formas de
                atender cada vez melhor nossos clientes.
              </p>
              <p>
                Acredito que uma empresa familiar carrega algo especial: ela
                transmite verdade, proximidade e compromisso. Seguiremos
                crescendo sem esquecer nossas raízes, honrando tudo o que foi
                construído até aqui e preparando o caminho para as próximas
                gerações.”
              </p>
            </blockquote>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Sobre
