import { t, ui } from './i18n.js'
import { brand, brandVars } from './icons.js'
import { splitWords } from './shared.js'

const renderItem = ({ name, icon, short, color }) => {
  const glyph = icon
    ? brand(icon, 'skill__icon')
    : `<span class="skill__icon skill__icon--text" aria-hidden="true">${short}</span>`
  return `<li class="skill" style="${brandVars(icon, color)}">${glyph}<span>${name}</span></li>`
}

export const renderSkills = (groups, num) => `
  <section class="skills" id="skills">
    <div class="section-head">
      <span class="section-head__num mono">${num}</span>
      <h2 class="section-head__title">${splitWords(t(ui.sections.skills))}</h2>
    </div>
    <div class="skills__grid">
      ${groups
        .map(
          (g) => `
        <div class="skill-group">
          <h3 class="skill-group__title mono">${t(g.title)}</h3>
          <ul class="skill-group__list">${g.items.map(renderItem).join('')}</ul>
        </div>`,
        )
        .join('')}
    </div>
  </section>`
