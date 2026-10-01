import { useEffect, useRef, useState } from 'react'
import iconeSuporte from '../assets/suporte-tecnico.png'
import './AiWidget.css'

const SUGESTOES = [
  'Qual material é ideal para uma parede externa?',
  'Como calcular a quantidade de pisos?',
  'Qual o melhor cimento para minha obra?',
]

// botão de suporte fixo no canto da tela — abre um painel de chat compacto
function AiWidget() {
  const [open, setOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState([])
  const toggleRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  function ask(event, valorForcado) {
    event?.preventDefault()
    const valor = (valorForcado ?? question).trim()
    if (!valor) return
    setMessages((items) => [
      ...items,
      { from: 'user', text: valor },
      {
        from: 'ai',
        text: 'Vou te ajudar a encontrar o material certo. Me diga o ambiente e as medidas da obra para uma recomendação mais precisa.',
      },
    ])
    setQuestion('')
  }

  return (
    <div className="ai-widget">
      {open && (
        <div
          className="ai-widget__panel"
          role="dialog"
          aria-modal="false"
          aria-label="Assistente de IA"
        >
          <header className="ai-widget__header">
            <div>
              <p className="ai-widget__title">Suporte com IA</p>
              <p className="ai-widget__subtitle">Como posso ajudar?</p>
            </div>
            <button
              type="button"
              className="ai-widget__close"
              aria-label="Fechar assistente"
              onClick={() => {
                setOpen(false)
                toggleRef.current?.focus()
              }}
            >
              ✕
            </button>
          </header>

          <div className="ai-widget__body">
            {messages.length === 0 ? (
              <div className="ai-widget__empty">
                <p>Tire dúvidas sobre materiais, quantidades e recomendações para sua obra.</p>
                <div className="ai-widget__suggestions">
                  {SUGESTOES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className="ai-widget__chip"
                      onClick={(e) => ask(e, s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="ai-widget__messages" aria-live="polite">
                {messages.map((m, i) => (
                  <div key={i} className={`ai-widget__message ${m.from}`}>
                    {m.text}
                  </div>
                ))}
              </div>
            )}
          </div>

          <form className="ai-widget__form" onSubmit={ask}>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Digite aqui..."
              aria-label="Digite sua dúvida"
              className="ai-widget__input"
            />
            <button type="submit" className="ai-widget__send" aria-label="Enviar pergunta">
              ➤
            </button>
          </form>
        </div>
      )}

      <button
        ref={toggleRef}
        type="button"
        className="ai-widget__toggle"
        aria-label={open ? 'Fechar assistente de IA' : 'Precisa de ajuda? Abrir assistente de IA'}
        aria-expanded={open}
        data-tooltip="Precisa de ajuda?"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? (
          '✕'
        ) : (
          <img src={iconeSuporte} alt="" aria-hidden="true" className="ai-widget__toggle-icon" />
        )}
      </button>
    </div>
  )
}

export default AiWidget
