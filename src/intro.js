import { gsap } from 'gsap'

// Entrada inspirada em masontywong.com: tela de carregamento lisa com um ícone de traço
// animado no canto, e depois a página "entra em foco" através de uma lente com ondas
// concêntricas, moiré e separação RGB. O WebGL faz o mesmo efeito no próprio shader.

// Mapa de deslocamento com anéis concêntricos (R = x, G = y, 0.5 = neutro).
function rippleMap(size = 256, rings = 14) {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')
  const img = ctx.createImageData(size, size)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x / size - 0.5
      const dy = y / size - 0.5
      const d = Math.hypot(dx, dy)
      const a = Math.atan2(dy, dx)
      const w = Math.sin(d * rings * Math.PI * 2) * Math.min(1, d * 4)
      const i = (y * size + x) * 4
      img.data[i] = 128 + 127 * Math.cos(a) * w
      img.data[i + 1] = 128 + 127 * Math.sin(a) * w
      img.data[i + 2] = 128
      img.data[i + 3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)
  return canvas.toDataURL()
}

// Separa os canais RGB e desloca vermelho/azul em sentidos opostos.
// No escuro os canais se somam (screen); no claro, texto escuro sobre fundo claro,
// cada camada mantém um canal e satura os outros, e elas se multiplicam.
const channelMatrix = {
  dark: [
    '1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0',
    '0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0',
    '0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0',
  ],
  light: [
    '1 0 0 0 0  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0',
    '0 0 0 0 1  0 1 0 0 0  0 0 0 0 1  0 0 0 1 0',
    '0 0 0 0 1  0 0 0 0 1  0 0 1 0 0  0 0 0 1 0',
  ],
}
const splitRGB = (input, rDx, bDx, mode) => {
  const [r, g, b] = channelMatrix[mode]
  const blend = mode === 'dark' ? 'screen' : 'multiply'
  return `
  <feColorMatrix in="${input}" type="matrix" values="${r}" result="r"/>
  <feOffset in="r" dx="${rDx}" result="ro"/>
  <feColorMatrix in="${input}" type="matrix" values="${g}" result="g"/>
  <feColorMatrix in="${input}" type="matrix" values="${b}" result="b"/>
  <feOffset in="b" dx="${bDx}" result="bo"/>
  <feBlend in="ro" in2="g" mode="${blend}" result="rg"/>
  <feBlend in="rg" in2="bo" mode="${blend}"/>`
}

function mountFilters() {
  const map = rippleMap()
  const wrap = document.createElement('div')
  wrap.innerHTML = `
    <svg class="fx-defs" aria-hidden="true" width="0" height="0">
      ${['dark', 'light']
        .map(
          (mode) => `
      <filter id="fx-lens-${mode}" class="fx-lens" x="-5%" y="-5%" width="110%" height="110%" primitiveUnits="objectBoundingBox" color-interpolation-filters="sRGB">
        <feImage href="${map}" x="0" y="0" width="1" height="1" preserveAspectRatio="none" result="map"/>
        <feDisplacementMap in="SourceGraphic" in2="map" scale="0.018" xChannelSelector="R" yChannelSelector="G" result="d"/>
        ${splitRGB('d', -0.004, 0.004, mode)}
      </filter>
      <filter id="fx-ca-${mode}" x="-2%" y="-2%" width="104%" height="104%" color-interpolation-filters="sRGB">
        ${splitRGB('SourceGraphic', -1.5, 1.5, mode)}
      </filter>`,
        )
        .join('')}
    </svg>`
  const svg = wrap.firstElementChild
  document.body.append(svg)
  return {
    displacement: svg.querySelectorAll('.fx-lens feDisplacementMap'),
    offsets: svg.querySelectorAll('.fx-lens feOffset'),
  }
}

// Espera fontes e recursos, com um tempo mínimo para o ícone animar.
function whenReady(minMs, onProgress) {
  const start = performance.now()
  const loaded = new Promise((r) => (document.readyState === 'complete' ? r() : window.addEventListener('load', r, { once: true })))
  let done = false
  Promise.all([loaded, document.fonts.ready]).then(() => (done = true))
  return new Promise((resolve) => {
    const step = () => {
      const t = Math.min(1, (performance.now() - start) / minMs)
      const p = done ? t : Math.min(t, 0.9)
      onProgress(p)
      if (p >= 1) resolve()
      else requestAnimationFrame(step)
    }
    step()
  })
}

export async function playIntro({ lenis, particles }) {
  const loader = document.querySelector('.loader')
  const percent = loader.querySelector('.loader__percent')
  const hero = document.querySelector('.hero')
  const fx = mountFilters()

  // Estado inicial: página pronta por trás do loader, já distorcida.
  hero.style.filter = `url(#fx-lens-${document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'})`
  gsap.set(hero, { scale: 1.12 })
  gsap.set('.nav__logo, .nav__links a, .nav__btn', { autoAlpha: 0, scale: 0.6 })
  gsap.set('.hero__scroll', { autoAlpha: 0, y: 20 })

  await whenReady(1800, (p) => (percent.textContent = String(Math.round(p * 100)).padStart(3, '0')))

  const lens = { k: 1 }
  let finish
  const done = new Promise((r) => (finish = r))
  const tl = gsap.timeline({
    onComplete: () => {
      // A página pode ter sido renderizada de novo (troca de idioma): busca o hero atual.
      const current = document.querySelector('.hero')
      current.style.filter = ''
      current.classList.add('is-revealed')
      gsap.set(current, { clearProps: 'scale' })
      gsap.set('.nav__logo, .nav__links a, .nav__btn', { clearProps: 'all' })
      loader.remove()
      lenis.start()
      finish()
    },
  })

  tl.to(loader, { autoAlpha: 0, duration: 0.35, ease: 'power1.out' })
    .to(
      lens,
      {
        k: 0,
        duration: 1.5,
        ease: 'power3.out',
        onUpdate: () => {
          fx.displacement.forEach((el) => el.setAttribute('scale', 0.018 * lens.k))
          fx.offsets.forEach((el, i) => el.setAttribute('dx', (i % 2 ? 0.004 : -0.004) * lens.k))
        },
      },
      0.1,
    )
    .to(hero, { scale: 1, duration: 1.8, ease: 'expo.out' }, 0.1)
    .fromTo('.hero__moire', { autoAlpha: 0.7 }, { autoAlpha: 0, duration: 1.3, ease: 'power2.out' }, 0.1)
    .to('.nav__logo, .nav__links a, .nav__btn', { autoAlpha: 1, scale: 1, duration: 0.7, stagger: 0.07, ease: 'back.out(2.2)' }, 0.6)
    .to('.hero__scroll', { autoAlpha: 1, y: 0, duration: 0.8, ease: 'back.out(1.8)' }, 0.9)

  if (particles) {
    tl.fromTo(particles.postUniforms.uReveal, { value: 0 }, { value: 1, duration: 1.6, ease: 'power3.out' }, 0.1)
      .fromTo(particles.uniforms.uIntro, { value: 0 }, { value: 1, duration: 2, ease: 'expo.out' }, 0.1)
  }
  return done
}
