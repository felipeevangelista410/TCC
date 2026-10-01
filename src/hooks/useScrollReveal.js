import { useEffect } from 'react';

// Observa os elementos com classe `.reveal` na página e adiciona
// `.is-visible` quando entram na tela, disparando o fade/slide do CSS.
export function useScrollReveal(deps = []) {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const elementos = document.querySelectorAll('.reveal');

    if (prefersReduced) {
      elementos.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    elementos.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
