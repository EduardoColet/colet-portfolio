import 'lenis/dist/lenis.css'
import { gsap } from 'gsap'
import './style.css'
import './sections.css'
import { t, ui, onLangChange } from './i18n.js'
import { projects, findProject, projectUrl } from './projects-data.js'
import { arrow, brand, ui as icon, logoTile, techChip } from './icons.js'
import { mediaFrame, inkFor } from './project-media.js'
import { reduceMotion, splitWords, createLenis, renderNav, bindNav, setupCursor, autoplayVideos, renderSocials } from './shared.js'

const slug = new URLSearchParams(location.search).get('p')
const project = findProject(slug)
const app = document.querySelector('#app')

const render = () => {
  if (!project) {
    document.title = 'Eduardo Colet'
    return `<section class="pp-hero"><h1 class="pp-title">404</h1><p class="pp-summary">${t(ui.notFound)}</p>
      <a class="btn" href="/#projetos">${icon('back')} ${t(ui.backToProjects)}</a></section>`
  }
  const p = project
  const next = projects[(projects.indexOf(p) + 1) % projects.length]
  document.title = `${p.title} — Eduardo Colet`
  return `
  <div class="pp" style="--pc: ${p.color}; --pc-ink: ${inkFor(p.color)}">
    <div class="pp__glow" aria-hidden="true"></div>
    <section class="pp-hero">
      <a class="pp-back mono" href="/#projetos">${icon('back')} ${t(ui.backToProjects)}</a>
      <p class="pp-kind mono">${t(p.kind)} · ${p.year}</p>
      <h1 class="pp-title">${splitWords(p.title)}</h1>
      <p class="pp-tagline">${t(p.tagline)}</p>
      <p class="pp-summary">${t(p.summary)}</p>
      <div class="pp-actions">
        ${
          p.demo
            ? `<a class="btn btn--project" href="${p.demo}" target="_blank" rel="noopener">${t(ui.demo)} ${arrow}</a>`
            : `<span class="btn btn--disabled" aria-disabled="true">${brand('vercel')} ${t(ui.demoSoon)}</span>`
        }
        <a class="btn" href="${p.repo}" target="_blank" rel="noopener">${brand('github')} ${t(ui.githubView)} ${arrow}</a>
      </div>
      <ul class="chips">${p.stack.map((s) => techChip(s)).join('')}</ul>
    </section>

    <section class="pp-media pp-media--${p.layout}">${mediaFrame(p)}</section>

    <section class="pp-body">
      <div class="pp-about">
        <h2 class="pp-label mono">${t(ui.aboutProject)}</h2>
        ${p.about.map((para) => `<p>${t(para)}</p>`).join('')}
      </div>
      <aside class="pp-highlights">
        <h2 class="pp-label mono">${t(ui.highlights)}</h2>
        <ul>${p.highlights.map((h) => `<li>${logoTile(h.icon, 'sm')}<span>${t(h.text)}</span></li>`).join('')}</ul>
      </aside>
    </section>

    ${
      p.gallery
        ? `<section class="pp-gallery">
        <h2 class="pp-label mono">${t(ui.gallery)}</h2>
        <div class="pp-grid pp-grid--${p.galleryShape}">
          ${p.gallery
            .map(
              (g, i) => `
            <figure>
              <button class="pp-shot" type="button" data-index="${i}" aria-label="${t(g.caption)}">
                <img src="${g.src}" alt="${t(g.caption)}" loading="lazy" decoding="async">
              </button>
              <figcaption class="mono">${String(i + 1).padStart(2, '0')} · ${t(g.caption)}</figcaption>
            </figure>`,
            )
            .join('')}
        </div>
      </section>`
        : ''
    }

    <a class="pp-next" href="${projectUrl(next.slug)}" style="--nc: ${next.color}">
      <span class="mono">${t(ui.nextProject)}</span>
      <span class="pp-next__title">${next.title} ${arrow}</span>
    </a>

    <footer class="pp-footer">
      ${renderSocials()}
      <p class="mono">© ${new Date().getFullYear()} Eduardo Colet</p>
    </footer>
  </div>
  ${
    p.gallery
      ? `<dialog class="lightbox" aria-label="${t(ui.gallery)}">
      <button class="lightbox__close" type="button" aria-label="${t(ui.close)}">×</button>
      <button class="lightbox__nav lightbox__nav--prev" type="button" aria-label="←">${icon('back')}</button>
      <figure><img alt=""><figcaption class="mono"></figcaption></figure>
      <button class="lightbox__nav lightbox__nav--next" type="button" aria-label="→">${icon('back')}</button>
    </dialog>`
      : ''
  }`
}

// Galeria em tela cheia (setas do teclado navegam; Esc fecha pelo próprio <dialog>).
function bindLightbox() {
  const box = document.querySelector('.lightbox')
  if (!box) return
  const img = box.querySelector('img')
  const cap = box.querySelector('figcaption')
  let index = 0
  const show = (i) => {
    index = (i + project.gallery.length) % project.gallery.length
    const g = project.gallery[index]
    img.src = g.src
    img.alt = t(g.caption)
    cap.textContent = t(g.caption)
  }
  document.querySelectorAll('.pp-shot').forEach((b) =>
    b.addEventListener('click', () => {
      show(+b.dataset.index)
      box.showModal()
      lenis.stop()
    }),
  )
  box.addEventListener('close', () => lenis.start())
  box.querySelector('.lightbox__close').addEventListener('click', () => box.close())
  box.querySelector('.lightbox__nav--prev').addEventListener('click', () => show(index - 1))
  box.querySelector('.lightbox__nav--next').addEventListener('click', () => show(index + 1))
  box.addEventListener('click', (e) => e.target === box && box.close())
  box.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(index - 1)
    if (e.key === 'ArrowRight') show(index + 1)
  })
}

let ctx
function animate() {
  if (reduceMotion || !project) return
  ctx = gsap.context(() => {
    const tl = gsap.timeline({ delay: 0.1 })
    tl.from('.pp-back, .pp-kind', { y: 16, opacity: 0, duration: 0.6, stagger: 0.08 })
      .from('.pp-title .word__inner', { yPercent: 110, duration: 1.1, stagger: 0.08, ease: 'expo.out' }, '-=0.3')
      .from('.pp-tagline, .pp-summary, .pp-actions', { y: 24, opacity: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out' }, '-=0.7')
      .from('.pp-hero .chip', { scale: 0.8, opacity: 0, duration: 0.4, stagger: 0.05, ease: 'back.out(2)' }, '-=0.5')
      .from('.pp-media > *', { y: 80, opacity: 0, scale: 0.96, duration: 1.3, ease: 'expo.out' }, '-=0.9')
    gsap.from('.pp-about > *, .pp-highlights li', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.07,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.pp-body', start: 'top 80%' },
    })
    gsap.utils.toArray('.pp-grid figure').forEach((fig, i) =>
      gsap.from(fig, { y: 60, opacity: 0, duration: 0.9, delay: (i % 4) * 0.08, ease: 'power3.out', scrollTrigger: { trigger: fig, start: 'top 90%' } }),
    )
    gsap.from('.pp-next', { y: 40, opacity: 0, duration: 0.9, scrollTrigger: { trigger: '.pp-next', start: 'top 90%' } })
  })
}

const mount = () => {
  app.innerHTML = render()
  animate()
  autoplayVideos(app)
  bindLightbox()
}

renderNav({ home: false })
bindNav({ home: false })
document.querySelector('.loader')?.remove()
const lenis = createLenis()
setupCursor()
mount()

onLangChange(() => {
  ctx?.revert()
  renderNav({ home: false })
  mount()
})
