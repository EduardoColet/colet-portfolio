// Conteúdo do portfólio. Textos bilíngues ficam como { pt, en }.
// Fontes: currículo (LinkedIn) e READMEs dos repositórios em github.com/EduardoColet.
// Os projetos ficam em src/projects-data.js.

export const profile = {
  name: 'Eduardo Colet',
  role: { pt: 'Desenvolvedor Web & Mobile', en: 'Web & Mobile Developer' },
  location: 'Passo Fundo, RS · Brasil',
  tagline: {
    pt: 'Desenvolvedor focado em apps mobile, APIs e nuvem, principalmente na AWS. Na Stara, construo apps, APIs e integrações de telemetria com Flutter, Node.js e TypeScript. Sou bacharel em Ciência da Computação pela UPF.',
    en: "Developer focused on mobile apps, APIs and the cloud, mainly on AWS. At Stara, I build apps, APIs and telemetry integrations with Flutter, Node.js and TypeScript. I hold a bachelor's degree in Computer Science from UPF.",
  },
  email: 'eduardocolet5@gmail.com',
  linkedin: 'https://www.linkedin.com/in/eduardo-colet/',
  github: 'https://github.com/EduardoColet',
  instagram: 'https://www.instagram.com/eduardo_colet_/',
  resume: '/curriculo-eduardo-colet.pdf',
  about: [
    {
      pt: 'Desenvolvedor de software e subsistemas, criando aplicações web e mobile para telemetria e gestão de dados.',
      en: 'Software and subsystems developer, building web and mobile applications for telemetry and data management.',
    },
    {
      pt: 'Atuo de ponta a ponta: das interfaces em Flutter e React Native até APIs e integrações no back-end com Node.js e TypeScript, sobre AWS e bancos SQL e NoSQL.',
      en: 'I work end to end: from Flutter and React Native interfaces to back-end APIs and integrations with Node.js and TypeScript, on AWS with SQL and NoSQL databases.',
    },
    {
      pt: 'Bacharel em Ciência da Computação pela Universidade de Passo Fundo (UPF). Falo português e inglês fluente, e trabalho direto com empresas internacionais para integrar sistemas.',
      en: "Bachelor's in Computer Science from Universidade de Passo Fundo (UPF). I speak Portuguese and fluent English, and work directly with international companies to integrate systems.",
    },
  ],
  languages: [
    { name: { pt: 'Português', en: 'Portuguese' }, level: { pt: 'nativo', en: 'native' } },
    { name: { pt: 'Inglês', en: 'English' }, level: { pt: 'fluente', en: 'fluent' } },
  ],
}

// Seção "Skills e ferramentas". `icon` é a chave em src/icons.js; sem ícone, `short` aparece em mono.
export const skillGroups = [
  {
    title: 'Mobile & Web',
    items: [
      { name: 'Flutter', icon: 'flutter' },
      { name: 'React Native', icon: 'reactnative' },
      { name: 'React', icon: 'react' },
      { name: 'iOS', icon: 'ios' },
      { name: 'Android', icon: 'android' },
      { name: 'Ionic', icon: 'ionic' },
      { name: 'HTML', icon: 'html5' },
      { name: 'CSS', icon: 'css3' },
    ],
  },
  {
    title: { pt: 'Backend & Nuvem', en: 'Backend & Cloud' },
    items: [
      { name: 'Node.js', icon: 'nodedotjs' },
      { name: 'AWS', icon: 'amazonwebservices' },
      { name: 'Firebase', icon: 'firebase' },
      { name: 'MySQL', icon: 'mysql' },
    ],
  },
  {
    title: { pt: 'Linguagens', en: 'Languages' },
    items: [
      { name: 'Dart', icon: 'dart' },
      { name: 'TypeScript', icon: 'typescript' },
      { name: 'JavaScript', icon: 'javascript' },
      { name: 'Python', icon: 'python' },
      { name: 'C#', short: 'C#', color: '#9b4f96' },
    ],
  },
  {
    title: { pt: 'Visão & Ferramentas', en: 'Vision & Tools' },
    items: [
      { name: 'OpenCV', icon: 'opencv' },
      { name: 'Unity', icon: 'unity' },
      { name: 'Git', icon: 'git' },
      { name: 'GitHub', icon: 'github' },
    ],
  },
]

// Experiência no estilo "cartão com logos": empresa, cargos, destaques com ladrilhos de logo e pilha.
export const experience = [
  {
    logo: 'stara',
    org: 'Stara S/A',
    orgDetail: { pt: 'Máquinas e Implementos Agrícolas · Passo Fundo, RS', en: 'Agricultural Machinery · Passo Fundo, Brazil' },
    period: { from: '07/2023', to: null },
    current: true,
    summary: {
      pt: 'Desenvolvo os aplicativos e serviços por trás da telemetria e do controle das máquinas agrícolas da Stara, do app no celular até as APIs na nuvem.',
      en: "I build the apps and services behind the telemetry and control of Stara's agricultural machinery, from the mobile app to the cloud APIs.",
    },
    roles: [
      { title: { pt: 'Desenvolvedor Software Produto', en: 'Product Software Developer' }, from: '12/2025', to: null },
      { title: { pt: 'Analista Software Produto', en: 'Product Software Analyst' }, from: '03/2025', to: '12/2025' },
      { title: { pt: 'Estagiário', en: 'Intern' }, from: '07/2023', to: '02/2025' },
    ],
    highlights: [
      {
        logo: 'flutter',
        title: { pt: 'Apps Stara em Flutter', en: 'Stara apps in Flutter' },
        text: {
          pt: 'Desenvolvimento dos aplicativos da Stara para iOS e Android em Flutter/Dart.',
          en: "Development of Stara's iOS and Android apps in Flutter/Dart.",
        },
        tags: ['Valor Stara', 'Telemetria Stara', 'Versionamento Stara', 'Distribuição Stara', 'Pulverização Stara', 'Consórcio Stara'],
      },
      {
        logo: 'reactnative',
        title: { pt: 'Apps de máquina', en: 'Machine apps' },
        text: {
          pt: 'Aplicativos em React Native para controle das máquinas agrícolas.',
          en: 'React Native apps for controlling the agricultural machinery.',
        },
        tags: ['React Native', 'iOS', 'Android'],
      },
      {
        logo: 'amazonwebservices',
        title: { pt: 'APIs e nuvem', en: 'APIs & cloud' },
        text: {
          pt: 'Integração de APIs e serviços backend em Node.js e TypeScript, sobre AWS e bancos SQL e NoSQL.',
          en: 'API and backend service integration in Node.js and TypeScript, on AWS with SQL and NoSQL databases.',
        },
        tags: ['Node.js', 'TypeScript', 'AWS', 'SQL', 'NoSQL'],
      },
      {
        logo: 'usa',
        title: { pt: 'Integrações internacionais', en: 'International integrations' },
        text: {
          pt: 'Integração de sistemas com a FieldView e a Bayer, incluindo as reuniões técnicas com as equipes delas.',
          en: 'System integrations with FieldView and Bayer, including the technical meetings with their teams.',
        },
        tags: ['FieldView', 'Bayer'],
      },
    ],
    stack: ['flutter', 'dart', 'reactnative', 'nodedotjs', 'typescript', 'amazonwebservices', 'firebase'],
  },
  {
    logo: 'upf',
    org: 'Universidade de Passo Fundo (UPF)',
    orgDetail: { pt: 'Bacharelado em Ciência da Computação', en: "Bachelor's in Computer Science" },
    period: { from: '02/2022', to: '07/2026' },
    current: false,
    summary: {
      pt: 'Formação em Ciência da Computação, com projetos de apps, jogos e visão computacional.',
      en: 'Computer Science degree, with projects in apps, games and computer vision.',
    },
    highlights: [
      {
        logo: 'leaf',
        title: { pt: 'TCC: LeafScope', en: 'Thesis: LeafScope' },
        text: {
          pt: 'App que mede o dano foliar por visão computacional, orientado pelo Prof. Rafael Rieder.',
          en: 'App that measures leaf damage with computer vision, advised by Prof. Rafael Rieder.',
        },
        link: 'leafscope',
      },
      {
        logo: 'firebase',
        title: { pt: 'Lab. de Engenharia de Software', en: 'Software Engineering Lab' },
        text: {
          pt: 'SpendControl, app de gastos compartilhados em Flutter e Firebase.',
          en: 'SpendControl, a shared-expenses app built with Flutter and Firebase.',
        },
        link: 'spendcontrol',
      },
    ],
    stack: ['flutter', 'dart', 'opencv', 'firebase'],
  },
]
