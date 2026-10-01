import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import googleIcon from '../assets/google-icon.webp'
import { entrarComGoogle, googleConfigurado, prepararGoogle } from '../services/googleAuth'
import './login.css'

// Formato razoável de e-mail: texto com pontos só entre caracteres (sem ponto no
// começo, no fim ou repetido), "@", domínio com ao menos um ponto e final de 2+
// letras. Melhora a experiência no formulário, mas não é segurança: o backend
// precisa validar o e-mail de novo.
const EMAIL_REGEX =
  /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/

const MSG_EMAIL_INVALIDO = 'Digite um e-mail válido.'

function emailValido(valor) {
  return valor.length <= 254 && EMAIL_REGEX.test(valor)
}

// Traduz os códigos de erro do serviço do Google em mensagens para o usuário.
function mensagemErroGoogle(erro) {
  switch (erro.message) {
    case 'GOOGLE_NAO_CONFIGURADO':
      return 'O login com Google ainda não está configurado neste site.'
    case 'popup_closed':
      return 'A janela do Google foi fechada antes de concluir o login.'
    case 'popup_failed_to_open':
      return 'Não foi possível abrir a janela do Google. Verifique se o navegador bloqueou pop-ups.'
    case 'GOOGLE_SCRIPT':
      return 'Não foi possível carregar o login do Google. Verifique sua conexão.'
    default:
      return 'Não foi possível entrar com o Google. Tente novamente.'
  }
}

export default function Login() {
  const [view, setView] = useState('login') // 'login' | 'recuperar'

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [erro, setErro] = useState('')
  const [erroEmail, setErroEmail] = useState('')
  const [aviso, setAviso] = useState('')
  const [googleCarregando, setGoogleCarregando] = useState(false)
  const emailRef = useRef(null)

  const [emailRecuperacao, setEmailRecuperacao] = useState('')
  const [erroEmailRecuperacao, setErroEmailRecuperacao] = useState('')
  const [statusRecuperacao, setStatusRecuperacao] = useState('')

  // Já carrega o script do Google ao abrir a tela, para o popup abrir
  // imediatamente no clique. Falha de rede aqui é tratada no próprio clique.
  useEffect(() => {
    if (googleConfigurado) prepararGoogle().catch(() => {})
  }, [])

  function handleLogin(e) {
    e.preventDefault()
    setAviso('')
    if (!emailValido(email.trim())) {
      setErro('')
      setErroEmail(MSG_EMAIL_INVALIDO)
      emailRef.current?.focus()
      return
    }
    setErroEmail('')
    if (!senha) {
      setErro('Digite sua senha para continuar.')
      return
    }
    setErro('')
    // TODO: integrar com o backend de autenticação (API própria, Firebase,
    // Supabase, etc.). Por enquanto não há servidor conectado, então a
    // interface apenas valida os campos e mantém o estado pronto para a
    // futura chamada: authService.login({ email, senha }).
    console.log('Login (aguardando integração com backend)', { email })
  }

  async function handleGoogleLogin() {
    setErro('')
    setAviso('')
    if (!googleConfigurado) {
      console.warn(
        'Login com Google não configurado: defina VITE_GOOGLE_CLIENT_ID no .env (veja .env.example e o README).'
      )
    }
    setGoogleCarregando(true)
    try {
      const conta = await entrarComGoogle()
      // TODO: enviar conta.accessToken ao backend, que deve validá-lo com o
      // Google e criar a sessão do usuário. Sem backend, o site só consegue
      // confirmar qual conta Google foi autorizada.
      setAviso(
        `Conta Google autorizada: ${conta.email}. O site ainda não tem servidor para criar a sessão de login.`
      )
    } catch (erroGoogle) {
      setErro(mensagemErroGoogle(erroGoogle))
    } finally {
      setGoogleCarregando(false)
    }
  }

  function handleRecuperar(e) {
    e.preventDefault()
    if (!emailValido(emailRecuperacao.trim())) {
      setStatusRecuperacao('')
      setErroEmailRecuperacao(MSG_EMAIL_INVALIDO)
      return
    }
    setErroEmailRecuperacao('')
    // TODO: chamar o endpoint/serviço real de recuperação de senha
    // (ex.: authService.recuperarSenha(emailRecuperacao)) quando o
    // backend estiver disponível.
    console.log('Recuperação de senha (aguardando integração com backend)', {
      emailRecuperacao,
    })
    setStatusRecuperacao(
      'Recuperação de senha ainda não conectada a um servidor. Assim que a integração estiver pronta, você receberá as instruções por e-mail.'
    )
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        {view === 'login' ? (
          <>
            <h1 className="auth-card__title">Entrar</h1>

            {erro && (
              <p className="auth-card__error" role="alert">
                {erro}
              </p>
            )}
            {aviso && (
              <p className="auth-card__status auth-card__status--spaced" role="status">
                {aviso}
              </p>
            )}

            <form className="auth-form" onSubmit={handleLogin} noValidate>
              <label className="auth-field">
                <span>E-mail</span>
                <input
                  ref={emailRef}
                  type="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (erroEmail && emailValido(e.target.value.trim())) setErroEmail('')
                  }}
                  onBlur={() => {
                    if (email && !emailValido(email.trim())) setErroEmail(MSG_EMAIL_INVALIDO)
                  }}
                  placeholder="Digite seu e-mail"
                  autoComplete="email"
                  aria-invalid={Boolean(erroEmail)}
                  aria-describedby={erroEmail ? 'login-email-erro' : undefined}
                  required
                />
                {erroEmail && (
                  <span id="login-email-erro" className="auth-field__error" role="alert">
                    {erroEmail}
                  </span>
                )}
              </label>

              <label className="auth-field">
                <span>Senha</span>
                <div className="auth-field__password">
                  <input
                    type={mostrarSenha ? 'text' : 'password'}
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="Digite sua senha"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="auth-field__toggle-visibility"
                    aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                    aria-pressed={mostrarSenha}
                    onClick={() => setMostrarSenha((v) => !v)}
                  >
                    {mostrarSenha ? (
                      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                        <path
                          fill="currentColor"
                          d="M12 6c-5 0-9.27 3.11-11 7 1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7Zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10Zm0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                        />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                        <path
                          fill="currentColor"
                          d="m2.1 3.51 1.41-1.42 18.4 18.4-1.41 1.42-3.02-3.02A11.6 11.6 0 0 1 12 20c-5 0-9.27-3.11-11-7a12.3 12.3 0 0 1 4.53-5.36L2.1 3.51ZM12 8a5 5 0 0 1 5 5c0 .64-.13 1.25-.36 1.8l-1.55-1.55A2.99 2.99 0 0 0 12 10c-.1 0-.2 0-.3.02L10.15 8.47c.58-.3 1.2-.47 1.85-.47Zm0-4c5 0 9.27 3.11 11 7a12.3 12.3 0 0 1-2.7 3.9l-1.44-1.44A10.3 10.3 0 0 0 20.82 11 10.6 10.6 0 0 0 12 6c-.86 0-1.7.08-2.5.24L7.9 4.66C9.19 4.24 10.56 4 12 4ZM4.2 6.6l1.46 1.46A10.3 10.3 0 0 0 3.18 11 10.6 10.6 0 0 0 12 16c.4 0 .8-.02 1.18-.07l1.65 1.65c-.9.27-1.86.42-2.83.42-5 0-9.27-3.11-11-7 .77-1.72 1.95-3.2 3.4-4.4Z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </label>

              <button type="submit" className="btn btn--primary auth-form__submit">
                Entrar
              </button>
            </form>

            <button
              type="button"
              className="auth-card__link"
              onClick={() => {
                setStatusRecuperacao('')
                setView('recuperar')
              }}
            >
              Esqueceu sua senha?
            </button>

            <div className="auth-divider">
              <span>ou</span>
            </div>

            <button
              type="button"
              className="auth-google-btn"
              onClick={handleGoogleLogin}
              disabled={googleCarregando}
            >
              <img src={googleIcon} alt="" className="auth-google-btn__icon" />
              Continuar com Google
            </button>

            <p className="auth-card__footer-text">
              Não tem uma conta? <Link to="/cadastro">Cadastre-se</Link>
            </p>
          </>
        ) : (
          <>
            <button
              type="button"
              className="auth-card__back"
              onClick={() => setView('login')}
              aria-label="Voltar para o login"
            >
              ← Voltar
            </button>

            <h1 className="auth-card__title">Recuperar senha</h1>
            <p className="auth-card__subtitle">
              Informe o e-mail da sua conta para receber as instruções de
              redefinição de senha.
            </p>

            <form className="auth-form" onSubmit={handleRecuperar} noValidate>
              <label className="auth-field">
                <span>E-mail</span>
                <input
                  type="email"
                  inputMode="email"
                  value={emailRecuperacao}
                  onChange={(e) => {
                    setEmailRecuperacao(e.target.value)
                    if (erroEmailRecuperacao && emailValido(e.target.value.trim())) {
                      setErroEmailRecuperacao('')
                    }
                  }}
                  placeholder="Digite seu e-mail"
                  autoComplete="email"
                  aria-invalid={Boolean(erroEmailRecuperacao)}
                  aria-describedby={erroEmailRecuperacao ? 'recuperar-email-erro' : undefined}
                  required
                />
                {erroEmailRecuperacao && (
                  <span id="recuperar-email-erro" className="auth-field__error" role="alert">
                    {erroEmailRecuperacao}
                  </span>
                )}
              </label>

              <button type="submit" className="btn btn--primary auth-form__submit">
                Enviar instruções
              </button>

              {statusRecuperacao && (
                <p className="auth-card__status" role="status" aria-live="polite">
                  {statusRecuperacao}
                </p>
              )}
            </form>
          </>
        )}
      </div>
    </main>
  )
}
