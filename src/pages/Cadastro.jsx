import { useState } from 'react'
import { Link } from 'react-router-dom'
import googleIcon from '../assets/google-icon.webp'
import './login.css'

export default function Cadastro() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [erro, setErro] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!nome || !email || !senha || !confirmarSenha) {
      setErro('Preencha todos os campos para continuar.')
      return
    }
    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem.')
      return
    }
    setErro('')
    // TODO: integrar com o backend de cadastro de usuários (API própria,
    // Firebase, Supabase, etc.). Por enquanto a interface apenas valida
    // os campos localmente: authService.cadastrar({ nome, email, senha }).
    console.log('Cadastro (aguardando integração com backend)', { nome, email })
  }

  function handleGoogleCadastro() {
    // TODO: integrar com o provedor de OAuth do Google quando o backend
    // estiver disponível.
    console.log('Cadastrar com Google (aguardando integração com backend)')
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">Criar conta</h1>

        {erro && (
          <p className="auth-card__error" role="alert">
            {erro}
          </p>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <label className="auth-field">
            <span>Nome</span>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite seu nome completo"
              autoComplete="name"
              required
            />
          </label>

          <label className="auth-field">
            <span>E-mail</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu e-mail"
              autoComplete="email"
              required
            />
          </label>

          <label className="auth-field">
            <span>Senha</span>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Crie uma senha"
              autoComplete="new-password"
              required
            />
          </label>

          <label className="auth-field">
            <span>Confirmar senha</span>
            <input
              type="password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              placeholder="Repita a senha"
              autoComplete="new-password"
              required
            />
          </label>

          <button type="submit" className="btn btn--primary auth-form__submit">
            Cadastrar
          </button>
        </form>

        <div className="auth-divider">
          <span>ou</span>
        </div>

        <button type="button" className="auth-google-btn" onClick={handleGoogleCadastro}>
          <img src={googleIcon} alt="" className="auth-google-btn__icon" />
          Continuar com Google
        </button>

        <p className="auth-card__footer-text">
          Já tem uma conta? <Link to="/login">Entrar</Link>
        </p>
      </div>
    </main>
  )
}
