import 'lenis/dist/lenis.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './style.css'
import './sections.css'
import { onLangChange } from './i18n.js'
import { resolvedTheme, onThemeChange } from './theme.js'
import { renderHome } from './home.js'
import { initParticles } from './particles.js'
import { playIntro } from './intro.js'
import { reduceMotion, finePointer, createLenis, renderNav, bindNav, setupCursor, autoplayVideos } from './shared.js'

const app = document.querySelector('#app')
let introDone = reduceMotion

renderNav()
bindNav()
app.innerHTML = renderHome({ revealed: introDone })

const lenis = createLenis()
lenis.stop()

// Campo de partículas WebGL (desligado com movimento reduzido ou sem WebGL)
const hasWebGL = (() => {
  try {
    return !!document.createElement('canvas').getContext('webgl2')
  } catch {
    return false
  }
})()
const particles = !reduceMotion && hasWebGL ? initParticles({ lenis }) : null
particles?.setTheme(resolvedTheme())
onThemeChange((mode) => particles?.setTheme(mode))

setupCursor()

// ---------- Loader + intro ----------
if (reduceMotion) {
  document.querySelector('.loader').remove()
  lenis.start()
} else {
  playIntro({ lenis, particles }).then(() => (introDone = true))
}

// ---------- Animações de scroll ----------
let mm

function animate() {
  mm = gsap.matchMedia()

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    // Hero: parallax de saída
    gsap.to('.hero__title', {
      yPercent: -30,
      opacity: 0.2,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    })

    // Sobre: texto que acende palavra por palavra
    document.querySelectorAll('.scrub-text').forEach((p) => {
      p.innerHTML = p.textContent
        .split(' ')
        .map((w) => `<span class="scrub-word">${w}</span>`)
        .join(' ')
      gsap.fromTo(
        p.querySelectorAll('.scrub-word'),
        { opacity: 0.15 },
        { opacity: 1, stagger: 0.05, ease: 'none', scrollTrigger: { trigger: p, start: 'top 85%', end: 'bottom 45%', scrub: true } },
      )
    })
    gsap.from('.about__meta li', { y: 16, opacity: 0, duration: 0.6, stagger: 0.08, scrollTrigger: { trigger: '.about__meta', start: 'top 90%' } })

    // Títulos de seção (número + palavras subindo)
    gsap.utils.toArray('.section-head').forEach((head) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: head, start: 'top 80%' } })
      tl.from(head.querySelectorAll('.word__inner'), { yPercent: 110, duration: 1, stagger: 0.08, ease: 'expo.out' }).from(
        head.querySelector('.section-head__num'),
        { opacity: 0, x: -10, duration: 0.6 },
        0,
      )
    })
    gsap.from('.projects__intro', { y: 20, opacity: 0, duration: 0.8, scrollTrigger: { trigger: '.projects__intro', start: 'top 85%' } })

    // Projetos: conteúdo de cada cartão entra em sequência
    gsap.utils.toArray('.pcard').forEach((card) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: card, start: 'top 75%' } })
      tl.from(card.querySelectorAll('.pcard__info > *'), { y: 30, opacity: 0, duration: 0.8, stagger: 0.07, ease: 'power3.out' })
        .from(card.querySelectorAll('.chip'), { scale: 0.8, opacity: 0, duration: 0.4, stagger: 0.04, ease: 'back.out(2)' }, '-=0.5')
        .from(card.querySelector('.pcard__media > *'), { y: 60, opacity: 0, duration: 1.1, ease: 'expo.out' }, 0.1)
    })

    // Experiência: linha que cresce, cartões e destaques que entram
    gsap.from('.timeline__line span', {
      scaleY: 0,
      ease: 'none',
      scrollTrigger: { trigger: '.timeline__list', start: 'top 70%', end: 'bottom 60%', scrub: true },
    })
    gsap.utils.toArray('.exp').forEach((item) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: item, start: 'top 80%' } })
      tl.from(item.querySelector('.exp__card'), { y: 50, opacity: 0, duration: 0.9, ease: 'power3.out' })
        .from(item.querySelector('.exp__dot'), { scale: 0, duration: 0.5, ease: 'back.out(3)' }, 0.1)
        .from(item.querySelectorAll('.exp__head .logo-tile, .exp__roles li'), { x: -16, opacity: 0, duration: 0.5, stagger: 0.06 }, 0.3)
        .from(item.querySelectorAll('.exp__hl'), { y: 24, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out' }, 0.45)
        .from(item.querySelectorAll('.exp__hl .logo-tile'), { rotate: -20, scale: 0.6, duration: 0.6, stagger: 0.08, ease: 'back.out(2.5)' }, 0.5)
    })

    // Skills: grupos entram em sequência e os ícones "acendem" um a um
    gsap.utils.toArray('.skill-group').forEach((group, i) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: '.skills__grid', start: 'top 80%' }, delay: i * 0.12 })
      tl.from(group.querySelector('.skill-group__title'), { y: 16, opacity: 0, duration: 0.6, ease: 'power3.out' })
        .from(group, { '--line': 0, duration: 0.9, ease: 'expo.inOut' }, '<')
        .from(group.querySelectorAll('.skill'), { y: 16, opacity: 0, duration: 0.6, stagger: 0.06, ease: 'power3.out' }, '-=0.6')
      group.querySelectorAll('.skill').forEach((el, j) => {
        tl.call(() => el.classList.add('is-lit'), null, 0.35 + j * 0.07)
        tl.call(() => el.classList.remove('is-lit'), null, 0.85 + j * 0.07)
      })
    })

    // Contato
    gsap.from('.contact .word__inner', {
      yPercent: 110,
      duration: 1,
      stagger: 0.06,
      ease: 'expo.out',
      scrollTrigger: { trigger: '.contact', start: 'top 70%' },
    })
    gsap.from('.contact__email, .contact__links li', {
      y: 40,
      opacity: 0,
      duration: 0.9,
      stagger: 0.08,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.contact__email', start: 'top 90%' },
    })

    // Criado por último para que as posições considerem o restante da página.
    particles?.bindScroll()
  })

  // Cartões de projeto empilhados: o anterior encolhe e escurece quando o próximo chega.
  mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
    const cards = gsap.utils.toArray('.pcard')
    cards.forEach((card, i) => {
      const next = cards[i + 1]
      if (!next) return
      gsap.to(card.querySelector('.pcard__inner'), {
        scale: 0.92,
        '--dim': 0.65,
        ease: 'none',
        scrollTrigger: { trigger: next, start: 'top bottom', end: () => `top ${parseFloat(getComputedStyle(next).top)}px`, scrub: true },
      })
    })
  })
}

// E-mail magnético
function bindMagnetic() {
  if (!finePointer || reduceMotion) return
  const el = document.querySelector('.contact__email')
  el.addEventListener('pointermove', (e) => {
    const r = el.getBoundingClientRect()
    gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * 0.25, y: (e.clientY - r.top - r.height / 2) * 0.35, duration: 0.4 })
  })
  el.addEventListener('pointerleave', () => gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' }))
}

animate()
autoplayVideos(app)
bindMagnetic()

// Troca de idioma: renderiza de novo e refaz as animações, mantendo a posição do scroll.
onLangChange(() => {
  const y = lenis.scroll
  mm.revert()
  renderNav()
  app.innerHTML = renderHome({ revealed: introDone })
  animate()
  autoplayVideos(app)
  bindMagnetic()
  ScrollTrigger.refresh()
  lenis.scrollTo(y, { immediate: true, force: true })
})

window.addEventListener('load', () => ScrollTrigger.refresh())
