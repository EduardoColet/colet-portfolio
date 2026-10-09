import {
  siFlutter,
  siDart,
  siReact,
  siIonic,
  siAngular,
  siCapacitor,
  siHtml5,
  siCss3,
  siNodedotjs,
  siFirebase,
  siMysql,
  siTypescript,
  siJavascript,
  siPython,
  siOpencv,
  siUnity,
  siGit,
  siGithub,
  siIos,
  siAndroid,
  siAmazonwebservices,
  siTensorflow,
  siHive,
  siInstagram,
  siLinkedin,
  siVercel,
} from 'simple-icons'

// Logos de marca (simple-icons). `color` sobrescreve a cor oficial quando ela some no tema.
const brands = Object.fromEntries(
  [
    siFlutter,
    siDart,
    siReact,
    siIonic,
    siAngular,
    siCapacitor,
    siHtml5,
    siCss3,
    siNodedotjs,
    siFirebase,
    siMysql,
    siTypescript,
    siJavascript,
    siPython,
    siOpencv,
    siUnity,
    siGit,
    siGithub,
    siIos,
    siAndroid,
    siAmazonwebservices,
    siTensorflow,
    siHive,
    siInstagram,
    siLinkedin,
    siVercel,
  ].map((i) => [i.slug, { title: i.title, path: i.path, hex: i.hex }]),
)
brands.amazonwebservices.hex = 'FF9900'
brands.amazonwebservices.title = 'AWS'
brands.reactnative = { ...brands.react, title: 'React Native' }

// Logos em imagem (empresas e instituições), servidos de /public/logos.
const images = {
  stara: { src: '/logos/stara-favicon.png', title: 'Stara' },
  upf: { src: '/logos/upf-icon.png', title: 'UPF' },
  usa: { src: '/logos/usa.svg', title: 'EUA', fill: true },
}

// Ícones de interface (traço), desenhados em 24×24.
const glyphs = {
  arrow: '<path d="M7 17 17 7M8 7h9v9"/>',
  back: '<path d="M19 12H5M11 18l-6-6 6-6"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"/>',
  system: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  leaf: '<path d="M5 19c0-8 5-14 15-15-1 10-7 15-15 15Z"/><path d="M5 19 13 11"/>',
  megaphone: '<path d="M3 10v4h3l7 4V6L6 10H3Z"/><path d="M17 9a4 4 0 0 1 0 6"/>',
  pin: '<path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11Z"/><circle cx="12" cy="10" r="2.5"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  file: '<path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8Z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
  play: '<path d="M7 5v14l11-7Z"/>',
  wallet: '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M16 15h2"/>',
  chart: '<path d="M4 19V5M4 19h16M8 15l3-4 3 2 5-6"/>',
  code: '<path d="m9 18-6-6 6-6M15 6l6 6-6 6"/>',
  sparkles: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2 2M16 16l2 2M6 18l2-2M16 8l2-2"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/>',
  gamepad: '<rect x="2" y="7" width="20" height="11" rx="5"/><path d="M7 11v3M5.5 12.5h3M15.5 12h.01M18 14h.01"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14a6.5 6.5 0 0 1 3.5 6"/>',
  phone: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
  cloud: '<path d="M7 18a5 5 0 0 1-.6-10A6 6 0 0 1 18 9a4.5 4.5 0 0 1-.5 9Z"/>',
}

export const ui = (name, cls = '') =>
  `<svg class="ico ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${glyphs[name]}</svg>`

export const arrow = ui('arrow')

export const hasBrand = (slug) => slug in brands || slug in images

const fallbackTitles = { csharp: 'C#' }

export const brandTitle = (slug) => brands[slug]?.title ?? images[slug]?.title ?? fallbackTitles[slug] ?? slug

// Ícone monocromático (herda currentColor).
export const brand = (slug, cls = '') => {
  if (images[slug]) return `<img class="logo-img ${cls}" src="${images[slug].src}" alt="" loading="lazy" decoding="async">`
  const b = brands[slug]
  if (!b) return ui('code', cls)
  return `<svg class="ico ${cls}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="${b.path}"/></svg>`
}

// Cor de marca legível em cada tema: escura demais no escuro → texto; clara demais no claro → texto.
const lum = (hex) => {
  const n = parseInt(hex, 16)
  return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255
}
export const brandVars = (slug, override) => {
  const hex = (override ?? brands[slug]?.hex ?? '8a8f82').replace('#', '')
  const l = lum(hex)
  // --c-t: cor sobre ladrilho claro (igual nos dois temas)
  return `--c-d: ${l < 0.25 ? 'var(--fg)' : `#${hex}`}; --c-l: ${l > 0.72 ? 'var(--fg)' : `#${hex}`}; --c-t: ${l > 0.72 ? '#14160f' : `#${hex}`};`
}

// Ladrilho de logo (estilo cartão), colorido.
export const logoTile = (slug, size = 'md') => {
  if (images[slug]) return `<span class="logo-tile logo-tile--${size}${images[slug].fill ? ' logo-tile--fill' : ''}">${brand(slug)}</span>`
  if (brands[slug]) return `<span class="logo-tile logo-tile--${size} logo-tile--brand" style="${brandVars(slug)}">${brand(slug)}</span>`
  return `<span class="logo-tile logo-tile--${size} logo-tile--ui">${ui(slug)}</span>`
}

// Etiqueta com logo + nome, usada em pilhas de tecnologia.
export const techChip = (slug, label) =>
  `<li class="chip" style="${brandVars(slug)}">${hasBrand(slug) ? brand(slug, 'chip__icon') : ''}<span>${label ?? brandTitle(slug)}</span></li>`
