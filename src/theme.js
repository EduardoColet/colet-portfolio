// Tema claro/escuro/sistema. O index.html aplica o tema antes do primeiro paint
// (script inline no <head>); aqui ficam a troca e os avisos para quem precisa reagir (WebGL).
const KEY = 'theme'
const mq = window.matchMedia('(prefers-color-scheme: dark)')
const order = ['system', 'light', 'dark']

const read = () => {
  try {
    const v = localStorage.getItem(KEY)
    if (order.includes(v)) return v
  } catch {}
  return 'system'
}

export let preference = read()
const listeners = new Set()

export const resolvedTheme = () => (preference === 'system' ? (mq.matches ? 'dark' : 'light') : preference)

function apply() {
  const root = document.documentElement
  root.dataset.theme = resolvedTheme()
  root.dataset.themePref = preference
  listeners.forEach((fn) => fn(resolvedTheme(), preference))
}

mq.addEventListener('change', () => preference === 'system' && apply())

export function cycleTheme() {
  preference = order[(order.indexOf(preference) + 1) % order.length]
  try {
    localStorage.setItem(KEY, preference)
  } catch {}
  apply()
}

export const onThemeChange = (fn) => listeners.add(fn)

apply()
