// Projetos. Cada um tem cor, mídia e página própria (/projeto/?p=<slug>).
// Quando publicar na Vercel, preencha `demo` com a URL: o botão "Abrir demo" aparece sozinho.
// Mídia: imagens e vídeos baixados dos READMEs dos repositórios (public/projects/<slug>/).
// O ano vem das datas dos repositórios no GitHub.

const media = (slug, file) => `/projects/${slug}/${file}`

export const projects = [
  {
    slug: 'leafscope',
    title: 'LeafScope',
    year: 2026,
    color: '#5dbb3f',
    kind: { pt: 'TCC · App mobile', en: 'Thesis · Mobile app' },
    tagline: { pt: 'Quantificação de dano foliar com visão computacional', en: 'Leaf damage quantification with computer vision' },
    summary: {
      pt: 'App Flutter que mede o percentual de dano de uma folha a partir de uma foto. A forma original é reconstruída por Convex Hull e tudo roda no próprio celular, sem internet e sem IA.',
      en: 'Flutter app that measures the damage percentage of a leaf from a photo. The original shape is rebuilt with Convex Hull and everything runs on the phone, with no internet and no AI.',
    },
    about: [
      {
        pt: 'A ideia é geométrica: esticar um "elástico" em volta da folha (o Convex Hull) preenche as mordidas nas bordas e aproxima a forma original. A diferença entre a forma reconstruída e a folha real é o dano.',
        en: 'The idea is geometric: stretching a "rubber band" around the leaf (the Convex Hull) fills the bites on the edges and approximates the original shape. The difference between the rebuilt shape and the real leaf is the damage.',
      },
      {
        pt: 'O pipeline converte a imagem para HSV, segmenta tons verdes e amarronzados, limpa ruídos com morfologia, encontra o maior contorno, calcula o hull e detecta buracos internos. Roda em um Isolate separado com OpenCV nativo via FFI.',
        en: 'The pipeline converts the image to HSV, segments green and brownish tones, cleans noise with morphology, finds the largest contour, computes the hull and detects inner holes. It runs in a separate Isolate with native OpenCV through FFI.',
      },
      {
        pt: 'Trabalho de Conclusão de Curso em Ciência da Computação na UPF, orientado pelo Prof. Rafael Rieder e validado por profissionais de Ciências Agrárias.',
        en: 'Computer Science thesis at UPF, advised by Prof. Rafael Rieder and validated by Agricultural Sciences professionals.',
      },
    ],
    highlights: [
      { icon: 'leaf', text: { pt: 'Severidade de Leve a Crítico, com percentual de dano e métricas por área', en: 'Severity from Mild to Critical, with damage percentage and area metrics' } },
      { icon: 'chart', text: { pt: 'Pearson 0,96–0,97 e MAE de 1,5–1,7 p.p. na validação', en: 'Pearson 0.96–0.97 and 1.5–1.7 p.p. MAE in validation' } },
      { icon: 'phone', text: { pt: 'Calibração de escala para cm², histórico local e exportação em PDF', en: 'Scale calibration to cm², local history and PDF export' } },
      { icon: 'users', text: { pt: 'Nota SUS 87,5 em testes com usuários', en: 'SUS score of 87.5 in user tests' } },
    ],
    stack: ['flutter', 'dart', 'opencv', 'hive'],
    repo: 'https://github.com/EduardoColet/Leaf-reconstruction-damage',
    demo: null,
    layout: 'phones',
    cover: ['home', 'resultado', 'reconstrucao'].map((f) => media('leafscope', `${f}.jpg`)),
    gallery: [
      ['home', { pt: 'Início', en: 'Home' }],
      ['tutorial', { pt: 'Tutorial', en: 'Tutorial' }],
      ['captura', { pt: 'Captura', en: 'Capture' }],
      ['imagens-teste', { pt: 'Imagens de teste', en: 'Test images' }],
      ['resultado', { pt: 'Resultado', en: 'Result' }],
      ['reconstrucao', { pt: 'Reconstrução', en: 'Reconstruction' }],
      ['calibracao', { pt: 'Calibração', en: 'Calibration' }],
      ['metricas', { pt: 'Métricas em cm²', en: 'Metrics in cm²' }],
    ].map(([f, caption]) => ({ src: media('leafscope', `${f}.jpg`), caption })),
    galleryShape: 'tall',
  },
  {
    slug: 'honors-trail',
    title: "Honor's Trail",
    year: 2026,
    color: '#c2456b',
    kind: { pt: 'Jogo 2D · Unity', en: '2D game · Unity' },
    tagline: { pt: 'Plataforma 2D em pixel art', en: 'Pixel-art 2D platformer' },
    summary: {
      pt: 'Uma guerreira atravessa ruínas cheias de esqueletos, gárgulas, espinhos e plataformas que desabam até a bandeira no fim da fase, buscando a maior pontuação no menor tempo.',
      en: 'A warrior crosses ruins full of skeletons, gargoyles, spikes and collapsing platforms to reach the flag at the end of the level, chasing the highest score in the shortest time.',
    },
    about: [
      {
        pt: 'Feito na Unity com C#: movimento com pulo duplo, ataque com espada, vida, pontuação e cronômetro na HUD.',
        en: 'Built in Unity with C#: movement with double jump, sword attack, health, score and a timer on the HUD.',
      },
      {
        pt: 'Dois tipos de inimigo com comportamentos diferentes: o esqueleto patrulha e ataca de perto, a gárgula espera você entrar na área dela e então persegue. A dificuldade define quantos golpes cada um aguenta.',
        en: 'Two enemy types with different behaviors: the skeleton patrols and attacks up close, the gargoyle waits for you to enter its area and then chases you. Difficulty sets how many hits each one takes.',
      },
      {
        pt: 'Recordes salvos por dificuldade: vence quem fizer mais pontos e, no empate, o menor tempo.',
        en: 'Records saved per difficulty: the highest score wins and, on a tie, the shortest time.',
      },
    ],
    highlights: [
      { icon: 'gamepad', text: { pt: 'Teclado e controle, com pulo duplo e ataque', en: 'Keyboard and gamepad, with double jump and attack' } },
      { icon: 'layers', text: { pt: 'Armadilhas: espinhos e plataformas que caem e voltam', en: 'Traps: spikes and platforms that fall and come back' } },
      { icon: 'sparkles', text: { pt: 'Três dificuldades e recordes locais', en: 'Three difficulty levels and local records' } },
    ],
    stack: ['unity', 'csharp'],
    repo: 'https://github.com/EduardoColet/Unity-2D-Plataform-Game',
    demo: null,
    layout: 'screen',
    video: { webm: media('honors-trail', 'gameplay.webm'), mp4: media('honors-trail', 'gameplay.mp4'), poster: media('honors-trail', 'gameplay.jpg') },
    gallery: [
      ['menu', { pt: 'Menu principal', en: 'Main menu' }],
      ['dificuldade', { pt: 'Escolha de dificuldade', en: 'Difficulty selection' }],
      ['gameplay', { pt: 'Gameplay', en: 'Gameplay' }],
      ['pausa', { pt: 'Pausa', en: 'Pause' }],
      ['vitoria', { pt: 'Vitória', en: 'Victory' }],
      ['game-over', { pt: 'Game over', en: 'Game over' }],
    ].map(([f, caption]) => ({ src: media('honors-trail', `${f}.jpg`), caption })),
    galleryShape: 'wide',
  },
  {
    slug: 'workbenchdev',
    title: 'WorkbenchDev',
    year: 2026,
    color: '#4ade80',
    kind: { pt: 'Site · Landing page', en: 'Website · Landing page' },
    tagline: { pt: 'Sites, landing pages e web apps', en: 'Websites, landing pages and web apps' },
    summary: {
      pt: 'Site institucional da workbenchdev.com, com animações de entrada, seções de soluções e contato direto pelo WhatsApp.',
      en: 'Company website for workbenchdev.com, with entrance animations, solution sections and direct contact through WhatsApp.',
    },
    about: [
      {
        pt: 'Página única em HTML, CSS e JavaScript, sem framework, com revelação do título por palavras e um brilho verde de fundo.',
        en: 'Single page in HTML, CSS and JavaScript, with no framework, a word-by-word title reveal and a green background glow.',
      },
    ],
    highlights: [
      { icon: 'code', text: { pt: 'HTML, CSS e JavaScript puros', en: 'Plain HTML, CSS and JavaScript' } },
      { icon: 'sparkles', text: { pt: 'Animações de entrada e de scroll', en: 'Entrance and scroll animations' } },
    ],
    stack: ['html5', 'css3', 'javascript'],
    repo: 'https://github.com/EduardoColet/workbenchdev-site',
    demo: null,
    layout: 'browser',
    url: 'workbenchdev.com',
    video: { webm: media('workbenchdev', 'scroll.webm'), mp4: media('workbenchdev', 'scroll.mp4'), poster: media('workbenchdev', 'desktop.jpg') },
    gallery: [
      ['desktop', { pt: 'Início', en: 'Home' }],
      ['desktop-2', { pt: 'Soluções', en: 'Solutions' }],
      ['desktop-3', { pt: 'Seções', en: 'Sections' }],
    ].map(([f, caption]) => ({ src: media('workbenchdev', `${f}.jpg`), caption })),
    galleryShape: 'wide',
  },
  {
    slug: 'crypto-watch',
    title: 'Crypto Watch',
    year: 2025,
    color: '#f7931a',
    kind: { pt: 'App · Ionic/Angular', en: 'App · Ionic/Angular' },
    tagline: { pt: 'Mercado cripto, carteira e insights', en: 'Crypto market, wallet and insights' },
    summary: {
      pt: 'App para acompanhar o mercado cripto, gerir uma carteira local e ver destaques em tempo real com dados da CoinGecko.',
      en: 'App to follow the crypto market, manage a local wallet and see real-time highlights with CoinGecko data.',
    },
    about: [
      {
        pt: 'Mercado com as 50 maiores moedas, busca por nome ou ticker e detalhes de cada moeda: preço, máxima e mínima de 24h, market cap e volume.',
        en: 'Market with the top 50 coins, search by name or ticker and details for each coin: price, 24h high and low, market cap and volume.',
      },
      {
        pt: 'Carteira local com posições, valor total e lucro ou prejuízo calculado contra o preço atual. A aba Pulse reúne maiores altas e quedas, tendências de 7 e 30 dias e moedas perto da máxima histórica.',
        en: 'Local wallet with positions, total value and profit or loss against the current price. The Pulse tab gathers top gainers and losers, 7 and 30 day trends and coins near their all-time high.',
      },
    ],
    highlights: [
      { icon: 'chart', text: { pt: 'Dados em tempo real da API CoinGecko', en: 'Real-time data from the CoinGecko API' } },
      { icon: 'wallet', text: { pt: 'Carteira com P/L por posição', en: 'Wallet with P/L per position' } },
      { icon: 'sparkles', text: { pt: 'Insights: altas, quedas, volume e volatilidade', en: 'Insights: gainers, losers, volume and volatility' } },
    ],
    stack: ['ionic', 'angular', 'typescript', 'capacitor'],
    repo: 'https://github.com/EduardoColet/crypto_watch_ionic',
    demo: 'https://crypto-watch-ionic.vercel.app',
    layout: 'cover',
    coverIcon: 'chart',
  },
  {
    slug: 'leaf-health',
    title: 'Leaf Health',
    year: 2025,
    color: '#22b8a0',
    kind: { pt: 'App · Deep Learning', en: 'App · Deep Learning' },
    tagline: { pt: 'Detector de doenças em folhas', en: 'Leaf disease detector' },
    summary: {
      pt: 'App Flutter que fotografa uma folha e envia para uma API com um modelo de Deep Learning, que devolve o diagnóstico da doença.',
      en: 'Flutter app that takes a photo of a leaf and sends it to an API with a Deep Learning model, which returns the disease diagnosis.',
    },
    about: [
      {
        pt: 'Projeto em equipe com Carlos Eduardo Batista e Enzo Zanatta. O app usa provider para o estado, http para falar com a API e image_picker para câmera e galeria.',
        en: 'Team project with Carlos Eduardo Batista and Enzo Zanatta. The app uses provider for state, http to talk to the API and image_picker for camera and gallery.',
      },
    ],
    highlights: [
      { icon: 'leaf', text: { pt: 'Diagnóstico de doenças a partir de uma foto', en: 'Disease diagnosis from a photo' } },
      { icon: 'cloud', text: { pt: 'Inferência em uma API de Deep Learning', en: 'Inference on a Deep Learning API' } },
      { icon: 'users', text: { pt: 'Projeto em equipe', en: 'Team project' } },
    ],
    stack: ['flutter', 'dart', 'tensorflow'],
    repo: 'https://github.com/EduardoColet/leaf_health_app',
    demo: null,
    layout: 'cover',
    coverIcon: 'leaf',
  },
  {
    slug: 'spendcontrol',
    title: 'SpendControl',
    year: 2025,
    color: '#7c6cff',
    kind: { pt: 'App · Lab. Eng. de Software', en: 'App · Software Eng. Lab' },
    tagline: { pt: 'Controle de gastos compartilhados', en: 'Shared expense tracking' },
    summary: {
      pt: 'App para dividir e controlar gastos compartilhados, desenvolvido no Laboratório de Engenharia de Software da UPF.',
      en: 'App to split and track shared expenses, built in the Software Engineering Lab at UPF.',
    },
    about: [
      {
        pt: 'Desenvolvido em Flutter com Firebase como backend, aplicando as práticas de engenharia de software da disciplina.',
        en: 'Built in Flutter with Firebase as the backend, applying the software engineering practices from the course.',
      },
    ],
    highlights: [
      { icon: 'wallet', text: { pt: 'Gastos divididos entre pessoas', en: 'Expenses split between people' } },
      { icon: 'cloud', text: { pt: 'Backend no Firebase', en: 'Firebase backend' } },
    ],
    stack: ['flutter', 'dart', 'firebase'],
    repo: 'https://github.com/EduardoColet/CCC_LabEngSoft_Eduardo_Colet_SpendControllApp',
    demo: null,
    layout: 'cover',
    coverIcon: 'wallet',
  },
]

export const projectUrl = (slug) => `/projeto/?p=${slug}`
export const findProject = (slug) => projects.find((p) => p.slug === slug)
