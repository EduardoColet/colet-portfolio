import { t, ui } from './i18n.js'
import { profile, skillGroups, experience } from './data.js'
import { projects, projectUrl } from './projects-data.js'
import { arrow, brand, ui as icon, logoTile, techChip } from './icons.js'
import { mediaFrame, inkFor } from './project-media.js'
import { renderSkills } from './skills.js'
import { splitWords, renderSocials } from './shared.js'

const sectionHead = (num, title) => `
  <div class="section-head">
    <span class="section-head__num mono">${num}</span>
    <h2 class="section-head__title">${splitWords(title)}</h2>
  </div>`

const period = (from, to) => `${from} → ${to ?? t(ui.now)}`

const projectCard = (p, i) => `
  <article class="pcard" style="--pc: ${p.color}; --pc-ink: ${inkFor(p.color)}; --i: ${i}">
    <div class="pcard__inner">
      <div class="pcard__info">
        <div class="pcard__top mono">
          <span class="pcard__num">${String(i + 1).padStart(2, '0')}</span>
          <span>${t(p.kind)} · ${p.year}</span>
        </div>
        <h3 class="pcard__title">${p.title}</h3>
        <p class="pcard__tagline">${t(p.tagline)}</p>
        <p class="pcard__summary">${t(p.summary)}</p>
        <ul class="chips">${p.stack.map((s) => techChip(s)).join('')}</ul>
        <div class="pcard__actions">
          <a class="btn btn--project" href="${projectUrl(p.slug)}">${t(ui.viewProject)} ${arrow}</a>
          ${p.demo ? `<a class="btn" href="${p.demo}" target="_blank" rel="noopener">${t(ui.demo)} ${arrow}</a>` : ''}
          <a class="btn btn--icon" href="${p.repo}" target="_blank" rel="noopener" aria-label="${t(ui.code)} (GitHub)" title="${t(ui.code)}">${brand('github')}</a>
        </div>
      </div>
      <a class="pcard__media" href="${projectUrl(p.slug)}" tabindex="-1" aria-hidden="true">${mediaFrame(p)}</a>
    </div>
  </article>`

const highlight = (h) => {
  const inner = `
    <div class="exp__hl-head">${logoTile(h.logo, 'sm')}<h4>${t(h.title)}</h4>${h.link ? arrow : ''}</div>
    <p>${t(h.text)}</p>
    ${h.tags ? `<ul class="tags">${h.tags.map((tag) => `<li>${tag}</li>`).join('')}</ul>` : ''}`
  return h.link
    ? `<li class="exp__hl exp__hl--link"><a href="${projectUrl(h.link)}">${inner}</a></li>`
    : `<li class="exp__hl">${inner}</li>`
}

const experienceCard = (e) => `
  <li class="exp ${e.current ? 'is-current' : ''}">
    <span class="exp__dot" aria-hidden="true"></span>
    <article class="exp__card">
      <header class="exp__head">
        ${logoTile(e.logo, 'lg')}
        <div class="exp__title">
          <h3>${e.org}</h3>
          <p>${t(e.orgDetail)}</p>
        </div>
        <div class="exp__meta">
          <span class="badge ${e.current ? 'badge--accent' : ''}">${t(e.current ? ui.current : ui.done)}</span>
          <span class="mono">${period(e.period.from, e.period.to)}</span>
        </div>
      </header>
      <p class="exp__summary">${t(e.summary)}</p>
      ${
        e.roles
          ? `<ol class="exp__roles" aria-label="${t(ui.roles)}">${e.roles
              .map((r) => `<li><span>${t(r.title)}</span><span class="mono">${period(r.from, r.to)}</span></li>`)
              .join('')}</ol>`
          : ''
      }
      <ul class="exp__highlights">${e.highlights.map(highlight).join('')}</ul>
      <ul class="chips">${e.stack.map((s) => techChip(s)).join('')}</ul>
    </article>
  </li>`

export const renderHome = ({ revealed }) => `
  <section class="hero ${revealed ? 'is-revealed' : ''}" id="top">
    <p class="hero__kicker mono">${t(profile.role)}</p>
    <h1 class="hero__title">
      <span class="line">${splitWords('Eduardo')}</span>
      <span class="line line--outline">${splitWords('Colet')}</span>
    </h1>
    <p class="hero__tagline">${t(profile.tagline)}</p>
    <div class="hero__actions">
      <a class="btn btn--primary" href="${profile.resume}" target="_blank" rel="noopener">${t(ui.resume)} ${arrow}</a>
      <a class="btn" href="#contato">${t(ui.nav.contact)}</a>
    </div>
    <div class="hero__scroll" aria-hidden="true"><span class="hero__mouse"><span></span></span></div>
    <div class="hero__moire" aria-hidden="true"></div>
  </section>

  <section class="about" id="sobre">
    <p class="section-label mono">01 — ${t(ui.sections.about)}</p>
    <div class="about__text">
      ${profile.about.map((p) => `<p class="scrub-text">${t(p)}</p>`).join('')}
    </div>
    <ul class="about__meta mono">
      <li>${icon('pin')} ${profile.location}</li>
      ${profile.languages.map((l) => `<li>${icon('globe')} ${t(l.name)} · ${t(l.level)}</li>`).join('')}
    </ul>
  </section>


  <section class="projects" id="projetos">
    ${sectionHead('02', t(ui.sections.projects))}
    <p class="projects__intro">${t(ui.projectsIntro)}</p>
    <div class="projects__stack">${projects.map(projectCard).join('')}</div>
  </section>

  <section class="timeline" id="experiencia">
    ${sectionHead('03', t(ui.sections.experience))}
    <ol class="timeline__list">
      <li class="timeline__line" aria-hidden="true"><span></span></li>
      ${experience.map(experienceCard).join('')}
    </ol>
  </section>

  ${renderSkills(skillGroups, '04')}

  <footer class="contact" id="contato">
    <p class="section-label mono">05 — ${t(ui.sections.contact)}</p>
    <h2 class="contact__title">${splitWords(t(ui.contactTitle))}</h2>
    <a class="contact__email" href="mailto:${profile.email}">${profile.email}</a>
    ${renderSocials('contact__links')}
    <p class="contact__copy mono">© ${new Date().getFullYear()} ${profile.name}</p>
  </footer>
`
