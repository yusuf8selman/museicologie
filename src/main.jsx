import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactDOM from "react-dom/client";
import * as THREE from "three";
import { PRODUCTS } from "./data/products.js";
import { CV_ITEMS_ALL, CV_ITEMS } from "./data/cvItems.js";
import { TRANSLATIONS } from "./data/translations.js";
import { FG, FG_DIM, FG_GLOW, CSS } from "./styles.js";

const isMobile = () => window.innerWidth <= 768;

const EQ_CONFIG = [
  { label: "Hicaz",   freq: 0.14, phase: 0.0,  minH: 0.10, maxH: 0.90 },
  { label: "Rast",    freq: 0.19, phase: 2.5,  minH: 0.10, maxH: 0.82 },
  { label: "Buselik", freq: 0.11, phase: 4.9,  minH: 0.10, maxH: 0.94 },
  { label: "Segah",   freq: 0.17, phase: 1.6,  minH: 0.10, maxH: 0.86 },
  { label: "Uşşak",  freq: 0.22, phase: 3.4,  minH: 0.10, maxH: 0.75 },
];

function EqVisualizer() {
  const svgRef = useRef(null);
  useEffect(() => {
    let animId;
    const t0 = performance.now();
    function frame(now) {
      const t = (now - t0) / 1000;
      const svg = svgRef.current;
      if (!svg) return;
      EQ_CONFIG.forEach((b, i) => {
        const rect = svg.getElementById("eqr" + i);
        if (!rect) return;
        const raw = (Math.sin(t * b.freq * Math.PI * 2 + b.phase) + 1) / 2;
        const scale = b.minH + raw * (b.maxH - b.minH);
        rect.style.transform = "scaleY(" + scale.toFixed(3) + ")";
        const norm = (scale - b.minH) / (b.maxH - b.minH);
        rect.style.fill = "rgba(255,255,255," + (0.12 + norm * 0.28).toFixed(2) + ")";
      });
      animId = requestAnimationFrame(frame);
    }
    animId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animId);
  }, []);
  return (
    <div className="msc-radial-tree">
      <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 260 210" preserveAspectRatio="xMidYMid meet">
        {EQ_CONFIG.map((b, i) => {
          const x = 20 + i * 48;
          return (
            <g key={b.label}>
              <rect id={`eqr${i}`} x={x} y={25} width={28} height={150}
                fill="rgba(255,255,255,0.18)" rx={2}
                style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }} />
              <text x={x + 14} y={200} textAnchor="middle"
                fontFamily="'Outfit', sans-serif" fontWeight="200"
                fontSize="9" letterSpacing="0.5" fill="rgba(255,255,255,0.32)">
                {b.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function QuizVisualizer() {
  const [phase, setPhase] = useState("counting");
  const [count, setCount] = useState(3);
  useEffect(() => {
    const ts = [];
    function loop() {
      setPhase("counting"); setCount(3);
      ts.push(setTimeout(() => setCount(2), 1000));
      ts.push(setTimeout(() => setCount(1), 2000));
      ts.push(setTimeout(() => setPhase("selected"), 3000));
      ts.push(setTimeout(() => setPhase("revealed"), 4000));
      ts.push(setTimeout(() => setPhase("resetting"), 5600));
      ts.push(setTimeout(loop, 6400));
    }
    loop();
    return () => ts.forEach(clearTimeout);
  }, []);
  const opts = ["Buselik", "Rast", "Segah", "Çargah"];
  function optStyle(opt) {
    if (phase === "revealed") {
      if (opt === "Çargah") return { bg: "rgba(190,50,50,0.28)", border: "rgba(200,70,70,0.75)", color: "rgba(255,110,110,0.95)" };
      if (opt === "Segah")  return { bg: "rgba(45,160,65,0.25)", border: "rgba(60,185,80,0.70)", color: "rgba(90,215,110,0.95)" };
    }
    if (opt === "Çargah" && phase === "selected") {
      return { bg: "rgba(255,255,255,0.11)", border: "rgba(255,255,255,0.38)", color: "rgba(255,255,255,0.92)" };
    }
    return { bg: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.13)", color: "rgba(255,255,255,0.42)" };
  }
  return (
    <div style={{
      position: "relative",
      width: "100%", height: "100%",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "12px 18px", boxSizing: "border-box",
      opacity: phase === "resetting" ? 0 : 1,
      transition: phase === "resetting" ? "opacity 0.65s ease" : "opacity 0.1s",
      gap: "10px",
    }}>
      <div style={{
        position: "absolute", top: "10px", right: "14px",
        fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "22px",
        color: count === 1 ? "rgba(212,165,32,0.85)" : "rgba(255,255,255,0.35)",
        transition: "color 0.35s ease", lineHeight: 1,
      }}>
        {phase === "counting" ? count : ""}
      </div>
      <div style={{
        fontFamily: "'Outfit', sans-serif", fontWeight: 300, fontSize: "10px",
        letterSpacing: "0.6px", color: "rgba(255,255,255,0.62)",
        textAlign: "center", lineHeight: 1.55, maxWidth: "240px",
      }}>
        Si bir koma bemol notasının adı nedir?
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", width: "100%", maxWidth: "270px" }}>
        {opts.map(opt => {
          const s = optStyle(opt);
          return (
            <div key={opt} style={{
              background: s.bg, border: "1px solid " + s.border, color: s.color,
              fontFamily: "'Outfit', sans-serif", fontWeight: 300,
              fontSize: "9.5px", letterSpacing: "1.5px",
              padding: "7px 4px", textAlign: "center", borderRadius: "1px",
              transition: "background 0.5s ease, border-color 0.5s ease, color 0.5s ease",
            }}>
              {opt}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function UsulVisualizer() {
  const svgRef = useRef(null);
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    // FALL_TIME=4000ms. Düm every 2000ms, Tek every 1000ms (Düm-Tek-Tek pattern).
    // For circle at (elapsed+off)%FALL_TIME: it appears at top when elapsed = FALL_TIME-off.
    // Düm appears at elapsed 0, 2000 → offs 0, 2000
    // Tek1 appears at elapsed 667, 2667 → offs 4000-667=3333, 4000-2667=1333
    // Tek2 appears at elapsed 1333, 3333 → offs 4000-1333=2667, 4000-3333=667
    const FALL = 4000;
    const cfg = [
      { cx: 185, r: 13, sw: 1.5, op: 0.62, off: 0    },
      { cx: 185, r: 13, sw: 1.5, op: 0.62, off: 2000  },
      { cx: 70,  r: 9,  sw: 1.0, op: 0.38, off: 3333  },
      { cx: 70,  r: 9,  sw: 1.0, op: 0.38, off: 1333  },
      { cx: 70,  r: 9,  sw: 1.0, op: 0.38, off: 2667  },
      { cx: 70,  r: 9,  sw: 1.0, op: 0.38, off: 667   },
    ];
    const firstText = svg.querySelector("text");
    const circles = cfg.map(c => {
      const el = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      el.setAttribute("cx", c.cx);
      el.setAttribute("r", c.r);
      el.setAttribute("fill", "none");
      el.setAttribute("stroke", c.cx === 185 ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.42)");
      el.setAttribute("stroke-width", c.sw);
      svg.insertBefore(el, firstText);
      return { el, ...c };
    });
    let animId;
    const t0 = performance.now();
    function frame(now) {
      const elapsed = now - t0;
      circles.forEach(c => {
        const t = (elapsed + c.off) % FALL;
        const p = t / FALL;
        const cy = -18 + p * 258;
        const alpha = p < 0.06 ? p / 0.06 : p > 0.88 ? (1 - p) / 0.12 : 1;
        c.el.setAttribute("cy", cy.toFixed(1));
        c.el.setAttribute("opacity", (alpha * c.op).toFixed(3));
      });
      animId = requestAnimationFrame(frame);
    }
    animId = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(animId); circles.forEach(c => c.el.remove()); };
  }, []);
  return (
    <div className="msc-radial-tree">
      <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 260 220" preserveAspectRatio="xMidYMid meet">
        <text x="70" y="215" textAnchor="middle" fontFamily="'Outfit', sans-serif"
          fontWeight="200" fontSize="9" letterSpacing="2" fill="rgba(255,255,255,0.28)">TEK</text>
        <text x="185" y="215" textAnchor="middle" fontFamily="'Outfit', sans-serif"
          fontWeight="200" fontSize="9" letterSpacing="2" fill="rgba(255,255,255,0.28)">DÜM</text>
      </svg>
    </div>
  );
}

export default function Museicologie() {
  const [lang, setLang] = useState("tr");
  const [langOpen, setLangOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [transitionState, setTransitionState] = useState("");
  const [detailClosing, setDetailClosing] = useState(false);
  const [entered, setEntered] = useState(false);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [cvState, setCvState] = useState("hidden");
  const [cvSelected, setCvSelected] = useState(0);
  const cvSelectedRef = useRef(0);
  const cvWheelCooldownRef = useRef(0);
  cvSelectedRef.current = cvSelected;

  const t = TRANSLATIONS[lang];

  // Close language dropdown when clicking outside
  useEffect(() => {
    if (!langOpen) return;
    const close = () => setLangOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [langOpen]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const canvasRef = useRef(null);
  const frameRef = useRef(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const rendererRef = useRef(null);
  const mouseLightRef = useRef(null);
  const bgCanvasRef = useRef(null);
  const cvCanvasRef = useRef(null);
  const cvAnimRef = useRef(null);
  const cvStateRef = useRef("hidden");
  // Stores {canvas, tex} for each label plane so we can redraw on lang change
  const cvLabelTexRef = useRef([]);

  // Mouse / touch tracking
  useEffect(() => {
    const applyPointer = (cx, cy) => {
      const x = (cx / window.innerWidth) * 100;
      const y = (cy / window.innerHeight) * 100;
      if (mouseLightRef.current) {
        mouseLightRef.current.style.left = `${x}%`;
        mouseLightRef.current.style.top = `${y}%`;
      }
      mouseRef.current = { x: cx / window.innerWidth, y: cy / window.innerHeight };
      if (!window.__mscMouse) window.__mscMouse = new THREE.Vector2(0.5, 0.5);
      window.__mscMouse.set(mouseRef.current.x, 1.0 - mouseRef.current.y);
    };
    const onMove  = (e) => applyPointer(e.clientX, e.clientY);
    const onTouch = (e) => { if (e.touches[0]) applyPointer(e.touches[0].clientX, e.touches[0].clientY); };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onTouch, { passive: true });
    setEntered(true);
    if (mouseLightRef.current) { mouseLightRef.current.style.left = `50%`; mouseLightRef.current.style.top = `50%`; }
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
    };
  }, []);

  // Background Fluid Shader
  useEffect(() => {
    const canvas = bgCanvasRef.current;
    if (!canvas) return;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: false, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 2);
    camera.position.z = 1;
    
    const TRAIL_SIZE = 25;
    const initialTrail = new Array(TRAIL_SIZE).fill(null).map(() => new THREE.Vector2(0.5, 0.5));
    
    const uniforms = {
      u_time: { value: 0.0 },
      u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
      u_trail: { value: initialTrail },
      u_velocity: { value: 0.0 },
      u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    };

    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: `
        varying vec2 vUv;
        void main() { 
          vUv = uv; 
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); 
        }
      `,
      fragmentShader: `
        uniform float u_time;
        uniform vec2 u_mouse;
        uniform vec2 u_trail[25];
        uniform float u_velocity;
        uniform vec2 u_resolution;
        varying vec2 vUv;

        float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
        float noise(vec2 p) {
          vec2 i = floor(p); vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), f.x),
                     mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
        }
        float fbm(vec2 x) {
          float v = 0.0; float a = 0.5; vec2 shift = vec2(100.0);
          mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
          for (int i = 0; i < 5; ++i) {
            v += a * noise(x); x = rot * x * 2.0 + shift; a *= 0.5;
          }
          return v;
        }

        void main() {
          vec2 st = gl_FragCoord.xy / u_resolution.xy;
          float aspect = u_resolution.x / u_resolution.y;
          st.x *= aspect;
          
          float totalRipple = 0.0;
          float totalDistortion = 0.0;
          vec2 totalDir = vec2(0.0);
          
          float vel = clamp(u_velocity * 4.0, 0.0, 1.0);

          // Iterate through the historical trail points (loop manually unrolled for strict GLSL ES 1.0 compatibility)
          ` + new Array(25).fill(0).map((_, i) => `
          {
             float age = ${i}.0 / 25.0; 
             float decay = 1.0 - age;
             decay *= decay; 
             
             vec2 trailPos = u_trail[${i}];
             trailPos.x *= aspect;
             
             vec2 diff = st - trailPos;
             float dist = length(diff);
             vec2 dir = dist > 0.0001 ? diff / dist : vec2(0.0);
             
             float maxRadius = mix(0.015, 0.06, vel);
             float mask = smoothstep(maxRadius, maxRadius * 0.1, dist);
             
             float wave = sin(dist * 120.0 - u_time * 15.0 - age * 8.0);
             
             totalRipple += wave * mask * decay * 0.02;
             totalDistortion += exp(-dist * 25.0) * decay * 0.03 * mask;
             totalDir += dir * mask * decay;
          }
          `).join('') + `
          
          vec2 avgDir = length(totalDir) > 0.0001 ? normalize(totalDir) : vec2(0.0);
          
          // Velocity multiplying output ensures instantaneous flatness when mouse completely stops
          vec2 uv = vUv + avgDir * (totalDistortion + totalRipple) * vel;

          // Cloudy, realistic metallic brass simulation
          vec3 color1 = vec3(0.92, 0.77, 0.44); // Lighter gold
          vec3 color2 = vec3(0.59, 0.40, 0.14); // Darker vintage gold
          
          // Use FBM (Fractal Brownian Motion) instead of simple distance
          float n = fbm(uv * 3.0 + fbm(uv * 1.5 + u_time * 0.02));
          vec3 color = mix(color2, color1, clamp(n * 1.2, 0.0, 1.0));

          // Fine grit overlay
          float grain = noise(uv * 1000.0);
          color *= (0.9 + 0.1 * grain);

          // Specular highlights mapped to the fluid ripples
          float pointerDist = length(st - (u_mouse * vec2(aspect, 1.0)));
          float highlight = smoothstep(0.04, 0.0, pointerDist) * smoothstep(0.0, 0.04, pointerDist) * vel;
          color += vec3(0.5, 0.4, 0.15) * highlight;
          color += vec3(0.3, 0.2, 0.0) * max(0.0, totalRipple) * 20.0;

          gl_FragColor = vec4(color, 1.0);
        }
      `
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const resize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      uniforms.u_resolution.value.set(
        window.innerWidth * renderer.getPixelRatio(),
        window.innerHeight * renderer.getPixelRatio()
      );
    };
    window.addEventListener('resize', resize);
    resize();

    let mouseLerp = new THREE.Vector2(0.5, 0.5);
    let velocitySmooth = 0.0;
    let req;

    let trail = new Array(TRAIL_SIZE).fill(null).map(() => new THREE.Vector2(0.5, 0.5));

    const animate = (time) => {
      const targetMouse = window.__mscMouse || new THREE.Vector2(0.5, 0.5);
      
      // Calculate delta distance for velocity
      const dx = targetMouse.x - mouseLerp.x;
      const dy = targetMouse.y - mouseLerp.y;
      const speed = Math.sqrt(dx * dx + dy * dy);
      
      velocitySmooth += (speed - velocitySmooth) * 0.15; // Ease in/out velocity
      
      // Hard cutoff to absolutely prevent micro-ripples when physically stationary
      if (speed < 0.001) velocitySmooth *= 0.8;
      if (velocitySmooth < 0.0001) velocitySmooth = 0.0;

      mouseLerp.lerp(targetMouse, 0.2);
      
      // Update historical wave positions
      for (let i = TRAIL_SIZE - 1; i >= 1; i--) {
        trail[i].copy(trail[i - 1]);
      }
      trail[0].copy(mouseLerp);

      uniforms.u_time.value = time * 0.001;
      uniforms.u_mouse.value.copy(mouseLerp);
      uniforms.u_velocity.value = velocitySmooth * 20.0; // Scale up for visual impact
      uniforms.u_trail.value = trail;

      renderer.render(scene, camera);
      req = requestAnimationFrame(animate);
    };
    req = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(req);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  // Three.js — Gold Monogram M
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const W = window.innerWidth;
    const H = window.innerHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 200);
    camera.position.z = isMobile() ? 11.5 : 8.0;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(W, H);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    rendererRef.current = renderer;

    const resizeMono = () => {
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', resizeMono);

    // Lighting setup for premium gold look
    const ambientLight = new THREE.AmbientLight(0xfff5d0, 0.6);
    scene.add(ambientLight);

    // Key light from upper-left (warm golden)
    const keyLight = new THREE.DirectionalLight(0xffe8a0, 3.5);
    keyLight.position.set(-2, 3, 4);
    scene.add(keyLight);

    // Fill light (cooler, from right)
    const fillLight = new THREE.DirectionalLight(0xffd070, 1.2);
    fillLight.position.set(3, -1, 2);
    scene.add(fillLight);

    // Rim light from behind (deeply warm amber)
    const rimLight = new THREE.DirectionalLight(0xff9900, 0.8);
    rimLight.position.set(0, -3, -3);
    scene.add(rimLight);

    // Subtle top bounce
    const topLight = new THREE.PointLight(0xfffbe0, 1.5, 20);
    topLight.position.set(0, 5, 3);
    scene.add(topLight);

    // Gold material — polished metal feel
    const goldMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xd4a520),
      metalness: 0.88,
      roughness: 0.30,       // higher → softer reflections, less white blowout
      envMapIntensity: 0.28, // keep env for depth but don't let it blow white
    });

    let pmremGen = null;
    let neutralEnv = null;
    let monogramMesh = null;

    // Musical Note Particles — scattered across full screen
    const NOTE_SYMBOLS = ['♩', '♪', '♫', '♬', '𝄞'];
    const pCountPerGroup = 34; // ~170 total — sparse enough not to feel dense
    const allNoteGroups = [];
    const allBasePos = [];
    const allPhases = [];

    NOTE_SYMBOLS.forEach((symbol) => {
      // Draw symbol on canvas
      const nc = document.createElement('canvas');
      nc.width = 64; nc.height = 64;
      const nctx = nc.getContext('2d');
      nctx.clearRect(0, 0, 64, 64);
      // Soft white glow behind note for visibility
      nctx.shadowColor = 'rgba(255,240,180,0.9)';
      nctx.shadowBlur = 6;
      nctx.fillStyle = 'rgba(255, 248, 220, 0.92)';
      nctx.font = '600 36px serif';
      nctx.textAlign = 'center';
      nctx.textBaseline = 'middle';
      nctx.fillText(symbol, 32, 34);
      const noteTex = new THREE.CanvasTexture(nc);

      const gPositions = new Float32Array(pCountPerGroup * 3);
      const gBase = new Float32Array(pCountPerGroup * 3);
      const gPhases = new Float32Array(pCountPerGroup);
      for (let i = 0; i < pCountPerGroup; i++) {
        const x = (Math.random() - 0.5) * 40;
        const y = (Math.random() - 0.5) * 24;
        const z = (Math.random() - 0.5) * 12;
        gBase[i*3] = x; gBase[i*3+1] = y; gBase[i*3+2] = z;
        gPositions[i*3] = x; gPositions[i*3+1] = y; gPositions[i*3+2] = z;
        gPhases[i] = Math.random() * Math.PI * 2;
      }
      const gGeo = new THREE.BufferGeometry();
      gGeo.setAttribute("position", new THREE.BufferAttribute(gPositions, 3));
      const gMat = new THREE.PointsMaterial({
        size: 0.40, map: noteTex,
        transparent: true, opacity: 0.28,
        blending: THREE.AdditiveBlending, depthWrite: false,
      });
      const gPoints = new THREE.Points(gGeo, gMat);
      scene.add(gPoints);
      // vx/vy: per-particle repulsion velocity that decays over time
      const gVel = new Float32Array(pCountPerGroup * 2);
      allNoteGroups.push({ points: gPoints, base: gBase, phases: gPhases, vel: gVel, tex: noteTex });
    });
    // Keep pCount + phases refs for animation loop compatibility
    const pCount = pCountPerGroup;
    const basePositions = allNoteGroups[0].base;
    const phases = allNoteGroups[0].phases;
    const particles = allNoteGroups[0].points;

    // Load STL + RoomEnvironment together
    Promise.all([
      import('three/examples/jsm/loaders/STLLoader.js'),
      import('three/examples/jsm/environments/RoomEnvironment.js'),
    ]).then(([{ STLLoader }, { RoomEnvironment }]) => {
      // Apply environment map for metallic reflections
      pmremGen = new THREE.PMREMGenerator(renderer);
      pmremGen.compileEquirectangularShader();
      neutralEnv = pmremGen.fromScene(new RoomEnvironment()).texture;
      scene.environment = neutralEnv;
      pmremGen.dispose();

      const loader = new STLLoader();
      loader.load('/apr26-logo.stl', (geometry) => {
        geometry.computeVertexNormals();
        geometry.center();
        const box = new THREE.Box3().setFromBufferAttribute(geometry.attributes.position);
        const size3D = new THREE.Vector3();
        box.getSize(size3D);
        const maxDim = Math.max(size3D.x, size3D.y, size3D.z);
        const scale = 2.2 / maxDim;

        monogramMesh = new THREE.Mesh(geometry, goldMat);
        monogramMesh.scale.setScalar(scale);
        monogramMesh.rotation.x = -Math.PI / 2;
        scene.add(monogramMesh);

        // Capture a dedicated render for all favicon/icon slots
        setTimeout(() => {
          // Render 3D logo at 256×256, transparent background
          const fvRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
          fvRenderer.setPixelRatio(1);
          fvRenderer.setSize(256, 256);
          fvRenderer.toneMapping = THREE.ACESFilmicToneMapping;
          fvRenderer.toneMappingExposure = 1.4;
          const fvCamera = new THREE.PerspectiveCamera(45, 1, 0.1, 200);
          fvCamera.position.z = 3.8;
          fvRenderer.render(scene, fvCamera);

          // Composite onto light-gold background canvas
          const makeIconDataURL = (size) => {
            const fc = document.createElement('canvas');
            fc.width = size; fc.height = size;
            const fctx = fc.getContext('2d');
            // Light gold background
            const grad = fctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
            grad.addColorStop(0, '#f5dfa0');
            grad.addColorStop(1, '#c9941a');
            fctx.fillStyle = grad;
            fctx.beginPath();
            fctx.roundRect(0, 0, size, size, size * 0.18);
            fctx.fill();
            // Draw rendered 3D logo on top
            fctx.drawImage(fvRenderer.domElement, 0, 0, size, size);
            return fc.toDataURL('image/png');
          };

          const icon32  = makeIconDataURL(32);
          const icon180 = makeIconDataURL(180);
          const icon192 = makeIconDataURL(192);
          fvRenderer.dispose();

          // favicon 32×32
          let link = document.querySelector("link[rel='icon'][sizes='32x32']") ||
                     document.querySelector("link[rel~='icon']");
          if (!link) { link = document.createElement('link'); document.head.appendChild(link); }
          link.rel = 'icon'; link.type = 'image/png'; link.sizes = '32x32';
          link.href = icon32;

          // apple-touch-icon 180×180
          let apple = document.querySelector("link[rel='apple-touch-icon']");
          if (!apple) { apple = document.createElement('link'); document.head.appendChild(apple); }
          apple.rel = 'apple-touch-icon'; apple.sizes = '180x180';
          apple.href = icon180;

          // shortcut icon (Windows / manifest fallback)
          let shortcut = document.querySelector("link[rel='shortcut icon']");
          if (!shortcut) { shortcut = document.createElement('link'); document.head.appendChild(shortcut); }
          shortcut.rel = 'shortcut icon'; shortcut.type = 'image/png';
          shortcut.href = icon192;
        }, 600);
      });
    });

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      const mx = mouseRef.current.x - 0.5;
      const my = mouseRef.current.y - 0.5;

      if (monogramMesh) {
        const MONO_BASE_X = -Math.PI / 2;
        monogramMesh.rotation.y += (mx * 0.12 - monogramMesh.rotation.y) * 0.08;
        monogramMesh.rotation.x += (my * -0.12 + MONO_BASE_X - monogramMesh.rotation.x) * 0.08;
      }


      // Musical note flutter + mouse repulsion
      const timeSec = Date.now() * 0.001;
      // Convert mouse screen (0-1) → world XY at z=0 plane
      const halfH = Math.tan((45 * Math.PI / 180) / 2) * 8; // camera z=8, FOV=45
      const aspect = renderer.domElement.width / renderer.domElement.height;
      const mwx = (mouseRef.current.x - 0.5) * 2 * halfH * aspect;
      const mwy = -(mouseRef.current.y - 0.5) * 2 * halfH;
      const REPULSE_RADIUS = 2.8;   // world units — influence zone
      const REPULSE_FORCE  = 0.045; // subtle nudge
      const VEL_DECAY      = 0.82;  // fast decay so notes settle quickly

      allNoteGroups.forEach(({ points, base, phases: gPhases, vel }, gi) => {
        const posAttr = points.geometry.attributes.position;
        const posArray = posAttr.array;
        const driftSpeed = 0.0025 + gi * 0.0004;
        for (let i = 0; i < pCountPerGroup; i++) {
          const phase = gPhases[i];

          // Drift + gentle bob
          base[i*3]   += driftSpeed;
          base[i*3+1] += driftSpeed * 0.55;
          if (base[i*3]   >  12.5) base[i*3]   = -12.5;
          if (base[i*3+1] >   7.5) base[i*3+1] = -7.5;

          const bx = base[i*3]   + Math.sin(timeSec * 0.45 + phase + gi) * 0.28;
          const by = base[i*3+1] + Math.cos(timeSec * 0.28 + phase + gi) * 0.28;

          // Mouse repulsion force
          const dx = bx - mwx;
          const dy = by - mwy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < REPULSE_RADIUS && dist > 0.01) {
            const falloff = 1 - dist / REPULSE_RADIUS;   // strongest at center
            const strength = falloff * falloff * REPULSE_FORCE;
            vel[i*2]   += (dx / dist) * strength;
            vel[i*2+1] += (dy / dist) * strength;
          }

          // Decay velocity
          vel[i*2]   *= VEL_DECAY;
          vel[i*2+1] *= VEL_DECAY;

          posArray[i*3]   = bx + vel[i*2];
          posArray[i*3+1] = by + vel[i*2+1];
          // Z stays as-is from initial scatter
        }
        posAttr.needsUpdate = true;
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resizeMono);
      cancelAnimationFrame(frameRef.current);
      renderer.dispose();
      goldMat.dispose();
      allNoteGroups.forEach(({ points, tex }) => {
        points.geometry.dispose();
        points.material.dispose();
        tex.dispose();
      });
      if (neutralEnv) neutralEnv.dispose();
    };
  }, []);

  // Three.js — Vinyl Record for CV page
  useEffect(() => {
    const canvas = cvCanvasRef.current;
    if (!canvas) return;

    const getCvSize = () => isMobile()
      ? Math.round(Math.min(window.innerWidth * 1.0, window.innerHeight * 0.60))
      : Math.round(Math.min(window.innerWidth * 0.88, window.innerHeight * 0.88));
    let cvSize = getCvSize();
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(cvSize, cvSize);
    const resizeCv = () => {
      cvSize = getCvSize();
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(cvSize, cvSize);
    };
    window.addEventListener('resize', resizeCv);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.8;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 6.5;

    // Enhanced lighting for depth and realism
    scene.add(new THREE.AmbientLight(0xfff5d0, 0.3));
    const keyLight = new THREE.DirectionalLight(0xffe8a0, 4.0);
    keyLight.position.set(-2, 3, 5);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0xffd070, 1.5);
    fillLight.position.set(4, -1, 2);
    scene.add(fillLight);
    const rimLight = new THREE.DirectionalLight(0xffaa22, 1.2);
    rimLight.position.set(0, -3, -4);
    scene.add(rimLight);
    const topLight = new THREE.PointLight(0xfffbe0, 2.0, 12);
    topLight.position.set(1, 5, 4);
    scene.add(topLight);
    const sideLight = new THREE.PointLight(0xffd060, 1.0, 10);
    sideLight.position.set(-4, 0, 3);
    scene.add(sideLight);

    const group = new THREE.Group();
    cvGroupRef.current = group;

    // Record body — higher-segment gold cylinder for smooth edge
    const bodyGeo = new THREE.CylinderGeometry(2.2, 2.2, 0.06, 256);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x8a6010, metalness: 0.98, roughness: 0.08,
      envMapIntensity: 2.0,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.rotation.x = Math.PI / 2;
    group.add(body);

    // Groove surface — high-resolution ShaderMaterial
    const grooveGeo = new THREE.RingGeometry(0.55, 2.18, 256, 64);
    const grooveUniforms = {
      u_time: { value: 0 },
      u_lightDir: { value: new THREE.Vector3(-0.5, 0.8, 1.0).normalize() },
      u_lightDir2: { value: new THREE.Vector3(1.0, -0.3, 0.6).normalize() },
    };
    const grooveMat = new THREE.ShaderMaterial({
      uniforms: grooveUniforms,
      vertexShader: [
        "varying vec2 vLP;",
        "varying vec3 vN;",
        "varying vec3 vVP;",
        "void main() {",
        "  vLP = position.xy;",
        "  vN = normalize(normalMatrix * normal);",
        "  vec4 mv = modelViewMatrix * vec4(position, 1.0);",
        "  vVP = mv.xyz;",
        "  gl_Position = projectionMatrix * mv;",
        "}",
      ].join("\n"),
      fragmentShader: [
        "uniform float u_time;",
        "uniform vec3 u_lightDir;",
        "uniform vec3 u_lightDir2;",
        "varying vec2 vLP;",
        "varying vec3 vN;",
        "varying vec3 vVP;",
        "void main() {",
        "  float r = length(vLP);",
        "  float ang = atan(vLP.y, vLP.x);",
        // Deep gold palette
        "  vec3 dk = vec3(0.20, 0.12, 0.02);",
        "  vec3 md = vec3(0.55, 0.38, 0.06);",
        "  vec3 br = vec3(0.88, 0.70, 0.18);",
        "  vec3 hl = vec3(1.0, 0.95, 0.72);",
        // Sharp groove pattern — high frequency
        "  float gf = sin(r * 180.0) * 0.5 + 0.5;",
        "  gf = pow(gf, 0.25);",
        "  float gs = cos(r * 180.0);",
        // Perturbed normal for groove micro-facets
        "  vec3 rd = normalize(vec3(vLP, 0.0));",
        "  vec3 N = normalize(vN + rd * gs * 0.18);",
        "  vec3 V = normalize(-vVP);",
        // Key light specular
        "  vec3 H1 = normalize(u_lightDir + V);",
        "  float sp1 = pow(max(dot(N, H1), 0.0), 96.0);",
        // Fill light specular
        "  vec3 H2 = normalize(u_lightDir2 + V);",
        "  float sp2 = pow(max(dot(N, H2), 0.0), 48.0);",
        "  float df1 = max(dot(N, u_lightDir), 0.0);",
        "  float df2 = max(dot(N, u_lightDir2), 0.0) * 0.4;",
        // Iridescent shimmer across grooves
        "  float ph = r * 80.0 + ang + u_time * 0.08;",
        "  vec3 ir = vec3(sin(ph)*0.5+0.5, sin(ph+2.094)*0.5+0.5, sin(ph+4.189)*0.5+0.5) * 0.10;",
        // Fresnel edge glow
        "  float fr = pow(1.0 - max(dot(N, V), 0.0), 3.0) * 0.4;",
        "  vec3 c = mix(dk, md, gf);",
        "  c = mix(c, br, df1 * 0.35 + df2 * 0.15);",
        "  c += hl * (sp1 * 0.9 + sp2 * 0.3);",
        "  c += ir * (sp1 * 0.8 + 0.2);",
        "  c += br * fr;",
        // Edge fade
        "  float oe = 1.0 - smoothstep(2.12, 2.18, r);",
        "  float ie = smoothstep(0.52, 0.55, r);",
        "  gl_FragColor = vec4(c, oe * ie);",
        "}",
      ].join("\n"),
      transparent: true,
      side: THREE.FrontSide,
    });
    const grooveMesh = new THREE.Mesh(grooveGeo, grooveMat);
    grooveMesh.position.z = 0.031;
    group.add(grooveMesh);

    // Center label
    const lc = document.createElement("canvas");
    lc.width = 512; lc.height = 512;
    const lx = lc.getContext("2d");
    const grd = lx.createRadialGradient(256, 256, 0, 256, 256, 256);
    grd.addColorStop(0, "#f0d878");
    grd.addColorStop(0.5, "#d4a520");
    grd.addColorStop(1, "#8a6010");
    lx.fillStyle = grd;
    lx.beginPath(); lx.arc(256, 256, 256, 0, Math.PI * 2); lx.fill();
    // Fine decorative rings
    lx.strokeStyle = "rgba(40, 25, 3, 0.3)";
    lx.lineWidth = 0.8;
    [170, 185, 198, 210].forEach((rad) => {
      lx.beginPath(); lx.arc(256, 256, rad, 0, Math.PI * 2); lx.stroke();
    });
    // Center hole
    lx.fillStyle = "#0e0907";
    lx.beginPath(); lx.arc(256, 256, 18, 0, Math.PI * 2); lx.fill();
    // Center label text
    lx.fillStyle = "rgba(50, 32, 5, 0.75)";
    lx.font = "400 38px 'Cormorant Garamond', serif";
    lx.textAlign = "center"; lx.textBaseline = "middle";
    lx.fillText("Yusuf Selman", 256, 130);
    lx.fillText("Bağış", 256, 172);
    lx.font = "200 15px 'Outfit', sans-serif";
    lx.fillStyle = "rgba(50, 32, 5, 0.40)";
    lx.fillText("CURRICULUM VITAE", 256, 330);

    const labelTex = new THREE.CanvasTexture(lc);
    const labelGeo = new THREE.CircleGeometry(0.54, 128);
    const labelMat = new THREE.MeshBasicMaterial({ map: labelTex, transparent: true });
    const labelMesh = new THREE.Mesh(labelGeo, labelMat);
    labelMesh.position.z = 0.032;
    group.add(labelMesh);

    // CV data — all sections from PDF. Only `name` is shown on the record;
    // subtitle/description go to the side detail panel.
    const cvItems = CV_ITEMS;
    const N = cvItems.length;
    const spriteTex = [];
    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    cvLabelTexRef.current = [];
    cvItems.forEach(({ name }, i) => {
      const angle = (i * Math.PI * 2) / N;
      // Canvas pixel size is independent of the plane world size.
      // Wide canvas → long names never clip. Tall canvas → sharp text on Retina.
      const cw = 2048, ch = 256;
      const sc = document.createElement("canvas");
      sc.width = cw; sc.height = ch;
      const sx = sc.getContext("2d");
      sx.clearRect(0, 0, cw, ch);
      sx.fillStyle = "rgba(6, 3, 0, 0.92)";
      sx.font = "600 148px 'Cormorant Garamond', serif";
      sx.textAlign = "center"; sx.textBaseline = "middle";
      sx.fillText(name, cw / 2, ch / 2 + 6);

      const tex = new THREE.CanvasTexture(sc);
      tex.anisotropy = maxAniso;
      tex.needsUpdate = true;
      spriteTex.push(tex);
      cvLabelTexRef.current.push({ canvas: sc, tex });

      const planeMat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, depthTest: false });
      // planeW / planeH are world-space display sizes — decoupled from canvas pixels
      const planeW = 1.72, planeH = 0.215;
      const planeGeo = new THREE.PlaneGeometry(planeW, planeH);
      const mesh = new THREE.Mesh(planeGeo, planeMat);
      const centerR = 1.50;
      mesh.position.set(Math.cos(angle) * centerR, Math.sin(angle) * centerR, 0.15);
      mesh.rotation.z = angle;
      mesh.renderOrder = 10;
      group.add(mesh);
    });

    scene.add(group);

    // Environment map for metallic reflections
    import("three/examples/jsm/environments/RoomEnvironment.js").then(({ RoomEnvironment }) => {
      const pmrem = new THREE.PMREMGenerator(renderer);
      pmrem.compileEquirectangularShader();
      const env = pmrem.fromScene(new RoomEnvironment()).texture;
      scene.environment = env;
      bodyMat.envMapIntensity = 2.5;
      pmrem.dispose();
    });

    // Animation loop
    const animate = () => {
      cvAnimRef.current = requestAnimationFrame(animate);
      const state = cvStateRef.current;
      if (state === "hidden") return;

      grooveUniforms.u_time.value += 0.008;

      if (state === "scrolling" || state === "record") {
        // Snap-to-index z-rotation: target = -selectedIndex * (2π / N)
        const targetZ = -cvSelectedRef.current * (Math.PI * 2) / CV_ITEMS.length;
        group.rotation.z += (targetZ - group.rotation.z) * 0.12;
        // Slight tilt persists
        group.rotation.y *= 0.95;
        group.rotation.x *= 0.95;
      } else {
        // Subtle mouse parallax tilt — kept small so sprites stay readable
        const mx = mouseRef.current.x - 0.5;
        const my = mouseRef.current.y - 0.5;
        group.rotation.y += (mx * 0.08 - group.rotation.y) * 0.05;
        group.rotation.x += (my * -0.05 - group.rotation.x) * 0.05;
      }

      // Camera zoom — much closer on mobile so labels fill the view
      // centerR=1.50 world units; camera half-frustum at z: z*tan(22.5°)=z*0.414
      // label visible when z*0.414 >= 1.50 → z >= 3.62. Use 4.0 for safe margin.
      const mob = isMobile();
      const targetZ_cam = (state === "record" || state === "scrolling")
        ? (mob ? 4.0 : 6.0)
        : (mob ? 4.8 : 6.5);
      camera.position.z += (targetZ_cam - camera.position.z) * 0.04;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resizeCv);
      cancelAnimationFrame(cvAnimRef.current);
      renderer.dispose();
      bodyGeo.dispose(); bodyMat.dispose();
      grooveGeo.dispose(); grooveMat.dispose();
      labelGeo.dispose(); labelMat.dispose(); labelTex.dispose();
      spriteTex.forEach(t => t.dispose());
    };
  }, []);

  const navigateToProduct = useCallback(
    (product) => {
      if (transitionState) return;
      setTransitionState(`zoom-in-${product.id}`);
      setActiveProduct(product);
      window.history.pushState({ product: product.id }, "", `/${product.id}`);

      setTimeout(() => {
        setShowDetail(true);
      }, 700); // Mid-zoom show detail
    },
    [transitionState]
  );

  const navigateHome = useCallback(() => {
    if (!showDetail || detailClosing) return;
    setDetailClosing(true);
    setTransitionState(`zoom-out-${activeProduct.id}`);

    setTimeout(() => {
      setShowDetail(false);
      setDetailClosing(false);
      setActiveProduct(null);
      setTransitionState("");
      window.history.pushState({}, "", "/");
    }, 1100); // Let CSS complete backwards
  }, [showDetail, detailClosing, activeProduct]);

  const closeCv = useCallback(() => {
    const s = cvStateRef.current;
    if (s === "hidden" || s === "preview" || s === "leaving") return;
    // Reverse: scrolling→record→sleeve→leaving→hidden
    if (s === "scrolling") {
      scrollRef.current = 0;
      setCvSelected(0);
      setCvState("record");
      setTimeout(() => {
        setCvState("sleeve");
        setTimeout(() => {
          setCvState("leaving");
          setTimeout(() => setCvState("hidden"), 900);
        }, 800);
      }, 600);
    } else if (s === "record") {
      setCvState("sleeve");
      setTimeout(() => {
        setCvState("leaving");
        setTimeout(() => setCvState("hidden"), 900);
      }, 800);
    } else if (s === "sleeve") {
      setCvState("leaving");
      setTimeout(() => setCvState("hidden"), 900);
    }
  }, []);

  const scrollRef = useRef(0);
  const cvGroupRef = useRef(null);

  // ESC to close CV
  useEffect(() => {
    if (cvState === "hidden" || cvState === "preview") return;
    const onKey = (e) => { if (e.key === "Escape") closeCv(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cvState, closeCv]);

  // Scroll wheel → spin record (enters scrolling state on first scroll in record state)
  useEffect(() => {
    const onWheel = (e) => {
      const s = cvStateRef.current;
      if (s !== "record" && s !== "scrolling") return;
      e.preventDefault();
      const now = performance.now();
      if (now - cvWheelCooldownRef.current < 380) return;
      if (Math.abs(e.deltaY) < 4) return;
      cvWheelCooldownRef.current = now;
      const dir = Math.sign(e.deltaY);
      const N = CV_ITEMS.length;
      const next = ((cvSelectedRef.current + dir) % N + N) % N;
      setCvSelected(next);
      if (s === "record") setCvState("scrolling");
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  // Touch swipe → spin record (mobile)
  useEffect(() => {
    let touchStartY = null;
    const onTouchStart = (e) => { touchStartY = e.touches[0]?.clientY ?? null; };
    const onTouchEnd = (e) => {
      if (touchStartY === null) return;
      const s = cvStateRef.current;
      if (s !== "record" && s !== "scrolling") { touchStartY = null; return; }
      const dy = touchStartY - (e.changedTouches[0]?.clientY ?? touchStartY);
      touchStartY = null;
      if (Math.abs(dy) < 28) return; // minimum swipe distance
      const now = performance.now();
      if (now - cvWheelCooldownRef.current < 380) return;
      cvWheelCooldownRef.current = now;
      const dir = Math.sign(dy); // swipe up = positive = next
      const N = CV_ITEMS.length;
      const next = ((cvSelectedRef.current + dir) % N + N) % N;
      setCvSelected(next);
      if (s === "record") setCvState("scrolling");
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend",   onTouchEnd,   { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend",   onTouchEnd);
    };
  }, []);

  useEffect(() => {
    const onPop = () => {
      if (activeProduct) navigateHome();
      const s = cvStateRef.current;
      if (s === "record" || s === "scrolling" || s === "sleeve") closeCv();
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [activeProduct, navigateHome, closeCv]);

  // Clean up /cv URL when CV closes
  useEffect(() => {
    if (cvState === "hidden" && window.location.pathname === "/cv") {
      window.history.replaceState({}, "", "/");
    }
  }, [cvState]);

  // Redraw record label canvases when language changes
  useEffect(() => {
    const items = CV_ITEMS_ALL[lang] || CV_ITEMS_ALL.en;
    cvLabelTexRef.current.forEach(({ canvas, tex }, i) => {
      if (!items[i]) return;
      const cw = canvas.width, ch = canvas.height;
      const sx = canvas.getContext("2d");
      sx.clearRect(0, 0, cw, ch);
      sx.fillStyle = "rgba(6, 3, 0, 0.92)";
      sx.font = "600 148px 'Cormorant Garamond', serif";
      sx.textAlign = "center";
      sx.textBaseline = "middle";
      sx.fillText(items[i].name, cw / 2, ch / 2 + 6);
      tex.needsUpdate = true;
    });
  }, [lang]);

  cvStateRef.current = cvState;

  // Responsive sizing helpers
  const getCvSize = () => isMobile()
    ? Math.min(window.innerWidth * 1.0, window.innerHeight * 0.60)
    : Math.min(window.innerWidth * 0.62, window.innerHeight * 0.85);

  // Combo wrapper: contains sleeve + record as children, handles unified scale/position
  const getCvComboStyle = () => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const rs = getCvSize();           // record size
    const ss = rs * 0.92;             // sleeve size
    const rl = ss - rs / 2;           // record left within combo (half inside sleeve)
    const cw = ss + rs / 2;           // combo width
    const ch = rs;                    // combo height (record is tallest)
    const rcx = rl + rs / 2;          // record center X within combo = ss

    const base = { width: cw, height: ch };
    const fastT = "transform 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.3s";
    const slowT = "transform 0.9s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.6s";
    const leaveT = "transform 0.9s cubic-bezier(0.4,0,0.2,1), opacity 0.6s ease 0.2s";

    const mob = isMobile();

    if (cvState === "hidden")
      return { ...base, transform: `translate(${vw / 2 - cw / 2}px, ${vh + ch * 0.2}px) scale(0.3)`, opacity: 0, transition: fastT };
    if (cvState === "preview") {
      // Peek from bottom — scale 0.38, ~40% visible above viewport bottom
      return { ...base, transform: `translate(${vw / 2 - cw / 2}px, ${vh - ch * 0.46}px) scale(0.38)`, opacity: 1, transition: fastT };
    }
    if (cvState === "sleeve")
      return { ...base, transform: `translate(${vw / 2 - cw / 2}px, ${vh / 2 - ch / 2}px)`, opacity: 1, transition: slowT };
    if (cvState === "record" || cvState === "scrolling") {
      if (mob) {
        // Mobile: record fills full viewport width, sits just above the bottom drawer
        const drawerH = vh * 0.38;             // CSS max-height of detail drawer
        const availH  = vh - drawerH;          // space above drawer
        const topOffset = Math.max(6, (availH - ch) / 2); // center in available area
        return { ...base, transform: `translate(${vw / 2 - rcx}px, ${topOffset}px)`, opacity: 1, transition: slowT };
      }
      // Desktop: record positioned LEFT, detail panel on RIGHT
      const recordCenterX = vw * 0.30;
      return { ...base, transform: `translate(${recordCenterX - rcx}px, ${vh / 2 - ch / 2}px)`, opacity: 1, transition: slowT };
    }
    if (cvState === "leaving")
      return { ...base, transform: `translate(${vw / 2 - cw / 2}px, ${vh + ch * 0.2}px) scale(0.3)`, opacity: 0, transition: leaveT };
    return base;
  };

  // Inner sleeve positioning within combo
  const getCvSleeveInComboStyle = () => {
    const rs = getCvSize();
    const ss = rs * 0.92;
    const sleeveTop = (rs - ss) / 2;
    const base = { left: 0, top: sleeveTop, width: ss, height: ss };

    if (cvState === "record" || cvState === "scrolling") {
      return { ...base, transform: `translateX(${-ss * 1.2}px)`, opacity: 0 };
    }
    return { ...base, opacity: 1 };
  };

  // Inner record positioning within combo
  const getCvRecordInComboStyle = () => {
    const rs = getCvSize();
    const ss = rs * 0.92;
    const rl = ss - rs / 2;
    return { left: rl, top: 0, width: rs, height: rs };
  };

  const isHome = !activeProduct;

  return (
    <div className="msc-root">
      <style>{CSS}</style>

      {/* Spatial Zoom Wrapper */}
      <div className={`msc-spatial-zoom ${transitionState}`}>
        {/* Dynamic Native WebGL Fluid Background */}
        <canvas ref={bgCanvasRef} className="msc-bg-canvas" />

        {/* Atmospheric Overhead Layers */}
        <div className="msc-rays" />
        <div className="msc-glow" />

        {/* Mouse-following light */}
        <div
          ref={mouseLightRef}
          className="msc-mouse-light"
        />

        {/* Vignette */}
        <div className="msc-vignette" />

        {/* Brand */}
        <div
          className="msc-brand"
          style={{ cursor: "pointer" }}
          onClick={() => activeProduct ? navigateHome() : navigateToProduct({ id: "brand-info", name: "MUSEICOLOGIE", subtitle: "blank blank blank" })}
        >
          MUSEICOLOGIE
          <span className="msc-brand-sub">{t.brandSub}</span>
        </div>

        {/* Corner accents */}
        <svg className="msc-corner msc-corner-tl" width="40" height="40">
          <line x1="0" y1="0" x2="40" y2="0" stroke={FG} strokeWidth="0.5" opacity="0.2" />
          <line x1="0" y1="0" x2="0" y2="40" stroke={FG} strokeWidth="0.5" opacity="0.2" />
        </svg>
        <svg className="msc-corner msc-corner-br" width="40" height="40">
          <line x1="40" y1="40" x2="0" y2="40" stroke={FG} strokeWidth="0.5" opacity="0.2" />
          <line x1="40" y1="40" x2="40" y2="0" stroke={FG} strokeWidth="0.5" opacity="0.2" />
        </svg>

        {/* Three.js canvas — full screen so particles aren't clipped */}
        <div className={`msc-canvas-wrap ${activeProduct ? "hidden" : ""}`}>
          <canvas ref={canvasRef} />
        </div>
        {/* Invisible logo hit area for click-to-open */}
        {!activeProduct && (
          <div
            className="msc-logo-hit"
            onClick={() => navigateToProduct({ id: "brand-info", name: "MUSEICOLOGIE", subtitle: "blank blank blank" })}
          />
        )}

        {/* Constellation lines SVG */}
        <svg
          className={`msc-svg-overlay ${activeProduct ? "hidden" : ""}`}
          width="100%"
          height="100%"
          shapeRendering="geometricPrecision"
        >
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Center dot */}
          <circle cx="50%" cy="50%" r="2" className="msc-center-dot" />

          {PRODUCTS.map((p, i) => {
            const delay = 1 + i * 0.2;
            const isHovered = hoveredNode === p.id;
            // particle animation duration varies per arm for organic feel
            const dur = `${3.5 + i * 0.7}s`;
            return (
              <g key={p.id}>
                {/* Hover beam — warm gold blur behind line */}
                <line
                  x1="50%" y1="50%"
                  x2={`${p.x}%`} y2={`${p.y}%`}
                  className={`msc-line-hover ${isHovered ? 'active' : ''}`}
                />
                {/* Glow line */}
                <line
                  x1="50%" y1="50%"
                  x2={`${p.x}%`} y2={`${p.y}%`}
                  className="msc-line-glow"
                  style={{ animationDelay: `${delay}s` }}
                />
                {/* Main line */}
                <line
                  x1="50%" y1="50%"
                  x2={`${p.x}%`} y2={`${p.y}%`}
                  className="msc-line"
                  style={{ animationDelay: `${delay}s` }}
                />
                {/* Flowing gold particle along the arm */}
                <circle r={isHovered ? '2.2' : '1.4'} fill="rgba(255,215,100,0.85)" style={{ filter: 'blur(0.5px)' }}>
                  <animateMotion
                    dur={dur}
                    repeatCount="indefinite"
                    begin={`${delay + 0.5}s`}
                    path={`M ${50 * window.innerWidth / 100} ${50 * window.innerHeight / 100} L ${p.x * window.innerWidth / 100} ${p.y * window.innerHeight / 100}`}
                    calcMode="spline"
                    keyTimes="0;1"
                    keySplines="0.4 0 0.6 1"
                  />
                </circle>
                {/* Pulse dot at midpoint */}
                <circle
                  cx={`${(50 + p.x) / 2}%`}
                  cy={`${(50 + p.y) / 2}%`}
                  r="1.5"
                  className="msc-pulse-dot"
                  style={{ animationDelay: `${delay + 1}s` }}
                />
              </g>
            );
          })}
        </svg>

        {/* Product nodes */}
        {PRODUCTS.map((p) => {
          const ringSize = 12 * (p.depth ?? 1.0);
          const ringOpacity = 0.3 + 0.35 * (p.depth ?? 1.0);
          return (
            <div
              key={p.id}
              className={`msc-node ${activeProduct && activeProduct.id !== p.id ? "hidden" : ""} ${activeProduct && activeProduct.id === p.id ? "hidden" : ""}`}
              data-side={p.x > 62 ? "right" : p.x < 38 ? "left" : "center"}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              onClick={() => navigateToProduct(p)}
              onMouseEnter={() => setHoveredNode(p.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <div className="msc-node-ring" style={{
                width: `${ringSize}px`,
                height: `${ringSize}px`,
                borderColor: `rgba(255,255,255,${ringOpacity})`,
                boxShadow: hoveredNode === p.id ? `0 0 ${24 * (p.depth ?? 1)}px rgba(255,210,80,0.45), 0 0 ${48 * (p.depth ?? 1)}px rgba(255,210,80,0.15)` : 'none',
                transition: 'box-shadow 0.4s ease, transform 0.5s ease',
              }} />
              <div className="msc-node-label">{p.name}</div>
              <div className="msc-node-subtitle">{t.products[p.id]?.subtitle || p.subtitle}</div>
            </div>
          );
        })}

        {/* Bottom tagline — entire area is hover/click target */}
        <div
          className={`msc-tagline ${activeProduct ? "hidden" : ""}`}
          style={{ pointerEvents: "auto", cursor: "pointer" }}
          onMouseEnter={() => setCvState(s => s === "hidden" ? "preview" : s)}
          onMouseLeave={() => setCvState(s => s === "preview" ? "hidden" : s)}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (cvStateRef.current !== "hidden" && cvStateRef.current !== "preview") return;
            setCvState("sleeve");
          }}
        >
          <span style={{ color: "rgba(255,255,255,0.8)", fontWeight: 400 }}>
            Yusuf Selman Bağış
          </span>
          {t.taglineSuffix}
        </div>
      </div>

      {/* Product detail overlay */}
      {showDetail && activeProduct && (
        <div className={`msc-detail ${detailClosing ? "closing" : ""}`} onClick={(e) => { if (e.target === e.currentTarget) navigateHome(); }}>
          <div className="msc-detail-inner">
            <div className={`msc-detail-image${activeProduct.id === 'no-001' ? ' msc-detail-image--quiz' : ''}`}>
              {activeProduct.id === 'no-001' ? (
                <QuizVisualizer />
              ) : activeProduct.id === 'no-002' ? (
                <UsulVisualizer />
              ) : activeProduct.id === 'no-003' ? (
                <EqVisualizer />
              ) : activeProduct.id === 'no-005' ? (
                <div className="msc-radial-tree">
                  <svg width="220" height="260" viewBox="0 0 220 260">
                    {/* Root */}
                    <circle cx="110" cy="30" r="7"
                      fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1"
                      style={{ transformOrigin: "110px 30px", animation: "rtRoot 5s ease-in-out infinite" }} />
                    {/* L1 left branch */}
                    <line x1="110" y1="30" x2="55" y2="110"
                      stroke="rgba(255,255,255,0.25)" strokeWidth="1"
                      strokeDasharray="80" strokeDashoffset="80"
                      style={{ animation: "rtL1Branch 5s ease-in-out infinite" }} />
                    {/* L1 right branch */}
                    <line x1="110" y1="30" x2="165" y2="110"
                      stroke="rgba(255,255,255,0.25)" strokeWidth="1"
                      strokeDasharray="80" strokeDashoffset="80"
                      style={{ animation: "rtL1Branch 5s ease-in-out infinite" }} />
                    {/* L1 left node */}
                    <circle cx="55" cy="110" r="5"
                      fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1"
                      style={{ transformOrigin: "55px 110px", animation: "rtL1Node 5s ease-in-out infinite" }} />
                    {/* L1 right node */}
                    <circle cx="165" cy="110" r="5"
                      fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1"
                      style={{ transformOrigin: "165px 110px", animation: "rtL1Node 5s ease-in-out infinite" }} />
                    {/* L2 branches from left node */}
                    <line x1="55" y1="110" x2="22" y2="200"
                      stroke="rgba(255,255,255,0.18)" strokeWidth="1"
                      strokeDasharray="70" strokeDashoffset="70"
                      style={{ animation: "rtL2Branch 5s ease-in-out infinite" }} />
                    <line x1="55" y1="110" x2="88" y2="200"
                      stroke="rgba(255,255,255,0.18)" strokeWidth="1"
                      strokeDasharray="70" strokeDashoffset="70"
                      style={{ animation: "rtL2Branch 5s ease-in-out infinite" }} />
                    {/* L2 branches from right node */}
                    <line x1="165" y1="110" x2="132" y2="200"
                      stroke="rgba(255,255,255,0.18)" strokeWidth="1"
                      strokeDasharray="70" strokeDashoffset="70"
                      style={{ animation: "rtL2Branch 5s ease-in-out infinite" }} />
                    <line x1="165" y1="110" x2="198" y2="200"
                      stroke="rgba(255,255,255,0.18)" strokeWidth="1"
                      strokeDasharray="70" strokeDashoffset="70"
                      style={{ animation: "rtL2Branch 5s ease-in-out infinite" }} />
                    {/* L2 leaf nodes */}
                    <circle cx="22"  cy="200" r="4" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1"
                      style={{ transformOrigin: "22px 200px",  animation: "rtL2Node 5s ease-in-out infinite" }} />
                    <circle cx="88"  cy="200" r="4" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1"
                      style={{ transformOrigin: "88px 200px",  animation: "rtL2Node 5s ease-in-out infinite" }} />
                    <circle cx="132" cy="200" r="4" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1"
                      style={{ transformOrigin: "132px 200px", animation: "rtL2Node 5s ease-in-out infinite" }} />
                    <circle cx="198" cy="200" r="4" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1"
                      style={{ transformOrigin: "198px 200px", animation: "rtL2Node 5s ease-in-out infinite" }} />
                  </svg>
                </div>
              ) : (
                <span className="msc-detail-image-text">{t.productVisual}</span>
              )}
              {/* Gold corner accents inside image */}
              <svg style={{ position: "absolute", top: 10, left: 10 }} width="20" height="20">
                <line x1="0" y1="0" x2="20" y2="0" stroke={FG} strokeWidth="0.5" opacity="0.3" />
                <line x1="0" y1="0" x2="0" y2="20" stroke={FG} strokeWidth="0.5" opacity="0.3" />
              </svg>
              <svg style={{ position: "absolute", bottom: 10, right: 10 }} width="20" height="20">
                <line x1="20" y1="20" x2="0" y2="20" stroke={FG} strokeWidth="0.5" opacity="0.3" />
                <line x1="20" y1="20" x2="20" y2="0" stroke={FG} strokeWidth="0.5" opacity="0.3" />
              </svg>
            </div>
            <div className="msc-detail-content">
              <div className="msc-detail-number">{activeProduct.name}</div>
              <div className="msc-detail-title">{t.products[activeProduct.id]?.subtitle || activeProduct.subtitle}</div>
              <div className="msc-detail-divider" />
              {activeProduct.id === 'cv' ? (
                <div className="msc-detail-desc" style={{fontSize: "13px", lineHeight: "1.6", maxWidth: "450px"}}>
                  <h3 style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", color: "#d4a520", marginBottom: "8px", fontWeight: 400}}>{t.cvAbout}</h3>
                  <p style={{marginBottom: "20px", color: "rgba(255,255,255,0.5)"}}>{activeProduct.description}</p>
                  <h3 style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", color: "#d4a520", marginBottom: "8px", fontWeight: 400}}>{t.cvProjects}</h3>
                  <div style={{marginBottom: "12px", color: "rgba(255,255,255,0.5)"}}>
                    <div style={{color: "rgba(255,255,255,0.85)", fontWeight: 400}}>{t.cvPlatformTitle}</div>
                    <div style={{fontSize: "11px", color: "rgba(212,165,32,0.8)", marginBottom: "4px"}}>2026</div>
                    {t.cvPlatformDesc}
                  </div>
                  <div style={{color: "rgba(255,255,255,0.5)", marginBottom: "30px"}}>
                    <div style={{color: "rgba(255,255,255,0.85)", fontWeight: 400}}>{t.cvOrgTitle}</div>
                    <div style={{fontSize: "11px", color: "rgba(212,165,32,0.8)", marginBottom: "4px"}}>2026</div>
                    {t.cvOrgDesc}
                  </div>
                </div>
              ) : activeProduct.id === 'no-001' ? (
                <>
                  <div className="msc-detail-desc">{t.products[activeProduct.id]?.description}</div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 400, fontSize: "12px", letterSpacing: "2px", color: "rgba(212,165,32,0.88)", marginBottom: "32px" }}>{t.no001Launch}</div>
                </>
              ) : activeProduct.id === 'no-002' ? (
                <>
                  <div className="msc-detail-desc">{t.products[activeProduct.id]?.description}</div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 400, fontSize: "12px", letterSpacing: "2px", color: "rgba(212,165,32,0.88)", marginBottom: "32px" }}>{t.no002Launch}</div>
                </>
              ) : activeProduct.id === 'no-003' ? (
                <>
                  <div className="msc-detail-desc">{t.products[activeProduct.id]?.description}</div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 400, fontSize: "12px", letterSpacing: "2px", color: "rgba(212,165,32,0.88)", marginBottom: "32px" }}>{t.no003Launch}</div>
                </>
              ) : activeProduct.id === 'no-005' ? (
                <>
                  <div className="msc-detail-desc">{t.products[activeProduct.id]?.description}</div>
                  <div className="msc-visit-domain">musiorganolog.com</div>
                  <a className="msc-visit-btn" href="https://musiorganolog.com" target="_blank" rel="noopener noreferrer">
                    {t.visitBtn} ↗
                  </a>
                </>
              ) : (
                <div className="msc-detail-desc">{t.products[activeProduct.id]?.description || activeProduct.description}</div>
              )}
              <button className="msc-detail-back" onClick={navigateHome}>
                <div className="msc-detail-back-line" />
                {t.returnToMap}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ CV Vinyl Record Page ═══ */}
      {/* Backdrop */}
      <div
        className={`msc-cv-backdrop ${(cvState === "sleeve" || cvState === "record" || cvState === "scrolling" || cvState === "leaving") ? "active" : ""}`}
      />

      {/* Combo wrapper — sleeve + record as unified element for scaling */}
      <div className="msc-cv-combo" style={getCvComboStyle()}>
        {/* Sleeve (inside combo) */}
        <div className="msc-cv-combo-sleeve" style={getCvSleeveInComboStyle()}>
          <div className="msc-cv-sleeve-inner">
            <div className="msc-cv-sleeve-title">Yusuf Selman Bağış</div>
            <div className="msc-cv-sleeve-sub">CV</div>
            {cvState === "sleeve" && (
              <button
                className="msc-cv-sleeve-btn"
                style={{ pointerEvents: "auto" }}
                onClick={(e) => {
                  e.stopPropagation();
                  setCvState("record");
                  window.history.pushState({ cv: true }, "", "/cv");
                }}
              >
                {t.inceleBtn}
              </button>
            )}
          </div>
        </div>

        {/* 3D Vinyl record (inside combo) */}
        <div className="msc-cv-combo-record" style={getCvRecordInComboStyle()}>
          <canvas ref={cvCanvasRef} />
        </div>
      </div>

      {/* CV Detail panel — right side */}
      {(cvState === "record" || cvState === "scrolling") && (
        <div className="msc-cv-detail active">
          <div className="msc-cv-detail-eyebrow">
            {String(cvSelected + 1).padStart(2, "0")} / {String(CV_ITEMS.length).padStart(2, "0")}
          </div>
          <div key={cvSelected} className="msc-cv-detail-fade">
            <div className="msc-cv-detail-title">{(CV_ITEMS_ALL[lang]||CV_ITEMS_ALL.en)[cvSelected].name}</div>
            <div className="msc-cv-detail-sub">{(CV_ITEMS_ALL[lang]||CV_ITEMS_ALL.en)[cvSelected].subtitle}</div>
            <div className="msc-cv-detail-desc">{(CV_ITEMS_ALL[lang]||CV_ITEMS_ALL.en)[cvSelected].description}</div>
          </div>
        </div>
      )}

      {/* Back button — top-left, visible when not hidden/preview */}
      {(cvState === "sleeve" || cvState === "record" || cvState === "scrolling") && (
        <button className="msc-cv-back" onClick={closeCv}>
          <div className="msc-cv-back-line" />
          {t.returnToMap}
        </button>
      )}

      {/* Scroll hint — shown in scrolling state */}
      {cvState === "scrolling" && (
        <div className="msc-cv-scroll-hint">{t.scrollHint}</div>
      )}

      {/* Language Switcher — always on top */}
      <button
        className="msc-lang-btn"
        onClick={(e) => { e.stopPropagation(); setLangOpen(o => !o); }}
        title="Language / Dil / Sprache"
      >
        {/* Globe SVG icon */}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <span>{lang.toUpperCase()}</span>
      </button>

      {langOpen && (
        <div className="msc-lang-dropdown" onClick={(e) => e.stopPropagation()}>
          {[{code:"tr",label:"TÜRKÇE"},{code:"en",label:"ENGLISH"},{code:"de",label:"DEUTSCH"}].map(({code, label}) => (
            <button
              key={code}
              className={`msc-lang-option ${lang === code ? "active" : ""}`}
              onClick={() => { setLang(code); setLangOpen(false); }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const rootElement = document.getElementById("root");
if (!rootElement._reactRoot) {
  rootElement._reactRoot = ReactDOM.createRoot(rootElement);
}
rootElement._reactRoot.render(
  <React.StrictMode>
    <Museicologie />
  </React.StrictMode>
);
