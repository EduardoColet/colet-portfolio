import { ui as icon, brand, hasBrand } from './icons.js'

// Moldura de mídia de cada projeto, de acordo com o tipo:
// phones (capturas de app), screen (vídeo de jogo), browser (vídeo de site) e cover (sem mídia: arte gerada).

const video = (v) => `
  <video muted loop playsinline preload="none" poster="${v.poster}" data-autoplay>
    <source src="${v.webm}" type="video/webm">
    <source src="${v.mp4}" type="video/mp4">
  </video>`

export function mediaFrame(p) {
  switch (p.layout) {
    case 'phones':
      return `<div class="m-phones">${p.cover
        .map((src, i) => `<figure class="m-phone" style="--i:${i}; --off:${Math.abs(i - 1)}"><img src="${src}" alt="" loading="lazy" decoding="async"></figure>`)
        .join('')}</div>`
    case 'screen':
      return `<div class="m-screen">${video(p.video)}</div>`
    case 'browser':
      return `<div class="m-browser">
        <div class="m-browser__bar"><i></i><i></i><i></i><span>${p.url}</span></div>
        ${video(p.video)}
      </div>`
    default:
      // Projetos sem imagens: arte com o ícone do projeto e as logos da pilha orbitando.
      return `<div class="m-cover">
        <div class="m-cover__grid"></div>
        <div class="m-cover__orbit">${p.stack
          .filter(hasBrand)
          .map((s, i, all) => `<span class="m-cover__logo" style="--a:${(360 / all.length) * i}deg">${brand(s)}</span>`)
          .join('')}</div>
        <span class="m-cover__icon">${icon(p.coverIcon)}</span>
        <span class="m-cover__word" aria-hidden="true">${p.title}</span>
      </div>`
  }
}

// Texto escuro ou claro sobre a cor do projeto.
export const inkFor = (hex) => {
  const n = parseInt(hex.replace('#', ''), 16)
  const l = (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255
  return l > 0.55 ? '#0c0d0b' : '#ffffff'
}
