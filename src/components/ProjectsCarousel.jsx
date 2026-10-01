import { useCallback, useEffect, useRef, useState } from 'react'
import './ProjectsCarousel.css'

const SIDE_SCALE = 0.82 // slide lateral tem ~82% do tamanho do central
const DRAG_THRESHOLD = 45 // px de arraste pra trocar de slide
const MAX_OVERSHOOT = 1.25 // até onde deixa "esticar" antes de soltar
const AUTOPLAY_MS = 5000 // tempo parado em cada projeto antes de passar sozinho

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function lerp(a, b, t) {
  return a + (b - a) * t
}

// Carrossel "coverflow": central maior e nítida, laterais menores com
// blur. Arraste funciona com mouse e touch (Pointer Events cobre os
// dois), sem depender de nenhuma lib de carrossel. Passa sozinho a cada
// AUTOPLAY_MS enquanto está visível; pausa com o mouse em cima, foco do
// teclado ou arraste, e qualquer troca manual reinicia a contagem.
function ProjectsCarousel({ items, aspectRatio = 1080 / 757 }) {
  const length = items.length
  const [activeIndex, setActiveIndex] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [hasKeyboardFocus, setHasKeyboardFocus] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [reduceMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  const trackRef = useRef(null)
  const dragState = useRef({ startX: 0, startY: 0, axis: null, pointerId: null, dragged: false })

  useEffect(() => {
    const el = trackRef.current
    if (!el) return undefined

    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect?.width
      if (width) setContainerWidth(width)
    })
    observer.observe(el)
    setContainerWidth(el.clientWidth)

    return () => observer.disconnect()
  }, [])

  // Só passa sozinho enquanto está na tela: quem chega na seção vê o primeiro
  // projeto pelo tempo inteiro, e nada se mexe fora da vista.
  useEffect(() => {
    const el = trackRef.current
    if (!el) return undefined
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const goTo = useCallback(
    (nextIndex) => {
      setActiveIndex(((nextIndex % length) + length) % length)
    },
    [length]
  )

  const goNext = useCallback(() => goTo(activeIndex + 1), [goTo, activeIndex])
  const goPrev = useCallback(() => goTo(activeIndex - 1), [goTo, activeIndex])

  // Troca sozinho. Como goNext muda quando activeIndex muda, o timer é
  // recriado a cada troca (inclusive as manuais), então depois de uma
  // interação o automático só volta a andar depois de um intervalo inteiro.
  const autoplayPaused = !isInView || isHovered || hasKeyboardFocus || isDragging
  useEffect(() => {
    if (length < 2 || reduceMotion || autoplayPaused) return undefined
    const timer = setTimeout(goNext, AUTOPLAY_MS)
    return () => clearTimeout(timer)
  }, [length, reduceMotion, autoplayPaused, goNext])

  const isMobile = containerWidth > 0 && containerWidth < 640
  const isTablet = containerWidth >= 640 && containerWidth < 1024
  const centerRatio = isMobile ? 0.64 : isTablet ? 0.5 : 0.4
  const centerWidth = containerWidth * centerRatio || 0
  const sideWidth = centerWidth * SIDE_SCALE
  const slotDistance = (centerWidth + sideWidth) / 2 + (isMobile ? 14 : 24)
  const centerHeight = centerWidth / aspectRatio

  function onPointerDown(e) {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    dragState.current = {
      startX: e.clientX,
      startY: e.clientY,
      axis: null,
      pointerId: e.pointerId,
      dragged: false,
    }
  }

  function onPointerMove(e) {
    const state = dragState.current
    if (state.pointerId !== e.pointerId) return
    if (state.axis === 'y') return

    const dx = e.clientX - state.startX
    const dy = e.clientY - state.startY

    if (state.axis === null) {
      // Só decide a direção do gesto depois de um pequeno deslocamento,
      // para não capturar toques que na verdade eram scroll vertical.
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return
      state.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'
      if (state.axis === 'y') return
      trackRef.current?.setPointerCapture?.(e.pointerId)
      setIsDragging(true)
    }

    e.preventDefault()
    state.dragged = true
    const maxDrag = slotDistance * MAX_OVERSHOOT
    setDragOffset(clamp(dx, -maxDrag, maxDrag))
  }

  function endDrag(e) {
    const state = dragState.current
    if (state.axis === 'x') {
      if (dragOffset <= -DRAG_THRESHOLD) goNext()
      else if (dragOffset >= DRAG_THRESHOLD) goPrev()
    }
    setIsDragging(false)
    setDragOffset(0)
    if (e?.pointerId != null) {
      try {
        trackRef.current?.releasePointerCapture?.(e.pointerId)
      } catch {
        /* pointer já liberado, ignorar */
      }
    }
    dragState.current = { startX: 0, startY: 0, axis: null, pointerId: null, dragged: state.dragged }
  }

  function onSlideClick(e, index) {
    // Evita que o "solto" de um arraste seja interpretado como clique.
    if (dragState.current.dragged) {
      e.preventDefault()
      return
    }
    if (index !== activeIndex) goTo(index)
  }

  function onKeyDown(e) {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      goNext()
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      goPrev()
    }
  }

  return (
    <div
      className="pf-carousel"
      // hover só pausa com mouse: no celular o "hover" fica preso após o toque
      onPointerEnter={(e) => e.pointerType === 'mouse' && setIsHovered(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setIsHovered(false)}
      // foco só pausa pelo teclado: tocar num botão no celular não trava o automático
      onFocus={(e) => setHasKeyboardFocus(e.target.matches(':focus-visible'))}
      onBlur={() => setHasKeyboardFocus(false)}
    >
      <div className="pf-carousel__row">
        <button
          type="button"
          className="pf-arrow pf-arrow--prev"
          aria-label="Projeto anterior"
          onClick={goPrev}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path fill="currentColor" d="M15.5 4.5 7 13l8.5 8.5 1.4-1.4L9.8 13l7.1-7.1z" />
          </svg>
        </button>

        <div
          className={`pf-track${isDragging ? ' is-dragging' : ''}`}
          ref={trackRef}
          style={{ height: centerHeight ? `${centerHeight}px` : undefined }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={(e) => {
            if (dragState.current.axis === 'x') endDrag(e)
          }}
          role="group"
          aria-roledescription="carrossel"
          aria-label="Carrossel de projetos"
          tabIndex={0}
          onKeyDown={onKeyDown}
        >
          {items.map((item, index) => {
            // Deslocamento circular do item em relação ao centro: 0 = central,
            // 1 = lateral direita, -1 = lateral esquerda (com loop infinito).
            const half = Math.floor(length / 2)
            let off = ((index - activeIndex + length + half) % length) - half
            if (dragOffset !== 0) {
              off += dragOffset / (slotDistance || 1)
            }

            const absOff = Math.abs(off)
            const t = clamp(absOff, 0, 1)
            const width = lerp(centerWidth, sideWidth, t) || undefined
            const height = width ? width / aspectRatio : undefined
            const opacity = lerp(1, 0.5, t)
            const blur = lerp(0, 5.5, t)
            const translateX = off * slotDistance
            const zIndex = Math.round((1 - Math.min(absOff, 1)) * 10) + 1
            const isCenter = t < 0.5

            return (
              <button
                key={item.alt}
                type="button"
                className={`pf-slide${isCenter ? ' is-center' : ''}`}
                style={{
                  width,
                  height,
                  transform: `translate(-50%, -50%) translateX(${translateX}px)`,
                  filter: blur > 0.1 ? `blur(${blur}px)` : 'none',
                  opacity,
                  zIndex,
                }}
                aria-label={isCenter ? item.alt : `Ver projeto: ${item.alt}`}
                aria-current={isCenter}
                onClick={(e) => onSlideClick(e, index)}
              >
                <img src={item.src} alt={item.alt} draggable={false} />
              </button>
            )
          })}
        </div>

        <button
          type="button"
          className="pf-arrow pf-arrow--next"
          aria-label="Próximo projeto"
          onClick={goNext}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path fill="currentColor" d="m8.5 4.5 8.5 8.5-8.5 8.5-1.4-1.4L14.2 13 7.1 5.9z" />
          </svg>
        </button>
      </div>

      <div className="pf-dots" role="tablist" aria-label="Selecionar projeto">
        {items.map((item, index) => (
          <button
            key={item.alt}
            type="button"
            role="tab"
            className={`pf-dot${index === activeIndex ? ' is-active' : ''}`}
            aria-label={`Ir para o projeto ${index + 1}`}
            aria-selected={index === activeIndex}
            onClick={() => goTo(index)}
          />
        ))}
      </div>
    </div>
  )
}

export default ProjectsCarousel
