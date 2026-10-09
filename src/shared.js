import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { t, ui, lang, setLang } from './i18n.js'
import { cycleTheme, preference, onThemeChange } from './theme.js'
import { ui as icon, brand, arrow } from './icons.js'
import { profile } from './data.js'

gsap.registerPlugin(ScrollTrigger)

export const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
export const finePointer = window.matchMedia('(pointer: fine)').matches

// Quebra o texto em palavras com máscara, para o efeito de "subir" de dentro da linha.
export const splitWords = (text) =>
  text
    .split(' ')
    .map((w) => `<span class="word"><span class="word__inner">${w}</span></span>`)
    .join(' ')

// Lenis + GSAP, conforme o README do Lenis.
export function createLenis() {
  const lenis = new Lenis({ lerp: 0.09, anchors: { offset: -80 } })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
  const progress = document.querySelector('.progress')
  if (progress) lenis.on('scroll', ({ progress: p }) => progress.style.setProperty('--p', p))
  return lenis
}

// ---------- Nav ----------
const themeIcon = { system: 'system', light: 'sun', dark: 'moon' }
const navLinks = [
  ['sobre', 'about'],
  ['projetos', 'projects'],
  ['experiencia', 'experience'],
  ['skills', 'skills'],
  ['contato', 'contact'],
]

export function renderNav({ home = true } = {}) {
  const prefix = home ? '' : '/'
  document.querySelector('.nav').innerHTML = `
    <a href="${home ? '#top' : '/'}" class="nav__logo" aria-label="Eduardo Colet">EC<span>.</span></a>
    <nav class="nav__links">
      ${navLinks.map(([id, key]) => `<a href="${prefix}#${id}">${t(ui.nav[key])}</a>`).join('')}
    </nav>
    <div class="nav__controls">
      <button class="nav__btn nav__lang" type="button" aria-label="${t(ui.langToggle)}" title="${t(ui.langToggle)}">
        <span class="${lang === 'pt' ? 'is-on' : ''}">PT</span><span class="${lang === 'en' ? 'is-on' : ''}">EN</span>
      </button>
      <button class="nav__btn nav__theme" type="button" aria-label="${t(ui.theme[preference])}" title="${t(ui.theme[preference])}">
        ${icon(themeIcon[preference])}
      </button>
    </div>`
}

export function bindNav(options) {
  document.querySelector('.nav').addEventListener('click', (e) => {
    if (e.target.closest('.nav__lang')) setLang(lang === 'pt' ? 'en' : 'pt')
    if (e.target.closest('.nav__theme')) cycleTheme()
  })
  onThemeChange(() => renderNav(options))
}

// ---------- Contato ----------
export const socials = () => [
  { href: profile.linkedin, label: 'LinkedIn', icon: brand('linkedin') },
  { href: profile.github, label: 'GitHub', icon: brand('github') },
  { href: profile.instagram, label: 'Instagram', icon: brand('instagram') },
  { href: profile.resume, label: t(ui.resumePdf), icon: icon('file') },
]

export const renderSocials = (cls = '') =>
  `<ul class="socials ${cls}">${socials()
    .map((s) => `<li><a href="${s.href}" target="_blank" rel="noopener">${s.icon}<span>${s.label}</span>${arrow}</a></li>`)
    .join('')}</ul>`

// ---------- Cursor ----------
export function setupCursor() {
  const cursor = document.querySelector('.cursor')
  if (!cursor) return
  if (!finePointer || reduceMotion) return cursor.remove()
  const xTo = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3' })
  const yTo = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3' })
  window.addEventListener('pointermove', (e) => {
    xTo(e.clientX)
    yTo(e.clientY)
  })
  // Delegação: funciona para elementos criados depois (troca de idioma).
  document.addEventListener('pointerover', (e) => cursor.classList.toggle('is-hover', !!e.target.closest('a, button')))
}

// Vídeos tocam só quando aparecem na tela (e nunca com movimento reduzido).
export function autoplayVideos(root = document) {
  const videos = root.querySelectorAll('video[data-autoplay]')
  if (reduceMotion) {
    videos.forEach((v) => (v.controls = true))
    return
  }
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) {
          target.preload = 'auto'
          target.play().catch(() => {})
        } else target.pause()
      }),
    { threshold: 0.25 },
  )
  videos.forEach((v) => io.observe(v))
}
