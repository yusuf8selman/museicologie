export const FG = "#ffffff";
export const FG_DIM = "rgba(255,255,255,0.35)";
export const FG_GLOW = "rgba(255,255,255,0.08)";

export const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600&family=Outfit:wght@200;300;400&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  .msc-root {
    width: 100vw; height: 100vh; overflow: hidden;
    position: relative; cursor: crosshair;
    font-family: 'Outfit', sans-serif;
    background-color: #d1a554;
  }

  .msc-bg-canvas {
    position: absolute; inset: 0; z-index: 0; pointer-events: none;
    width: 100vw; height: 100vh;
  }

  .msc-rays {
    position: absolute; top: -20%; left: -20%; width: 140vw; height: 140vh;
    z-index: 2; pointer-events: none;
    background: 
      linear-gradient(130deg, transparent 25%, rgba(255,255,255,0.25) 35%, transparent 40%),
      linear-gradient(140deg, transparent 45%, rgba(255,255,255,0.15) 50%, transparent 55%),
      linear-gradient(145deg, transparent 65%, rgba(255,255,255,0.1) 68%, transparent 72%),
      linear-gradient(120deg, transparent 15%, rgba(255,255,255,0.2) 20%, transparent 30%);
    background-size: 100% 100%;
    mix-blend-mode: overlay;
    animation: pulseRays 18s ease-in-out infinite alternate;
    transform-origin: 0% 0%;
  }
  @keyframes pulseRays {
    0% { transform: scale(1.0) rotate(0deg); opacity: 0.6; }
    33% { transform: scale(1.15) rotate(2deg); opacity: 1; }
    66% { transform: scale(0.95) rotate(-1deg); opacity: 0.5; }
    100% { transform: scale(1.1) rotate(1deg); opacity: 0.8; }
  }

  .msc-glow {
    position: absolute; top: -50%; left: -50%; z-index: 2; pointer-events: none;
    width: 200vw; height: 200vh;
    background: radial-gradient(circle at 20% 20%, rgba(255,255,230,0.6) 0%, rgba(255,255,220,0.15) 30%, transparent 60%);
    mix-blend-mode: screen;
    opacity: 0.85;
  }
  @keyframes pulseGlow {
    0% { transform: scale(1); opacity: 0.8; }
    100% { transform: scale(1.15); opacity: 1; }
  }

  .msc-vignette {
    position: absolute; inset: 0; z-index: 3; pointer-events: none;
    background: 
      radial-gradient(ellipse at center, transparent 20%, rgba(60, 35, 5, 0.55) 100%),
      radial-gradient(ellipse 120% 80% at 50% 110%, rgba(40,20,0,0.4) 0%, transparent 60%);
    mix-blend-mode: multiply;
  }

  .msc-mouse-light {
    position: fixed; width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(255,255,230,0.15) 0%, transparent 60%);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none; z-index: 3;
    mix-blend-mode: overlay;
  }

  .msc-brand {
    position: absolute; top: 40px; left: 50%; transform: translateX(-50%);
    z-index: 10; text-align: center;
    font-family: 'Cormorant Garamond', serif;
    font-weight: 300; font-size: 22px; letter-spacing: 14px;
    color: ${FG}; opacity: 0;
    text-shadow: 0 2px 4px rgba(100, 60, 10, 0.2);
    animation: msc-fadeIn 2s ease 0.5s forwards;
  }

  .msc-brand-sub {
    display: block; font-family: 'Outfit', sans-serif;
    font-weight: 200; font-size: 11px; letter-spacing: 6px;
    color: rgba(255,255,255,0.7); margin-top: 8px;
  }

  .msc-canvas-wrap {
    position: absolute; inset: 0;
    z-index: 5; pointer-events: none;
    transition: opacity 1s ease;
  }
  .msc-canvas-wrap.hidden {
    opacity: 0; pointer-events: none;
  }
  .msc-canvas-wrap canvas {
    display: block;
  }

  .msc-logo-hit {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    z-index: 6; pointer-events: auto;
    width: 240px; height: 240px; border-radius: 50%;
    cursor: pointer;
  }

  .msc-svg-overlay {
    position: absolute; inset: 0; z-index: 4; pointer-events: none;
    transition: opacity 0.8s ease;
  }
  .msc-svg-overlay.hidden { opacity: 0; }

  .msc-line {
    stroke: ${FG}; stroke-width: 1.5; fill: none;
    opacity: 0.25; mix-blend-mode: screen;
    stroke-dasharray: 2000;
    stroke-dashoffset: 2000;
    animation: msc-drawLine 2.5s ease 1s forwards;
  }

  .msc-line-glow {
    stroke: ${FG}; stroke-width: 4; fill: none;
    opacity: 0.2; filter: blur(4px); mix-blend-mode: screen;
    stroke-dasharray: 2000;
    stroke-dashoffset: 2000;
    animation: msc-drawLine 2.5s ease 1s forwards;
  }

  .msc-line-hover {
    stroke: rgba(255,220,120,0.55); stroke-width: 6; fill: none;
    filter: blur(5px); mix-blend-mode: screen;
    pointer-events: none; opacity: 0;
    transition: opacity 0.4s ease;
  }
  .msc-line-hover.active { opacity: 1; }

  .msc-pulse-dot {
    fill: ${FG}; opacity: 0;
    animation: none;
  }

  .msc-center-dot {
    fill: ${FG}; opacity: 0;
    animation: msc-fadeIn 1.5s ease 1.5s forwards;
  }

  @keyframes msc-drawLine {
    to { stroke-dashoffset: 0; }
  }

  @keyframes msc-pulseDot {
    0%, 100% { opacity: 0; }
    50% { opacity: 0.6; }
  }

  @keyframes msc-fadeIn {
    to { opacity: 1; }
  }

  @keyframes msc-fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .msc-node {
    position: absolute; z-index: 8; cursor: pointer;
    transform: translate(-50%, -50%);
    opacity: 0; animation: msc-fadeIn 1.5s ease 2s forwards;
    transition: opacity 0.8s ease, transform 0.8s ease;
    display: flex; flex-direction: column; align-items: center;
  }
  /* Transparent extended hit area — does not affect absolute-positioned children */
  .msc-node::before {
    content: ''; position: absolute;
    top: 50%; left: 50%; transform: translate(-50%, -50%);
    width: 120px; height: 120px;
    border-radius: 50%;
  }
  .msc-node.hidden {
    opacity: 0 !important; pointer-events: none;
    transform: translate(-50%, -50%) scale(0.5);
  }
  .msc-node:hover .msc-node-ring {
    transform: scale(1.4);
    box-shadow: 0 0 30px rgba(255,255,255,0.3), 0 0 60px rgba(255,255,255,0.1);
  }
  .msc-node:hover .msc-node-label {
    opacity: 1; transform: translateY(0);
  }
  .msc-node:hover .msc-node-subtitle {
    opacity: 0.5; transform: translateY(0);
  }

  .msc-node-ring {
    width: 12px; height: 12px; border-radius: 50%;
    border: 1px solid ${FG_DIM};
    background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
    transition: transform 0.5s ease, box-shadow 0.5s ease;
    position: relative;
  }
  .msc-node-ring::after {
    content: ''; position: absolute;
    top: 50%; left: 50%; transform: translate(-50%, -50%);
    width: 3px; height: 3px; border-radius: 50%;
    background: ${FG};
  }

  .msc-node-label {
    position: absolute; top: -32px; left: 50%; transform: translateX(-50%) translateY(5px);
    white-space: nowrap;
    font-family: 'Cormorant Garamond', serif;
    font-weight: 400; font-size: 14px; letter-spacing: 3px;
    color: ${FG}; opacity: 0.6;
    transition: opacity 0.4s ease, transform 0.4s ease;
  }

  .msc-node-subtitle {
    position: absolute; top: 24px; left: 50%; transform: translateX(-50%) translateY(5px);
    white-space: nowrap;
    font-family: 'Outfit', sans-serif;
    font-weight: 200; font-size: 9px; letter-spacing: 4px;
    color: ${FG}; opacity: 0;
    transition: opacity 0.4s ease 0.1s, transform 0.4s ease 0.1s;
  }

  /* Detail view */
  .msc-detail {
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
    z-index: 100;
    display: flex; align-items: center; justify-content: center;
    background: rgba(4, 3, 2, 0.1);
    backdrop-filter: blur(8px);
    animation: detailFadeIn 0.8s forwards;
  }
  .msc-detail.closing {
    animation: detailFadeOut 0.6s forwards;
  }
  @keyframes detailFadeIn {
    0% { opacity: 0; backdrop-filter: blur(0px); }
    100% { opacity: 1; backdrop-filter: blur(8px); }
  }
  @keyframes detailFadeOut {
    0% { opacity: 1; backdrop-filter: blur(8px); }
    100% { opacity: 0; backdrop-filter: blur(0px); }
  }

  .msc-detail-inner {
    display: flex; align-items: center; gap: 80px;
    max-width: 1000px; padding: 40px;
  }

  .msc-detail-image {
    width: 350px; height: 450px; flex-shrink: 0;
    border: 1px solid rgba(255,255,255,0.15);
    background: linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 50%, rgba(255,255,255,0.02) 100%);
    display: flex; align-items: center; justify-content: center;
    opacity: 0; animation: msc-fadeInUp 0.8s ease 0.2s forwards;
    position: relative; overflow: hidden;
  }
  .msc-detail-image::before {
    content: ''; position: absolute; inset: 20px;
    border: 1px solid rgba(255,255,255,0.06);
  }
  .msc-detail-image-text {
    font-family: 'Outfit', sans-serif;
    font-weight: 200; font-size: 10px; letter-spacing: 5px;
    color: rgba(255,255,255,0.2);
  }
  .msc-detail-image--quiz {
    height: auto !important;
    min-height: 160px;
  }

  .msc-detail-content {
    flex: 1;
    opacity: 0; animation: msc-fadeInUp 0.8s ease 0.4s forwards;
  }

  .msc-detail-number {
    font-family: 'Outfit', sans-serif;
    font-weight: 200; font-size: 11px; letter-spacing: 6px;
    color: rgba(255,255,255,0.4); margin-bottom: 16px;
  }

  .msc-detail-title {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 300; font-size: 48px; letter-spacing: 2px;
    color: ${FG}; margin-bottom: 12px; line-height: 1.1;
  }

  .msc-detail-desc {
    font-family: 'Outfit', sans-serif;
    font-weight: 200; font-size: 14px; line-height: 1.9;
    color: rgba(255,255,255,0.35); max-width: 380px;
    margin-bottom: 40px;
  }

  .msc-detail-back {
    display: inline-flex; align-items: center; gap: 12px;
    font-family: 'Outfit', sans-serif;
    font-weight: 300; font-size: 11px; letter-spacing: 4px;
    color: rgba(255,255,255,0.5); cursor: pointer;
    background: none; border: none; padding: 12px 0;
    transition: color 0.3s ease;
  }
  .msc-detail-back:hover { color: ${FG}; }
  .msc-detail-back-line {
    width: 40px; height: 1px; background: rgba(255,255,255,0.3);
    transition: width 0.3s ease, background 0.3s ease;
  }
  .msc-detail-back:hover .msc-detail-back-line {
    width: 60px; background: ${FG};
  }

  .msc-detail-divider {
    width: 50px; height: 1px;
    background: linear-gradient(to right, ${FG_DIM}, transparent);
    margin-bottom: 24px;
  }

  /* Bottom tagline */
  .msc-tagline {
    position: absolute; bottom: 36px; left: 50%; transform: translateX(-50%);
    z-index: 9;
    font-family: 'Outfit', sans-serif;
    font-weight: 200; font-size: 9px; letter-spacing: 5px; text-transform: uppercase;
    color: rgba(255,255,255,0.2);
    text-align: center;
    white-space: nowrap;
    opacity: 0; animation: msc-fadeIn 2s ease 2.5s forwards;
    transition: opacity 0.8s ease;
  }
  .msc-tagline.hidden {
    opacity: 0 !important; transform: translate(-50%, 10px);
  }

  /* Corner accents */
  .msc-corner {
    position: absolute; z-index: 6; opacity: 0;
    animation: msc-fadeIn 2s ease 2s forwards;
  }
  .msc-corner-tl { top: 30px; left: 30px; }
  .msc-corner-br { bottom: 30px; right: 30px; }
  
  .msc-spatial-zoom {
    width: 100vw; height: 100vh;
    position: absolute; top: 0; left: 0;
    transition: transform 1.2s cubic-bezier(0.7, 0, 0.3, 1), opacity 0.8s ease 0.4s;
    will-change: transform, opacity;
  }
  .msc-spatial-zoom.zoom-in-001 { transform-origin: 80% 20%; transform: scale(3.5); opacity: 0; pointer-events: none; }
  .msc-spatial-zoom.zoom-in-002 { transform-origin: 85% 70%; transform: scale(3.5); opacity: 0; pointer-events: none; }
  .msc-spatial-zoom.zoom-in-003 { transform-origin: 20% 75%; transform: scale(3.5); opacity: 0; pointer-events: none; }
  .msc-spatial-zoom.zoom-in-004 { transform-origin: 18% 25%; transform: scale(3.5); opacity: 0; pointer-events: none; }
  .msc-spatial-zoom.zoom-in-005 { transform-origin: 50% 85%; transform: scale(3.5); opacity: 0; pointer-events: none; }
  .msc-spatial-zoom.zoom-in-brand-info { transform-origin: 50% 10%; transform: scale(3.5); opacity: 0; pointer-events: none; }
  .msc-spatial-zoom.zoom-in-cv { transform-origin: 50% 95%; transform: scale(3.5); opacity: 0; pointer-events: none; }
  
  .msc-spatial-zoom.zoom-out-001 { transform-origin: 80% 20%; transform: scale(1); opacity: 1; transition: transform 1.1s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.4s ease; }
  .msc-spatial-zoom.zoom-out-002 { transform-origin: 85% 70%; transform: scale(1); opacity: 1; transition: transform 1.1s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.4s ease; }
  .msc-spatial-zoom.zoom-out-003 { transform-origin: 20% 75%; transform: scale(1); opacity: 1; transition: transform 1.1s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.4s ease; }
  .msc-spatial-zoom.zoom-out-004 { transform-origin: 18% 25%; transform: scale(1); opacity: 1; transition: transform 1.1s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.4s ease; }
  .msc-spatial-zoom.zoom-out-005 { transform-origin: 50% 85%; transform: scale(1); opacity: 1; transition: transform 1.1s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.4s ease; }
  .msc-spatial-zoom.zoom-out-brand-info { transform-origin: 50% 10%; transform: scale(1); opacity: 1; transition: transform 1.1s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.4s ease; }
  .msc-spatial-zoom.zoom-out-cv { transform-origin: 50% 95%; transform: scale(1); opacity: 1; transition: transform 1.1s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.4s ease; }

  /* ═══ CV Vinyl Record Page ═══ */
  .msc-cv-backdrop {
    position: fixed; inset: 0; z-index: 50;
    background: rgba(10, 8, 4, 0.88);
    backdrop-filter: blur(16px);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.7s ease;
  }
  .msc-cv-backdrop.active {
    opacity: 1;
    pointer-events: auto;
  }

  .msc-cv-combo {
    position: fixed; left: 0; top: 0;
    z-index: 51;
    pointer-events: none;
  }
  .msc-cv-combo-record {
    position: absolute; z-index: 1;
  }
  .msc-cv-combo-record canvas {
    width: 100% !important; height: 100% !important;
  }
  .msc-cv-combo-sleeve {
    position: absolute; z-index: 2;
    transition: transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.6s;
  }
  .msc-cv-sleeve-inner {
    width: 100%; height: 100%;
    background: linear-gradient(145deg, #3d2e12 0%, #2a1f0c 40%, #1e1608 100%);
    border: 1px solid rgba(212,165,32,0.15);
    box-shadow:
      0 20px 60px rgba(0,0,0,0.6),
      inset 0 1px 0 rgba(255,255,255,0.05),
      inset 0 -1px 0 rgba(0,0,0,0.3);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    position: relative; overflow: hidden;
  }
  .msc-cv-sleeve-inner::before {
    content: ''; position: absolute; inset: 0;
    background: repeating-linear-gradient(
      0deg, transparent, transparent 2px,
      rgba(255,255,255,0.008) 2px, rgba(255,255,255,0.008) 3px
    );
    pointer-events: none;
  }
  .msc-cv-sleeve-title {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 300; font-size: 32px; letter-spacing: 3px;
    color: rgba(212, 165, 32, 0.85);
    text-shadow: 0 2px 8px rgba(100, 60, 10, 0.3);
    text-align: center; margin-bottom: 6px;
  }
  .msc-cv-sleeve-sub {
    font-family: 'Outfit', sans-serif;
    font-weight: 200; font-size: 10px; letter-spacing: 6px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.3);
    margin-bottom: 30px;
  }
  .msc-cv-sleeve-btn {
    font-family: 'Outfit', sans-serif;
    font-weight: 300; font-size: 10px; letter-spacing: 5px;
    text-transform: uppercase;
    color: rgba(212,165,32,0.7);
    background: none;
    border: 1px solid rgba(212,165,32,0.25);
    padding: 10px 28px;
    cursor: pointer;
    transition: color 0.3s, border-color 0.3s, box-shadow 0.3s;
  }
  .msc-cv-sleeve-btn:hover {
    color: rgba(212,165,32,1);
    border-color: rgba(212,165,32,0.5);
    box-shadow: 0 0 20px rgba(212,165,32,0.15);
  }

  /* CV Back Button — top-left */
  .msc-cv-back {
    position: fixed; top: 36px; left: 36px;
    z-index: 56;
    display: inline-flex; align-items: center; gap: 12px;
    font-family: 'Outfit', sans-serif;
    font-weight: 300; font-size: 10px; letter-spacing: 4px;
    color: rgba(255,255,255,0.4);
    background: none; border: none;
    cursor: pointer; pointer-events: auto;
    transition: color 0.3s ease;
    opacity: 0;
    animation: msc-fadeIn 0.6s ease 0.3s forwards;
  }
  .msc-cv-back:hover { color: rgba(255,255,255,0.9); }
  .msc-cv-back-line {
    width: 35px; height: 1px;
    background: rgba(255,255,255,0.25);
    transition: width 0.3s ease, background 0.3s ease;
  }
  .msc-cv-back:hover .msc-cv-back-line {
    width: 55px; background: rgba(212,165,32,0.7);
  }

  /* CV Detail Panel — right side, çarkıfelek */
  .msc-cv-detail {
    position: fixed; top: 50%; right: 6vw;
    transform: translateY(-50%);
    width: min(38vw, 520px);
    z-index: 55;
    pointer-events: none;
    color: rgba(255,255,255,0.85);
    opacity: 0;
    transition: opacity 0.6s ease;
  }
  .msc-cv-detail.active { opacity: 1; }
  .msc-cv-detail-eyebrow {
    font-family: 'Outfit', sans-serif;
    font-weight: 200; font-size: 10px; letter-spacing: 5px;
    text-transform: uppercase;
    color: rgba(212,165,32,0.6);
    margin-bottom: 18px;
  }
  .msc-cv-detail-title {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 300; font-size: 44px; line-height: 1.1;
    letter-spacing: 1px;
    color: rgba(255,255,255,0.95);
    margin-bottom: 14px;
  }
  .msc-cv-detail-sub {
    font-family: 'Outfit', sans-serif;
    font-weight: 300; font-size: 12px; letter-spacing: 2px;
    color: rgba(212,165,32,0.75);
    margin-bottom: 24px;
  }
  .msc-cv-detail-desc {
    font-family: 'Outfit', sans-serif;
    font-weight: 200; font-size: 14px; line-height: 1.7;
    color: rgba(255,255,255,0.55);
    max-width: 480px;
  }
  .msc-cv-detail-fade {
    animation: msc-cvDetailFade 0.5s ease;
  }
  @keyframes msc-cvDetailFade {
    0% { opacity: 0; transform: translateY(8px); }
    100% { opacity: 1; transform: translateY(0); }
  }

  /* CV scroll hint */
  .msc-cv-scroll-hint {
    position: fixed; bottom: 30px; left: 50%;
    transform: translateX(-50%);
    z-index: 56;
    font-family: 'Outfit', sans-serif;
    font-weight: 200; font-size: 9px; letter-spacing: 4px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.25);
    pointer-events: none;
    opacity: 0;
    animation: msc-fadeIn 1s ease 0.5s forwards, msc-pulseHint 2s ease-in-out 1.5s infinite;
  }
  @keyframes msc-pulseHint {
    0%, 100% { opacity: 0.25; transform: translateX(-50%) translateY(0); }
    50% { opacity: 0.5; transform: translateX(-50%) translateY(-4px); }
  }

  /* Language Switcher */
  .msc-lang-btn {
    position: fixed; top: 28px; right: 36px;
    z-index: 200;
    background: none; border: none; cursor: pointer;
    color: rgba(255,255,255,0.55);
    display: flex; align-items: center; gap: 6px;
    font-family: 'Outfit', sans-serif;
    font-size: 10px; letter-spacing: 3px; text-transform: uppercase;
    transition: color 0.3s ease;
    padding: 6px 0;
  }
  .msc-lang-btn:hover { color: rgba(255,255,255,0.9); }
  .msc-lang-btn svg { transition: opacity 0.3s ease; }

  .msc-lang-dropdown {
    position: fixed; top: 54px; right: 30px;
    z-index: 200;
    background: rgba(30,20,5,0.75);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 4px;
    overflow: hidden;
    animation: msc-fadeIn 0.18s ease forwards;
  }
  .msc-lang-option {
    display: block; width: 100%;
    padding: 9px 20px;
    background: none; border: none; cursor: pointer;
    font-family: 'Outfit', sans-serif;
    font-size: 10px; letter-spacing: 3px;
    color: rgba(255,255,255,0.5);
    text-align: left;
    transition: color 0.2s ease, background 0.2s ease;
    white-space: nowrap;
  }
  .msc-lang-option:hover { color: rgba(255,255,255,0.9); background: rgba(255,255,255,0.05); }
  .msc-lang-option.active { color: rgba(255,225,160,0.9); }

  /* Page Transition */
  .page-transition-right {
    animation: slideOutRight 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }
  @keyframes slideOutRight {
    to { transform: translateX(-50px); opacity: 0; }
  }

  /* ═══ Mobile Responsive (≤768px) ═══ */
  @media (max-width: 768px) {

    /* Brand title */
    .msc-brand {
      font-size: 15px;
      letter-spacing: 7px;
      top: 22px;
    }
    .msc-brand-sub {
      font-size: 8px;
      letter-spacing: 3px;
      margin-top: 5px;
    }

    /* Mouse-follow light — smaller on touch */
    .msc-mouse-light { width: 180px; height: 180px; }

    /* Language switcher */
    .msc-lang-btn { top: 18px; right: 14px; font-size: 9px; }
    .msc-lang-dropdown { top: 44px; right: 10px; }

    /* Corners */
    .msc-corner-tl { top: 12px; left: 12px; }
    .msc-corner-br { bottom: 12px; right: 12px; }

    /* Product node labels — prevent off-screen overflow */
    .msc-node-label {
      font-size: 10px;
      letter-spacing: 1px;
      white-space: nowrap;
      text-align: center;
      top: -30px;
    }
    /* Left-side nodes: label starts at dot, extends toward center */
    .msc-node[data-side="left"] .msc-node-label {
      left: 50%; transform: none; text-align: left;
    }
    .msc-node[data-side="left"] .msc-node-subtitle {
      left: 50%; transform: none; text-align: left;
    }
    /* Right-side nodes: label ends at dot, extends toward center */
    .msc-node[data-side="right"] .msc-node-label {
      left: auto; right: 50%; transform: none; text-align: right;
    }
    .msc-node[data-side="right"] .msc-node-subtitle {
      left: auto; right: 50%; transform: none; text-align: right;
    }
    .msc-node-subtitle { font-size: 7.5px; letter-spacing: 1.5px; }

    /* Tagline */
    .msc-tagline { font-size: 8px; letter-spacing: 3px; bottom: 20px; }

    /* ── Product detail overlay ── */
    .msc-detail-inner {
      flex-direction: column;
      gap: 16px;
      padding: 20px 18px 28px;
      max-height: 100dvh;
      overflow-y: auto;
      align-items: flex-start;
    }
    .msc-detail-image {
      width: 100%;
      max-width: 100%;
      height: 120px;
      flex-shrink: 0;
    }
    .msc-detail-image--quiz {
      height: auto !important;
      min-height: 160px;
    }
    .msc-detail-content { width: 100%; }
    .msc-detail-title { font-size: 28px; margin-bottom: 8px; }
    .msc-detail-desc { font-size: 13px; max-width: 100%; margin-bottom: 14px; }
    .msc-detail-number { font-size: 10px; margin-bottom: 8px; }
    .msc-detail-divider { margin-bottom: 14px; }
    .msc-visit-domain { font-size: 10px; margin-bottom: 8px; }
    .msc-visit-btn { font-size: 10px; padding: 10px 22px; margin-bottom: 16px; }

    /* ── CV page ── */
    .msc-cv-back {
      top: 18px; left: 14px;
      font-size: 9px; letter-spacing: 3px;
    }
    .msc-cv-back-line { width: 24px; }

    /* Detail panel becomes a bottom drawer on mobile */
    .msc-cv-detail {
      position: fixed !important;
      top: auto !important;
      right: 0 !important;
      bottom: 0 !important;
      left: 0 !important;
      width: 100% !important;
      max-width: 100% !important;
      transform: none !important;
      padding: 14px 18px 20px;
      background: rgba(8, 6, 3, 0.94);
      backdrop-filter: blur(14px);
      border-top: 1px solid rgba(212,165,32,0.13);
      border-radius: 12px 12px 0 0;
      height: 38vh;
      overflow-y: auto;
      box-sizing: border-box;
    }
    .msc-cv-detail-eyebrow { font-size: 8px; letter-spacing: 4px; margin-bottom: 8px; }
    .msc-cv-detail-title { font-size: 24px; margin-bottom: 6px; }
    .msc-cv-detail-sub { font-size: 10px; margin-bottom: 10px; }
    .msc-cv-detail-desc { font-size: 12px; line-height: 1.55; max-width: 100%; }

    .msc-cv-sleeve-title { font-size: 20px; letter-spacing: 2px; }
    .msc-cv-sleeve-sub { font-size: 8px; letter-spacing: 4px; }

    /* Scroll hint — push it up above the bottom drawer */
    .msc-cv-scroll-hint { bottom: 48vh; }
  }

  /* ═══ Radial Tree Animation (no-005) ═══ */
  .msc-radial-tree {
    display: flex; align-items: center; justify-content: center;
    width: 100%; height: 100%;
  }
  .msc-radial-tree svg { overflow: visible; }

  @keyframes rtRoot {
    0%   { opacity: 0; transform: scale(0); }
    10%  { opacity: 1; transform: scale(1); }
    80%  { opacity: 1; transform: scale(1); }
    100% { opacity: 0; transform: scale(0); }
  }
  @keyframes rtL1Branch {
    0%   { stroke-dashoffset: 80; opacity: 0; }
    10%  { stroke-dashoffset: 80; opacity: 1; }
    28%  { stroke-dashoffset: 0;  opacity: 1; }
    80%  { stroke-dashoffset: 0;  opacity: 1; }
    100% { stroke-dashoffset: 0;  opacity: 0; }
  }
  @keyframes rtL1Node {
    0%   { opacity: 0; transform: scale(0); }
    28%  { opacity: 0; transform: scale(0); }
    40%  { opacity: 1; transform: scale(1); }
    80%  { opacity: 1; transform: scale(1); }
    100% { opacity: 0; transform: scale(0); }
  }
  @keyframes rtL2Branch {
    0%   { stroke-dashoffset: 70; opacity: 0; }
    36%  { stroke-dashoffset: 70; opacity: 1; }
    54%  { stroke-dashoffset: 0;  opacity: 1; }
    80%  { stroke-dashoffset: 0;  opacity: 1; }
    100% { stroke-dashoffset: 0;  opacity: 0; }
  }
  @keyframes rtL2Node {
    0%   { opacity: 0; transform: scale(0); }
    54%  { opacity: 0; transform: scale(0); }
    66%  { opacity: 1; transform: scale(1); }
    80%  { opacity: 1; transform: scale(1); }
    100% { opacity: 0; transform: scale(0); }
  }

  /* Visit button */
  .msc-visit-domain {
    font-family: 'Outfit', sans-serif;
    font-weight: 200; font-size: 11px; letter-spacing: 3px;
    color: rgba(255,255,255,0.35);
    margin-bottom: 12px;
  }
  .msc-visit-btn {
    display: inline-flex; align-items: center; gap: 10px;
    font-family: 'Outfit', sans-serif;
    font-weight: 400; font-size: 11px; letter-spacing: 4px;
    color: rgba(212,165,32,0.95);
    background: rgba(212,165,32,0.07);
    border: 1px solid rgba(212,165,32,0.55);
    padding: 12px 28px;
    cursor: pointer;
    text-decoration: none;
    transition: color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
    margin-bottom: 28px;
  }
  .msc-visit-btn:hover {
    color: rgba(212,165,32,1);
    background: rgba(212,165,32,0.13);
    border-color: rgba(212,165,32,0.8);
    box-shadow: 0 0 24px rgba(212,165,32,0.2);
  }

  /* Very small phones (≤390px) */
  @media (max-width: 390px) {
    .msc-brand { font-size: 13px; letter-spacing: 5px; }
    .msc-detail-title { font-size: 24px; }
    .msc-cv-detail-title { font-size: 20px; }
  }
`;
