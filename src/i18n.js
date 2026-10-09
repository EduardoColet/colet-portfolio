// Idioma do site (pt/en). Textos bilíngues são objetos { pt, en }; `t()` escolhe o atual.
const KEY = 'lang'

const initial = () => {
  try {
    const saved = localStorage.getItem(KEY)
    if (saved === 'pt' || saved === 'en') return saved
  } catch {}
  return (navigator.language || 'pt').toLowerCase().startsWith('pt') ? 'pt' : 'en'
}

export let lang = initial()
const listeners = new Set()

const applyHtmlLang = () => (document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en')
applyHtmlLang()

export const t = (v) => (v && typeof v === 'object' && 'pt' in v ? v[lang] : v)

export function setLang(next) {
  if (next === lang) return
  lang = next
  try {
    localStorage.setItem(KEY, next)
  } catch {}
  applyHtmlLang()
  listeners.forEach((fn) => fn(next))
}

export const onLangChange = (fn) => listeners.add(fn)

// Textos fixos da interface
export const ui = {
  nav: {
    about: { pt: 'Sobre', en: 'About' },
    projects: { pt: 'Projetos', en: 'Projects' },
    experience: { pt: 'Experiência', en: 'Experience' },
    skills: { pt: 'Skills', en: 'Skills' },
    contact: { pt: 'Contato', en: 'Contact' },
  },
  theme: {
    system: { pt: 'Tema: sistema', en: 'Theme: system' },
    light: { pt: 'Tema: claro', en: 'Theme: light' },
    dark: { pt: 'Tema: escuro', en: 'Theme: dark' },
  },
  langToggle: { pt: 'Mudar para inglês', en: 'Switch to Portuguese' },
  resume: { pt: 'Ver currículo', en: 'View résumé' },
  resumePdf: { pt: 'Currículo (PDF)', en: 'Résumé (PDF)' },
  sections: {
    about: { pt: 'Sobre', en: 'About' },
    projects: { pt: 'Projetos', en: 'Projects' },
    experience: { pt: 'Experiência', en: 'Experience' },
    skills: { pt: 'Skills e ferramentas', en: 'Skills & tools' },
    contact: { pt: 'Contato', en: 'Contact' },
  },
  contactTitle: { pt: 'Vamos construir algo juntos?', en: "Let's build something together?" },
  current: { pt: 'Atual', en: 'Current' },
  done: { pt: 'Concluído', en: 'Completed' },
  now: { pt: 'hoje', en: 'now' },
  viewProject: { pt: 'Ver projeto', en: 'View project' },
  code: { pt: 'Código', en: 'Code' },
  demo: { pt: 'Abrir demo', en: 'Open demo' },
  demoSoon: { pt: 'Demo em breve', en: 'Demo coming soon' },
  githubView: { pt: 'Ver no GitHub', en: 'View on GitHub' },
  projectsIntro: {
    pt: 'Projetos pessoais e acadêmicos, de apps mobile e visão computacional a jogos e sites. Cada um tem sua própria página.',
    en: 'Personal and academic projects, from mobile apps and computer vision to games and websites. Each one has its own page.',
  },
  roles: { pt: 'Cargos', en: 'Roles' },
  backToProjects: { pt: 'Todos os projetos', en: 'All projects' },
  aboutProject: { pt: 'Sobre o projeto', en: 'About the project' },
  highlights: { pt: 'Destaques', en: 'Highlights' },
  stack: { pt: 'Tecnologias', en: 'Tech stack' },
  gallery: { pt: 'Galeria', en: 'Gallery' },
  nextProject: { pt: 'Próximo projeto', en: 'Next project' },
  notFound: { pt: 'Projeto não encontrado.', en: 'Project not found.' },
  close: { pt: 'Fechar', en: 'Close' },
  languages: { pt: 'Idiomas', en: 'Languages' },
}
