import { useState } from 'react'
import mapa from '../assets/local.webp'
import { useScrollReveal } from '../hooks/useScrollReveal'
import './Contato.css'

function Contato() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [status, setStatus] = useState('')

  useScrollReveal()

  const lidarComEnvio = (e) => {
    e.preventDefault()
    if (!nome || !email || !mensagem) {
      setStatus('Por favor, preencha todos os campos.')
      return
    }
    console.log({ nome, email, mensagem })
    setStatus('Mensagem enviada com sucesso! (simulação)')

    setNome('')
    setEmail('')
    setMensagem('')
  }

  return (
    <main className="contato-page">
      <section className="contato-hero">
        <div className="container reveal">
          <p className="eyebrow">Fale com a gente</p>
          <h1>Vamos planejar sua próxima obra?</h1>
          <p className="contato-hero__subtitle">
            Estamos por perto e prontos para ajudar em cada etapa do seu
            projeto.
          </p>
        </div>
      </section>

      <section className="section contato-info-section">
        <div className="container contato-grid">
          <a
            className="contato-card contato-card--map reveal"
            href="https://www.google.com/maps/place/Grupo+Nikkei+Nissei+1+-+Materiais+para+Constru%C3%A7%C3%A3o/@-22.9515018,-47.1905298,17z/data=!3m1!4b1!4m6!3m5!1s0x94c8b76cdaaa527f:0x803cf5b0a10ba87!8m2!3d-22.9515068!4d-47.1879495!16s%2Fg%2F1q62h_1h0?entry=ttu&g_ep=EgoyMDI2MDYwMS4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={mapa} alt="Mapa de localização da loja Nikkei" />
            <span className="contato-card--map__label">Ver no Google Maps ↗</span>
          </a>

          <div className="contato-card contato-card--info reveal reveal-delay-1">
            <h3>Endereço</h3>
            <p>R. Edson Luiz Rigonatto, 1295 — Jd. Sta. Clara, Campinas/SP</p>
            <h3>E-mail</h3>
            <p>vendas.n1@gruponikkei.com.br</p>
            <h3>Horário de atendimento</h3>
            <p>
              Segunda a sexta, das 7h30 às 17h30
              <br />
              Sábado, das 7h30 às 12h
              <br />
              Domingo: fechado
            </p>
          </div>
        </div>
      </section>

      <section className="section contato-form-section">
        <div className="container contato-form-section__inner reveal">
          <div className="contato-form-section__intro">
            <h2>Que itens você precisa orçar?</h2>
            <p>Conte um pouco sobre o seu projeto e retornamos rapidinho.</p>
          </div>

          <form className="contato-form" onSubmit={lidarComEnvio} noValidate>
            <label className="contato-form__field">
              <span>Nome</span>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome completo"
                autoComplete="name"
                required
              />
            </label>

            <label className="contato-form__field">
              <span>E-mail</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@email.com"
                autoComplete="email"
                required
              />
            </label>

            <label className="contato-form__field">
              <span>Mensagem</span>
              <textarea
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                rows="5"
                placeholder="Descreva os itens e quantidades que você precisa"
                required
              />
            </label>

            <button type="submit" className="btn btn--primary contato-form__submit">
              Enviar
            </button>

            {status && (
              <p className="contato-form__status" role="status" aria-live="polite">
                {status}
              </p>
            )}
          </form>
        </div>
      </section>
    </main>
  )
}

export default Contato
