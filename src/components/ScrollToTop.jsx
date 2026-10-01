import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

// O React Router não recarrega a página ao trocar de rota, então o
// navegador mantém a posição de scroll de onde o usuário estava.
// Isso volta pro topo a cada navegação.
//
// Repetimos por alguns frames (em vez de uma chamada só) porque as
// imagens da página nova ainda estão carregando e mudam a altura do
// layout — o navegador reajusta o scroll pra compensar e acaba
// desfazendo um scrollTo único.
function ScrollToTop() {
  const { pathname } = useLocation()
  const frameRef = useRef(null)

  useEffect(() => {
    const html = document.documentElement
    const previousBehavior = html.style.scrollBehavior
    // desliga o smooth scroll do CSS pra esse jump ser instantâneo
    html.style.scrollBehavior = 'auto'

    let framesLeft = 12 // ~200ms
    function forceTop() {
      window.scrollTo(0, 0)
      framesLeft -= 1
      if (framesLeft > 0) {
        frameRef.current = requestAnimationFrame(forceTop)
      } else {
        html.style.scrollBehavior = previousBehavior
      }
    }
    forceTop()

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
      html.style.scrollBehavior = previousBehavior
    }
  }, [pathname])

  return null
}

export default ScrollToTop
