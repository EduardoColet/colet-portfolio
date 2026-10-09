import * as THREE from 'three'
import { gsap } from 'gsap'

// Campo de partículas WebGL que muda de forma com o scroll:
// 0 esfera (hero) → 1 "</>" (sobre) → 2 nó toroidal (projetos) → 3 "EC" (contato).
// Cada partícula carrega as 4 posições-alvo como atributos; o vertex shader faz o morph
// com atraso individual, ruído simplex, repulsão do mouse e distorção pela velocidade do Lenis.

const noiseGLSL = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`

const vertexShader = /* glsl */ `
#define PI 3.14159265
uniform float uTime;
uniform float uMorph;
uniform float uIntro;
uniform float uSize;
uniform float uPixelRatio;
uniform float uVelocity;
uniform float uScale;
uniform float uMouseStrength;
uniform vec2 uMouse;
uniform vec2 uTilt;
uniform vec3 uOffset;
attribute vec3 aPos1;
attribute vec3 aPos2;
attribute vec3 aPos3;
attribute float aRandom;
attribute float aScale;
varying float vRandom;
varying float vGlow;
varying float vDepth;
varying float vDensity;

${noiseGLSL}

mat3 rotY(float a){float c=cos(a),s=sin(a);return mat3(c,0.,-s,0.,1.,0.,s,0.,c);}
mat3 rotX(float a){float c=cos(a),s=sin(a);return mat3(1.,0.,0.,0.,c,s,0.,-s,c);}

// Cada partícula começa a transição num momento ligeiramente diferente.
float stage(float k){
  float t=clamp((uMorph-k)*1.6-aRandom*0.6,0.,1.);
  return t*t*(3.-2.*t);
}

void main(){
  float t1=stage(0.);
  float t2=stage(1.);
  float t3=stage(2.);
  vec3 p=mix(position,aPos1,t1);
  p=mix(p,aPos2,t2);
  p=mix(p,aPos3,t3);

  // No meio de cada transição as partículas "explodem" num fluxo de ruído.
  float transition=sin(t1*PI)+sin(t2*PI)+sin(t3*PI);
  float tt=uTime*0.15;
  vec3 q=p*0.55;
  vec3 n=vec3(snoise(q+tt),snoise(q+vec3(31.4)+tt),snoise(q+vec3(57.2)+tt));
  p+=n*(0.05+transition*0.85+min(abs(uVelocity),40.)*0.012);

  // Entrada: "câmera" recua, como uma lente se ajustando.
  p*=mix(2.4+aRandom*0.8,1.0,uIntro);

  // Esticamento vertical proporcional à velocidade do scroll.
  p.y+=uVelocity*0.012*(aRandom-0.5);

  float sway=sin(uTime*0.25)*0.6*(1.-t3*0.85);
  p=rotY(sway+uTilt.x)*rotX(uTilt.y)*p;

  vec3 world=p*uScale+uOffset;

  vec2 d=world.xy-uMouse;
  float dist=length(d);
  float f=smoothstep(1.3,0.,dist)*uMouseStrength;
  world.xy+=normalize(d+1e-4)*f*0.7;
  world.z+=f*0.6;

  vec4 mv=modelViewMatrix*vec4(world,1.);
  gl_Position=projectionMatrix*mv;
  gl_PointSize=uSize*aScale*uPixelRatio*(1.+transition*0.35)/-mv.z;

  vRandom=aRandom;
  vGlow=clamp(f*1.5+transition*0.35,0.,1.);
  vDepth=smoothstep(-9.,-3.,mv.z);
  // As letras concentram muitas partículas: reduz o brilho para não saturar.
  vDensity=mix(1.,0.4,t3);
}
`

const fragmentShader = /* glsl */ `
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uOpacity;
varying float vRandom;
varying float vGlow;
varying float vDepth;
varying float vDensity;
void main(){
  float d=length(gl_PointCoord-0.5);
  float a=pow(smoothstep(0.5,0.,d),1.6);
  vec3 col=mix(uColorA,uColorB,step(0.78,vRandom));
  col=mix(col,uColorB,vGlow);
  gl_FragColor=vec4(col,a*uOpacity*vDensity*(0.35+vDepth*0.65));
}
`

// Passe de pós-processamento da entrada: lente barril, ondas concêntricas,
// moiré de linhas e aberração cromática que se dissipam conforme uReveal → 1.
const postVertex = /* glsl */ `
varying vec2 vUv;
void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }
`
const postFragment = /* glsl */ `
uniform sampler2D tDiffuse;
uniform float uReveal;
uniform float uTime;
uniform float uAspect;
varying vec2 vUv;
void main(){
  float k=1.-uReveal;
  vec2 c=vUv-.5;
  vec2 ca=vec2(c.x*uAspect,c.y);
  float d=length(ca);
  vec2 dir=c/max(length(c),1e-4);
  vec2 uv=c*(1.-k*.35+k*.9*d*d);
  uv+=dir*sin(d*70.-uTime*5.)*.012*k;
  uv+=.5;
  float split=.0015+k*.035;
  vec4 r=texture2D(tDiffuse,uv+c*split);
  vec4 g=texture2D(tDiffuse,uv);
  vec4 b=texture2D(tDiffuse,uv-c*split);
  vec3 col=vec3(r.r,g.g,b.b);
  float a=max(max(r.a,g.a),b.a);
  float scan=.5+.5*sin(d*1100.);
  col*=1.-k*.6*scan;
  gl_FragColor=vec4(col,a);
}
`

// Poeira flutuante no ar, como partículas de luz.
const dustVertex = /* glsl */ `
uniform float uTime;
uniform float uPixelRatio;
uniform float uIntro;
attribute float aRandom;
varying float vAlpha;
void main(){
  vec3 p=position;
  p.y=mod(p.y+uTime*(.08+aRandom*.12)+4.,8.)-4.;
  p.x+=sin(uTime*.3+aRandom*20.)*.25;
  vec4 mv=modelViewMatrix*vec4(p,1.);
  gl_Position=projectionMatrix*mv;
  gl_PointSize=(6.+aRandom*14.)*uPixelRatio/-mv.z;
  vAlpha=(.25+.75*(.5+.5*sin(uTime*(1.+aRandom*2.)+aRandom*40.)))*uIntro;
}
`
const dustFragment = /* glsl */ `
uniform vec3 uColor;
varying float vAlpha;
void main(){
  float d=length(gl_PointCoord-.5);
  gl_FragColor=vec4(uColor,pow(smoothstep(.5,0.,d),2.)*vAlpha*.8);
}
`

// ---------- Formas ----------
const rand = (a = -1, b = 1) => a + Math.random() * (b - a)

function sphere(count) {
  const out = new Float32Array(count * 3)
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const th = golden * i
    // 85% na superfície, o resto preenche o volume
    const R = 1.6 * (Math.random() < 0.85 ? 1 : Math.cbrt(Math.random()))
    out.set([Math.cos(th) * r * R, y * R, Math.sin(th) * r * R], i * 3)
  }
  return out
}

function torusKnot(count, p = 2, q = 3) {
  const out = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const t = Math.random() * Math.PI * 2
    const r = 1 + 0.45 * Math.cos(q * t)
    const cx = r * Math.cos(p * t)
    const cy = r * Math.sin(p * t)
    const cz = 0.45 * Math.sin(q * t)
    const tube = 0.22 * Math.sqrt(Math.random())
    const a = Math.random() * Math.PI * 2
    out.set([(cx + Math.cos(a) * tube) * 1.25, (cy + Math.sin(a) * tube) * 1.25, (cz + rand(-tube, tube)) * 1.25], i * 3)
  }
  return out
}

function text(count, label) {
  const w = 1024
  const h = 512
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  ctx.fillStyle = '#fff'
  ctx.font = '700 380px "Space Grotesk", sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(label, w / 2, h / 2)
  const data = ctx.getImageData(0, 0, w, h).data
  const pts = []
  for (let y = 0; y < h; y += 2) for (let x = 0; x < w; x += 2) if (data[(y * w + x) * 4 + 3] > 128) pts.push(x, y)
  const out = new Float32Array(count * 3)
  const n = pts.length / 2
  const size = 3.4
  for (let i = 0; i < count; i++) {
    const j = Math.floor(Math.random() * n)
    out.set([((pts[j * 2] - w / 2) / w) * size, (-(pts[j * 2 + 1] - h / 2) / w) * size, rand(-0.18, 0.18)], i * 3)
  }
  return out
}

// ---------- Cena ----------
export function initParticles({ lenis }) {
  const canvas = document.createElement('canvas')
  canvas.className = 'webgl'
  canvas.setAttribute('aria-hidden', 'true')
  document.body.prepend(canvas)

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'high-performance' })
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 50)
  camera.position.z = 6

  const isSmall = window.innerWidth < 768
  const count = isSmall ? 9000 : 18000

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(sphere(count), 3))
  geometry.setAttribute('aPos1', new THREE.BufferAttribute(torusKnot(count), 3))
  geometry.setAttribute('aPos2', new THREE.BufferAttribute(torusKnot(count), 3))
  geometry.setAttribute('aPos3', new THREE.BufferAttribute(sphere(count), 3))
  const randoms = new Float32Array(count).map(() => Math.random())
  const scales = new Float32Array(count).map(() => 0.4 + Math.pow(Math.random(), 3) * 1.4)
  geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))
  geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))

  // As iniciais só são amostradas depois que a fonte carrega.
  document.fonts.load('700 380px "Space Grotesk"').finally(() => {
    geometry.setAttribute('aPos1', new THREE.BufferAttribute(text(count, '</>'), 3))
    geometry.setAttribute('aPos3', new THREE.BufferAttribute(text(count, 'EC'), 3))
  })

  const uniforms = {
    uTime: { value: 0 },
    uMorph: { value: 0 },
    uIntro: { value: 0 },
    uSize: { value: 30 },
    uPixelRatio: { value: 1 },
    uVelocity: { value: 0 },
    uScale: { value: 1 },
    uMouseStrength: { value: 0 },
    uMouse: { value: new THREE.Vector2(99, 99) },
    uTilt: { value: new THREE.Vector2() },
    uOffset: { value: new THREE.Vector3() },
    uOpacity: { value: 0.9 },
    uColorA: { value: new THREE.Color('#eeecf3') },
    uColorB: { value: new THREE.Color('#a385ff') },
  }

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  scene.add(new THREE.Points(geometry, material))

  const dustCount = isSmall ? 120 : 260
  const dustGeo = new THREE.BufferGeometry()
  const dustPos = new Float32Array(dustCount * 3)
  for (let i = 0; i < dustCount; i++) dustPos.set([rand(-7, 7), rand(-4, 4), rand(-4, 2.5)], i * 3)
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3))
  dustGeo.setAttribute('aRandom', new THREE.BufferAttribute(new Float32Array(dustCount).map(() => Math.random()), 1))
  const dustMaterial = new THREE.ShaderMaterial({
    vertexShader: dustVertex,
    fragmentShader: dustFragment,
    uniforms: {
      uTime: uniforms.uTime,
      uPixelRatio: uniforms.uPixelRatio,
      uIntro: uniforms.uIntro,
      uColor: { value: new THREE.Color('#e6dcff') },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  scene.add(new THREE.Points(dustGeo, dustMaterial))

  // Cena renderizada num alvo e passada pela lente enquanto a entrada acontece.
  const target = new THREE.WebGLRenderTarget(1, 1)
  const postUniforms = {
    tDiffuse: { value: target.texture },
    uReveal: { value: 0 },
    uTime: uniforms.uTime,
    uAspect: { value: 1 },
  }
  const postScene = new THREE.Scene()
  const postCamera = new THREE.Camera()
  postScene.add(
    new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({ vertexShader: postVertex, fragmentShader: postFragment, uniforms: postUniforms, depthTest: false, depthWrite: false }),
    ),
  )

  // Posição horizontal da forma em cada etapa (desktop). No mobile fica centralizada.
  const offsetsX = [1.7, 2.8, 0, 2.2]
  const offsetsY = [0, 0, 0, -0.2]
  let narrow = false
  // Deslocamento extra para a direita enquanto a Trajetória está na tela (texto à esquerda).
  const drift = { x: 0 }

  const resize = () => {
    const w = window.innerWidth
    const h = window.innerHeight
    narrow = w / h < 1
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    uniforms.uPixelRatio.value = renderer.getPixelRatio()
    target.setSize(w * renderer.getPixelRatio(), h * renderer.getPixelRatio())
    postUniforms.uAspect.value = w / h
    uniforms.uScale.value = narrow ? 0.62 : 1
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }
  resize()
  window.addEventListener('resize', resize)

  // Mouse → coordenadas do plano z=0
  const mouseTarget = new THREE.Vector2(99, 99)
  const tiltTarget = new THREE.Vector2()
  let lastMove = 0
  window.addEventListener('pointermove', (e) => {
    const nx = (e.clientX / window.innerWidth) * 2 - 1
    const ny = -(e.clientY / window.innerHeight) * 2 + 1
    const halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z
    mouseTarget.set(nx * halfH * camera.aspect, ny * halfH)
    tiltTarget.set(nx * 0.35, -ny * 0.25)
    lastMove = performance.now()
  })

  let velocity = 0
  lenis.on('scroll', (e) => (velocity = e.velocity))

  const tick = (time) => {
    uniforms.uTime.value = time
    const lerp = THREE.MathUtils.lerp
    uniforms.uVelocity.value = lerp(uniforms.uVelocity.value, velocity, 0.12)
    velocity *= 0.9
    uniforms.uMouse.value.lerp(mouseTarget, 0.12)
    uniforms.uTilt.value.lerp(tiltTarget, 0.05)
    const active = performance.now() - lastMove < 1500 ? 1 : 0
    uniforms.uMouseStrength.value = lerp(uniforms.uMouseStrength.value, active, 0.05)

    const m = uniforms.uMorph.value
    const i = Math.min(Math.floor(m), 2)
    const f = gsap.parseEase('power2.inOut')(m - i)
    const off = uniforms.uOffset.value
    off.x = narrow ? 0 : lerp(offsetsX[i], offsetsX[i + 1], f) + drift.x
    off.y = narrow ? 0.4 : lerp(offsetsY[i], offsetsY[i + 1], f)

    // Depois da entrada, a lente fica com uma aberração cromática residual leve.
    renderer.setRenderTarget(target)
    renderer.clear()
    renderer.render(scene, camera)
    renderer.setRenderTarget(null)
    renderer.render(postScene, postCamera)
  }
  gsap.ticker.add(tick)

  return {
    uniforms,
    postUniforms,
    // Mistura aditiva some no fundo claro: no tema claro as partículas ficam escuras e com mistura normal.
    setTheme(mode) {
      const light = mode === 'light'
      uniforms.uColorA.value.set(light ? '#5d5870' : '#eeecf3')
      uniforms.uOpacity.value = light ? 0.55 : 0.9
      uniforms.uSize.value = light ? 22 : 30
      uniforms.uColorB.value.set(light ? '#6a3fe0' : '#a385ff')
      dustMaterial.uniforms.uColor.value.set(light ? '#8b6fd6' : '#e6dcff')
      for (const m of [material, dustMaterial]) {
        m.blending = light ? THREE.NormalBlending : THREE.AdditiveBlending
        m.needsUpdate = true
      }
    },
    // Liga cada mudança de forma a um trecho do scroll.
    bindScroll() {
      const steps = [
        { trigger: '.about', start: 'top bottom', end: 'top 25%' },
        { trigger: '.projects', start: 'top 90%', end: 'top top' },
        { trigger: '.contact', start: 'top bottom', end: 'top 20%' },
      ]
      gsap.fromTo(drift, { x: 0 }, { x: 2.4, ease: 'none', immediateRender: false, scrollTrigger: { trigger: '.timeline', start: 'top bottom', end: 'top 40%', scrub: 1.2 } })
      gsap.fromTo(drift, { x: 2.4 }, { x: 0, ease: 'none', immediateRender: false, scrollTrigger: { trigger: '.contact', start: 'top bottom', end: 'top 20%', scrub: 1.2 } })
      steps.forEach((s, k) => {
        gsap.fromTo(
          uniforms.uMorph,
          { value: k },
          { value: k + 1, ease: 'none', immediateRender: false, scrollTrigger: { ...s, scrub: 1.2 } },
        )
      })
    },
  }
}
