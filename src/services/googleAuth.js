// Login com Google usando o Google Identity Services (OAuth 2.0, janela popup).
//
// Para funcionar em produção é preciso configurar (nada disso está no código):
//   1. Criar um "ID do cliente OAuth" do tipo "Aplicativo da Web" em
//      https://console.cloud.google.com/apis/credentials
//   2. Em "Origens JavaScript autorizadas", cadastrar http://localhost:5173
//      (desenvolvimento) e o domínio final do site.
//   3. Copiar o ID do cliente para VITE_GOOGLE_CLIENT_ID no arquivo .env
//      (modelo em .env.example) e reiniciar o `npm run dev`.
//
// Importante: o token devolvido aqui prova que o usuário autorizou o Google
// no navegador, mas NÃO cria uma sessão no site. O backend precisa receber o
// token, validá-lo com o Google e só então autenticar o usuário.

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const GSI_URL = 'https://accounts.google.com/gsi/client'
const USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo'

export const googleConfigurado = Boolean(CLIENT_ID)

let scriptPromise

// Carrega o script oficial do Google uma única vez. É chamado quando a tela
// de login abre, para o popup abrir logo no clique (navegadores bloqueiam
// popups que demoram demais depois do gesto do usuário).
export function prepararGoogle() {
  if (window.google?.accounts?.oauth2) return Promise.resolve()
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = GSI_URL
      script.async = true
      script.onload = resolve
      script.onerror = () => {
        scriptPromise = undefined
        script.remove()
        reject(new Error('GOOGLE_SCRIPT'))
      }
      document.head.appendChild(script)
    })
  }
  return scriptPromise
}

// Abre o fluxo oficial de autorização do Google e devolve o token e os dados
// básicos da conta. Lança Error com um código (ex.: GOOGLE_NAO_CONFIGURADO,
// popup_closed, popup_failed_to_open) para a tela mostrar a mensagem certa.
export async function entrarComGoogle() {
  if (!CLIENT_ID) throw new Error('GOOGLE_NAO_CONFIGURADO')

  await prepararGoogle()

  const token = await new Promise((resolve, reject) => {
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: 'openid email profile',
      callback: (resposta) =>
        resposta.error ? reject(new Error(resposta.error)) : resolve(resposta),
      error_callback: (erro) => reject(new Error(erro?.type || 'GOOGLE_ERRO')),
    })
    client.requestAccessToken()
  })

  const resposta = await fetch(USERINFO_URL, {
    headers: { Authorization: `Bearer ${token.access_token}` },
  })
  if (!resposta.ok) throw new Error('GOOGLE_PERFIL')
  const perfil = await resposta.json()

  return { accessToken: token.access_token, email: perfil.email, nome: perfil.name }
}
