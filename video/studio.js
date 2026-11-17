/**
 * ULIS VIBE - Master Programmatic Video Studio Player
 * Aesthetic: Gradient Minimalism, Optical Balance & Fluid Choreography
 * Resolution: 1920x1080 Landscape (16:9) | Framerate: 60 FPS | Duration: 45s (2700 frames)
 */

const TOTAL_FRAMES = 2700;
const FPS = 60;
const DURATION_SECONDS = 45;

// DOM Elements
const canvas = document.getElementById("video-canvas");
const ctx = canvas.getContext("2d");
const scrubber = document.getElementById("time-scrubber");
const btnPlay = document.getElementById("btn-play");
const btnRestart = document.getElementById("btn-restart");
const bigPlayBtn = document.getElementById("big-play-btn");
const timecodeCurrent = document.getElementById("timecode-current");
const timecodeTotal = document.getElementById("timecode-total");
const currentSceneTag = document.getElementById("current-scene-tag");
const btnExport = document.getElementById("btn-export-mp4");
const exportOverlay = document.getElementById("export-overlay");
const exportProgressBar = document.getElementById("export-progress-bar");
const exportProgressText = document.getElementById("export-progress-text");
const btnFullscreen = document.getElementById("btn-fullscreen");
const btnAudioToggle = document.getElementById("btn-audio-toggle");

// Inline SVG Icon Constants
const SVG_PLAY = `<svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
const SVG_PAUSE = `<svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`;
const SVG_AUDIO_ON = `<svg id="audio-icon" class="w-4 h-4 text-blue-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`;
const SVG_AUDIO_OFF = `<svg id="audio-icon" class="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`;

// State
let currentFrame = 0;
let isPlaying = false;
let animationReqId = null;
let lastTimestamp = 0;

// Preload Assets
const assets = {
  logo: new Image(),
  ev01: new Image(),
};
assets.logo.src = "../assets/ulis-logo.png";
assets.ev01.src = "../assets/events/ev-01.png";

// ==========================================
// 1. REFINED AMBIENT AUDIO ENGINE (Minimalist Chords)
// ==========================================
class RefinedAudioEngine {
  constructor() {
    this.ctx = null;
    this.destNode = null;
    this.isPlaying = false;
    this.intervalId = null;
    this.bpm = 108;
    this.step = 0;
    this.isMuted = false;
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();
    this.destNode = this.ctx.createMediaStreamDestination();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);
    this.masterGain.connect(this.destNode);
  }

  start() {
    this.init();
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    this.isPlaying = true;
    this.step = 0;
    const stepDuration = (60 / this.bpm) / 4 * 1000;
    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = setInterval(() => this.tick(), stepDuration);
  }

  stop() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  tick() {
    if (!this.isPlaying || this.isMuted) return;
    const t = this.ctx.currentTime;
    const beat = this.step % 16;
    const chordIdx = Math.floor(this.step / 16) % 4;

    // Elegant Warm Chords: Cmaj7 -> Fmaj7 -> Am7 -> G
    const chords = [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7
      [349.23, 440.00, 523.25, 659.25], // Fmaj7
      [220.00, 261.63, 329.63, 392.00], // Am7
      [196.00, 246.94, 293.66, 392.00]  // G
    ];

    if (beat === 0 || beat === 8) {
      const activeChord = chords[chordIdx];
      activeChord.forEach((freq, i) => {
        this.playPad(freq, t + i * 0.04, 0.9);
      });
    }

    if (beat === 0 || beat === 6 || beat === 10) {
      const bassNotes = [130.81, 174.61, 110.00, 98.00];
      this.playBass(bassNotes[chordIdx], t);
    }

    this.step++;
  }

  playPad(freq, time, dur = 0.8) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, time);
    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime(0.09, time + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + dur);
  }

  playBass(freq, time) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, time);
    gain.gain.setValueAtTime(0.25, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.4);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + 0.4);
  }

  playWhoosh() {
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(200, t);
    osc.frequency.exponentialRampToValueAtTime(600, t + 0.2);
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.12, t + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.2);
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }
}

const audio = new RefinedAudioEngine();

// ==========================================
// 2. EASING & INTERPOLATION PRIMITIVES
// ==========================================
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function spring(t, damp = 6.2, freq = 8.5) {
  return 1 - Math.exp(-damp * t) * Math.cos(freq * t);
}

// Deterministic Ambient Dust / Micro-particles (36 points)
const AMBIENT_PARTICLES = Array.from({ length: 36 }, (_, i) => ({
  x: ((i * 137.5) % 1800) + 60,
  y: ((i * 223.7) % 960) + 60,
  size: 1.8 + (i % 3) * 1.4,
  speed: 0.25 + (i % 4) * 0.12,
  phase: i * 0.45,
  color: i % 2 === 0 ? "56, 189, 248" : "99, 102, 241"
}));

// Floating Confetti / Prismatic Shards for Scene 6 Finale (32 pieces)
const FINALE_CONFETTI = Array.from({ length: 32 }, (_, i) => ({
  x: ((i * 179.3) % 1720) + 100,
  y: ((i * 283.1) % 900) + 90,
  size: 6 + (i % 4) * 4,
  rotSpeed: 0.015 + (i % 5) * 0.01,
  floatSpeed: 0.35 + (i % 3) * 0.2,
  phase: i * 0.7,
  color: ["#0284C7", "#38BDF8", "#F59E0B", "#10B981", "#6366F1"][i % 5]
}));

// ==========================================
// 3. MASTER VISUAL EFFECTS SUITE (Apple / Linear Grade)
// ==========================================

// Architectural Micro-Grid with dynamic wave ripples & floating dust
function drawKineticGrid(f) {
  const w = 1920;
  const h = 1080;
  const step = 80;

  ctx.save();
  // Dot matrix with wave ripples
  for (let x = 60; x < w; x += step) {
    for (let y = 60; y < h; y += step) {
      const dist = Math.hypot(x - 960, y - 540);
      const wave = Math.sin(dist * 0.008 - f * 0.045);
      const alpha = 0.032 + 0.024 * wave;
      ctx.fillStyle = `rgba(15, 23, 42, ${alpha})`;
      ctx.fillRect(x - 1, y - 1, 2, 2);
    }
  }

  // Precision Technical Crosshairs at 4 corners
  const crosshairs = [
    [100, 100], [1820, 100], [100, 980], [1820, 980]
  ];
  ctx.strokeStyle = "rgba(2, 132, 199, 0.28)";
  ctx.lineWidth = 1.5;
  crosshairs.forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.moveTo(cx - 10, cy); ctx.lineTo(cx + 10, cy);
    ctx.moveTo(cx, cy - 10); ctx.lineTo(cx, cy + 10);
    ctx.stroke();
  });

  // Floating Micro-Dust Particles
  AMBIENT_PARTICLES.forEach(p => {
    const py = (p.y - f * p.speed + 1080 * 10) % 1080;
    const px = p.x + Math.sin(f * 0.02 + p.phase) * 16;
    const pAlpha = 0.16 + 0.12 * Math.sin(f * 0.04 + p.phase);
    ctx.fillStyle = `rgba(${p.color}, ${pAlpha})`;
    ctx.beginPath();
    ctx.arc(px, py, p.size, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}

// Specular Glass Sheen Sweep Card (Signature Apple / Linear Aesthetic)
function drawCardWithSpecular(x, y, w, h, radius, f, options = {}) {
  const {
    fill = "#FFFFFF",
    stroke = "rgba(226, 232, 240, 0.85)",
    lineWidth = 1.5,
    shadowBlur = 35,
    shadowOffsetY = 12,
    shadowColor = "rgba(10, 37, 64, 0.07)",
    sheenSpeed = 160,
    sheenDelay = 0
  } = options;

  ctx.save();
  // 1. Base Card Fill & Ambient Shadow
  ctx.shadowColor = shadowColor;
  ctx.shadowBlur = shadowBlur;
  ctx.shadowOffsetY = shadowOffsetY;
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
  ctx.fill();

  // 2. Crisp Editorial Border
  ctx.shadowColor = "transparent";
  ctx.strokeStyle = stroke;
  ctx.lineWidth = lineWidth;
  ctx.stroke();

  // 3. Specular Light Shimmer Sweep
  const loopFrame = (f + sheenDelay) % sheenSpeed;
  if (loopFrame < 60) {
    const sweepProgress = loopFrame / 60;
    const sweepX = x - w * 0.4 + (w * 1.8) * sweepProgress;

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, radius);
    ctx.clip();

    const sheenGrad = ctx.createLinearGradient(sweepX - 90, y, sweepX + 90, y + h);
    sheenGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
    sheenGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.42)");
    sheenGrad.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctx.fillStyle = sheenGrad;
    ctx.fillRect(x, y, w, h);
    ctx.restore();
  }

  ctx.restore();
}

// Anamorphic Horizontal Optical Lens Flare
function drawAnamorphicFlare(cx, cy, width, alpha = 0.5) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";

  const flareGrad = ctx.createLinearGradient(cx - width / 2, cy, cx + width / 2, cy);
  flareGrad.addColorStop(0, "rgba(2, 132, 199, 0)");
  flareGrad.addColorStop(0.25, `rgba(56, 189, 248, ${alpha * 0.35})`);
  flareGrad.addColorStop(0.5, `rgba(255, 255, 255, ${alpha})`);
  flareGrad.addColorStop(0.75, `rgba(56, 189, 248, ${alpha * 0.35})`);
  flareGrad.addColorStop(1, "rgba(2, 132, 199, 0)");

  ctx.fillStyle = flareGrad;
  ctx.fillRect(cx - width / 2, cy - 2, width, 4);

  // Core Halo
  const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, 32);
  halo.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.95})`);
  halo.addColorStop(0.4, `rgba(56, 189, 248, ${alpha * 0.45})`);
  halo.addColorStop(1, "rgba(2, 132, 199, 0)");
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(cx, cy, 32, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// Futuristic Laser Scanner for QR Codes
function drawAnimatedLaserScanner(x, y, w, h, f) {
  const scanCycle = (Math.sin(f * 0.08) * 0.5 + 0.5);
  const laserY = y + 10 + scanCycle * (h - 20);

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 20);
  ctx.clip();

  // Translucent Scanner Field
  const fieldGrad = ctx.createLinearGradient(x, laserY - 32, x, laserY);
  fieldGrad.addColorStop(0, "rgba(16, 185, 129, 0)");
  fieldGrad.addColorStop(1, "rgba(16, 185, 129, 0.22)");
  ctx.fillStyle = fieldGrad;
  ctx.fillRect(x, laserY - 32, w, 32);

  // Intense Horizontal Laser Beam
  const laserGrad = ctx.createLinearGradient(x, laserY, x + w, laserY);
  laserGrad.addColorStop(0, "rgba(16, 185, 129, 0)");
  laserGrad.addColorStop(0.2, "rgba(16, 185, 129, 0.85)");
  laserGrad.addColorStop(0.5, "rgba(255, 255, 255, 1.0)");
  laserGrad.addColorStop(0.8, "rgba(16, 185, 129, 0.85)");
  laserGrad.addColorStop(1, "rgba(16, 185, 129, 0)");

  ctx.fillStyle = laserGrad;
  ctx.shadowColor = "#10B981";
  ctx.shadowBlur = 12;
  ctx.fillRect(x, laserY - 1.5, w, 3);

  ctx.restore();
}

// High-Tech Radial Donut Progress Dial (with luminous spark & particles)
function drawRadialProgressDonut(cx, cy, radius, percent, f, p) {
  const strokeW = 14;
  const currentVal = percent * easeOutCubic(p);
  const startAngle = -Math.PI / 2;
  const endAngle = startAngle + (currentVal / 100) * Math.PI * 2;

  ctx.save();
  // Background Track
  ctx.strokeStyle = "rgba(241, 245, 249, 1)";
  ctx.lineWidth = strokeW;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();

  // Arc Gauge with Gradient
  const grad = ctx.createLinearGradient(cx - radius, cy - radius, cx + radius, cy + radius);
  grad.addColorStop(0, "#002B7F");
  grad.addColorStop(0.6, "#0284C7");
  grad.addColorStop(1, "#EF4444");

  ctx.strokeStyle = grad;
  ctx.lineWidth = strokeW;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(cx, cy, radius, startAngle, endAngle);
  ctx.stroke();

  // Glowing Head Bead
  if (currentVal > 1) {
    const headX = cx + Math.cos(endAngle) * radius;
    const headY = cy + Math.sin(endAngle) * radius;
    ctx.fillStyle = "#FFFFFF";
    ctx.shadowColor = "#EF4444";
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.arc(headX, headY, strokeW * 0.52, 0, Math.PI * 2);
    ctx.fill();

    // Pulse Wave from tip
    const pulseR = (f * 0.7) % 18;
    const pulseAlpha = Math.max(0, 1 - pulseR / 18);
    ctx.strokeStyle = `rgba(239, 68, 68, ${pulseAlpha})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(headX, headY, strokeW * 0.52 + pulseR, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}

// Silky Gradient Mesh Backdrop with Fluid Auroras
function drawGradientMesh(frame) {
  const w = 1920;
  const h = 1080;

  // Crisp Base Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, w, h);
  bgGrad.addColorStop(0, "#FFFFFF");
  bgGrad.addColorStop(0.5, "#FBFBFD");
  bgGrad.addColorStop(1, "#F3F5F9");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  ctx.save();
  // Aura 1: Soft Cerulean Sky
  const x1 = 350 + Math.sin(frame * 0.012) * 100;
  const y1 = 280 + Math.cos(frame * 0.01) * 80;
  const r1 = 700;
  const g1 = ctx.createRadialGradient(x1, y1, 50, x1, y1, r1);
  g1.addColorStop(0, "rgba(56, 189, 248, 0.16)");
  g1.addColorStop(0.5, "rgba(186, 230, 253, 0.06)");
  g1.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = g1;
  ctx.beginPath();
  ctx.arc(x1, y1, r1, 0, Math.PI * 2);
  ctx.fill();

  // Aura 2: Sunrise Amber
  const x2 = 1550 + Math.cos(frame * 0.011) * 110;
  const y2 = 680 + Math.sin(frame * 0.014) * 90;
  const r2 = 750;
  const g2 = ctx.createRadialGradient(x2, y2, 40, x2, y2, r2);
  g2.addColorStop(0, "rgba(251, 146, 60, 0.10)");
  g2.addColorStop(0.6, "rgba(253, 230, 138, 0.04)");
  g2.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = g2;
  ctx.beginPath();
  ctx.arc(x2, y2, r2, 0, Math.PI * 2);
  ctx.fill();

  // Aura 3: Royal Violet Accent
  const x3 = 960 + Math.sin(frame * 0.015) * 90;
  const y3 = 950 + Math.cos(frame * 0.013) * 70;
  const r3 = 600;
  const g3 = ctx.createRadialGradient(x3, y3, 30, x3, y3, r3);
  g3.addColorStop(0, "rgba(99, 102, 241, 0.08)");
  g3.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = g3;
  ctx.beginPath();
  ctx.arc(x3, y3, r3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// ==========================================
// 4. SCENE ORCHESTRATION WITH CINEMATIC CAMERA DOLLY
// ==========================================
function renderFrame(frame) {
  ctx.clearRect(0, 0, 1920, 1080);

  // Subtle Organic Cinematic Camera Push-in (1.00 to 1.015 zoom drift)
  const cameraZoom = 1.0 + Math.sin(frame * 0.003) * 0.012;
  const cameraPanX = Math.cos(frame * 0.002) * 5;
  const cameraPanY = Math.sin(frame * 0.0025) * 4;

  ctx.save();
  ctx.translate(960, 540);
  ctx.scale(cameraZoom, cameraZoom);
  ctx.translate(-960 + cameraPanX, -540 + cameraPanY);

  drawGradientMesh(frame);
  drawKineticGrid(frame);

  if (frame < 420) {
    currentSceneTag.textContent = "01 • Bối cảnh đề án";
    renderScene01(frame);
  } else if (frame < 900) {
    currentSceneTag.textContent = "02 • Khảo sát 105 sinh viên";
    renderScene02(frame - 420);
  } else if (frame < 1500) {
    currentSceneTag.textContent = "03 • Event Hub & QR Check-in";
    renderScene03(frame - 900);
  } else if (frame < 1980) {
    currentSceneTag.textContent = "04 • Hệ sinh thái 30+ CLB";
    renderScene04(frame - 1500);
  } else if (frame < 2400) {
    currentSceneTag.textContent = "05 • Chuẩn hóa Cert A1 - A2 - A3";
    renderScene05(frame - 1980);
  } else {
    currentSceneTag.textContent = "06 • Tổng kết & Kêu gọi";
    renderScene06(frame - 2400);
  }

  ctx.restore();
}

// ------------------------------------------
// SCENE 1: Academic Editorial Intro (0:00 - 0:07)
// Bold, Commanding, Balanced Layout with Specular Light Sweeps
// ------------------------------------------
function renderScene01(f) {
  const p = Math.min(f / 45, 1.0);
  const exitOpacity = f > 390 ? (420 - f) / 30 : 1.0;
  const opacity = Math.min(f / 20, 1.0) * exitOpacity;

  ctx.save();
  ctx.globalAlpha = opacity;

  const leftX = 160;

  // Top Category Pill Tag (Y = 200) - Kinetic Entrance with Light Glint
  const pillProgress = Math.min(f / 30, 1.0);
  ctx.save();
  ctx.fillStyle = "rgba(239, 246, 255, 0.95)";
  ctx.strokeStyle = "rgba(191, 219, 254, 0.85)";
  ctx.lineWidth = 1.5;
  ctx.shadowColor = "rgba(10, 37, 64, 0.05)";
  ctx.shadowBlur = 15;
  ctx.beginPath();
  ctx.roundRect(leftX, 200, 920, 48, 24);
  ctx.fill();
  ctx.stroke();

  // Subtle sweep across pill
  const pillSweepX = leftX + (f * 18) % 1200;
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(leftX, 200, 920, 48, 24);
  ctx.clip();
  const pillSheen = ctx.createLinearGradient(pillSweepX - 60, 200, pillSweepX + 60, 248);
  pillSheen.addColorStop(0, "rgba(255, 255, 255, 0)");
  pillSheen.addColorStop(0.5, "rgba(255, 255, 255, 0.6)");
  pillSheen.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = pillSheen;
  ctx.fillRect(leftX, 200, 920, 48);
  ctx.restore();

  ctx.fillStyle = "#002B7F";
  ctx.font = "bold 20px 'Be Vietnam Pro'";
  ctx.letterSpacing = "2px";
  ctx.fillText("TRƯỜNG ĐẠI HỌC NGOẠI NGỮ – ĐHQGHN  •  BỘ MÔN CNTT & TRUYỀN THÔNG", leftX + 28, 231);
  ctx.restore();

  // Grand Display Title: ULIS VIBE (Y = 410)
  const titleOffset = (1 - easeOutCubic(p)) * 30;
  ctx.fillStyle = "#002B7F";
  ctx.font = "900 126px 'Be Vietnam Pro'";
  ctx.letterSpacing = "-2px";
  ctx.fillText("ULIS VIBE", leftX, 390 + titleOffset);

  // Optical Light Flare streak passing through Title
  if (f < 120) {
    const flareProgress = f / 120;
    const flareX = leftX + flareProgress * 700;
    const flareAlpha = Math.sin(flareProgress * Math.PI) * 0.7;
    drawAnamorphicFlare(flareX, 360, 280, flareAlpha);
  }

  // Thesis Subtitle (Y = 480)
  ctx.fillStyle = "#1E293B";
  ctx.font = "600 36px 'Be Vietnam Pro'";
  ctx.fillText("Cổng sự kiện, câu lạc bộ & chuẩn hóa chứng nhận ngoại khóa.", leftX, 470 + titleOffset * 0.7);

  // Description Paragraph (Y = 540)
  ctx.fillStyle = "#475569";
  ctx.font = "400 24px 'Be Vietnam Pro'";
  ctx.fillText("Nền tảng số hóa tập trung giải quyết triệt để vấn đề phân tán thông tin,", leftX, 540 + titleOffset * 0.5);
  ctx.fillText("đồng bộ hóa lịch tuyển quân và khung minh chứng Cert A1 - A2 - A3.", leftX, 576 + titleOffset * 0.5);

  // Academic Badges Row (Y = 650) - Rendered with Specular Glass Sheen
  drawCardWithSpecular(leftX, 650, 480, 56, 16, f, { sheenSpeed: 160, sheenDelay: 0 });
  ctx.fillStyle = "#0A2540";
  ctx.font = "bold 20px 'Be Vietnam Pro'";
  ctx.fillText("Đề án Giữa kỳ • Học phần FLF1007", leftX + 30, 685);

  // Badge 2: Team 109 with animated pulsing beacon
  drawCardWithSpecular(leftX + 510, 650, 380, 56, 16, f, { sheenSpeed: 160, sheenDelay: 40 });
  // Pulsing Amber Beacon
  const beaconR = 5 + Math.sin(f * 0.12) * 1.5;
  ctx.fillStyle = "#D97706";
  ctx.beginPath();
  ctx.arc(leftX + 538, 678, beaconR, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#D97706";
  ctx.font = "bold 20px 'Be Vietnam Pro'";
  ctx.fillText("Nhóm thực hiện: Nhóm 109", leftX + 555, 685);

  // Right Side: Grand University Logo Artwork with Precision Corner Brackets
  ctx.save();
  const sealX = 1480;
  const sealY = 460;
  const floatY = Math.sin(f * 0.035) * 8;
  const floatX = Math.cos(f * 0.025) * 4;

  ctx.translate(sealX + floatX, sealY + floatY);
  ctx.scale(spring(p), spring(p));

  const logoSize = 250;
  const bracketGap = 160;

  // Technical Framing Corner Brackets
  ctx.strokeStyle = "rgba(2, 132, 199, 0.4)";
  ctx.lineWidth = 2;
  const bLen = 22;
  // Top Left
  ctx.beginPath(); ctx.moveTo(-bracketGap, -bracketGap + bLen); ctx.lineTo(-bracketGap, -bracketGap); ctx.lineTo(-bracketGap + bLen, -bracketGap); ctx.stroke();
  // Top Right
  ctx.beginPath(); ctx.moveTo(bracketGap, -bracketGap + bLen); ctx.lineTo(bracketGap, -bracketGap); ctx.lineTo(bracketGap - bLen, -bracketGap); ctx.stroke();
  // Bottom Left
  ctx.beginPath(); ctx.moveTo(-bracketGap, bracketGap - bLen); ctx.lineTo(-bracketGap, bracketGap); ctx.lineTo(-bracketGap + bLen, bracketGap); ctx.stroke();
  // Bottom Right
  ctx.beginPath(); ctx.moveTo(bracketGap, bracketGap - bLen); ctx.lineTo(bracketGap, bracketGap); ctx.lineTo(bracketGap - bLen, bracketGap); ctx.stroke();

  if (assets.logo.complete) {
    ctx.shadowColor = "rgba(10, 37, 64, 0.14)";
    ctx.shadowBlur = 45;
    ctx.shadowOffsetY = 16;
    ctx.drawImage(assets.logo, -logoSize / 2, -logoSize / 2, logoSize, logoSize);
  }
  ctx.restore();

  ctx.restore();
}

// ------------------------------------------
// SCENE 2: Khảo sát thực tế 105 sinh viên (0:07 - 0:15)
// Holographic Radial Gauge & Realtime Odometer Counters
// ------------------------------------------
function renderScene02(f) {
  const p = Math.min(f / 45, 1.0);
  const exitOpacity = f > 450 ? (480 - f) / 30 : 1.0;
  ctx.save();
  ctx.globalAlpha = Math.min(f / 20, 1.0) * exitOpacity;

  const leftX = 160;

  // Header Eyebrow (Y = 120)
  ctx.fillStyle = "#0284C7";
  ctx.font = "bold 18px 'Be Vietnam Pro'";
  ctx.letterSpacing = "2px";
  ctx.fillText("CƠ SỞ THỰC TIỄN  •  DỮ LIỆU ĐỀ ÁN", leftX, 120);

  // Section Headline (Y = 175)
  ctx.fillStyle = "#0A2540";
  ctx.font = "900 52px 'Be Vietnam Pro'";
  ctx.letterSpacing = "-0.5px";
  ctx.fillText("Khảo sát thực tế 105 sinh viên ULIS", leftX, 175);

  ctx.fillStyle = "#64748B";
  ctx.font = "500 22px 'Be Vietnam Pro'";
  ctx.fillText("Minh chứng tính cấp thiết để xây dựng giải pháp số hóa ngoại khóa tập trung", leftX, 218);

  const heroProgress = easeOutCubic(p);

  // CARD 1 (LEFT): Hero 71.5% with Holographic Donut Gauge
  const card1X = leftX;
  const card1Y = 270;
  const card1W = 760;
  const card1H = 590;

  drawCardWithSpecular(card1X, card1Y, card1W, card1H, 28, f, { sheenDelay: 0 });

  // Left Color Accent Bar
  ctx.fillStyle = "#EF4444";
  ctx.beginPath();
  ctx.roundRect(card1X, card1Y, 8, card1H, [28, 0, 0, 28]);
  ctx.fill();

  const c1TextX = card1X + 50;

  // Tag
  ctx.fillStyle = "rgba(254, 242, 242, 1)";
  ctx.beginPath();
  ctx.roundRect(c1TextX, card1Y + 45, 220, 36, 18);
  ctx.fill();
  ctx.fillStyle = "#DC2626";
  ctx.font = "bold 15px 'Be Vietnam Pro'";
  ctx.fillText("TỶ LỆ BÁO ĐỘNG", c1TextX + 42, card1Y + 68);

  // Stat Counter (Rolling Odometer)
  const heroVal = (71.5 * heroProgress).toFixed(1);
  const heroGrad = ctx.createLinearGradient(c1TextX, card1Y + 120, c1TextX + 320, card1Y + 240);
  heroGrad.addColorStop(0, "#002B7F");
  heroGrad.addColorStop(1, "#EF4444");
  ctx.fillStyle = heroGrad;
  ctx.font = "900 112px 'Be Vietnam Pro'";
  ctx.letterSpacing = "-3px";
  ctx.fillText(`${heroVal}%`, c1TextX, card1Y + 205);

  // High-Tech Radial Progress Donut Gauge on Right of Card 1
  drawRadialProgressDonut(card1X + card1W - 130, card1Y + 155, 62, 71.5, f, p);

  // Metric Heading
  ctx.fillStyle = "#0F172A";
  ctx.font = "bold 32px 'Be Vietnam Pro'";
  ctx.fillText("Sinh viên từng bỏ lỡ sự kiện", c1TextX, card1Y + 275);

  // Descriptive Body Text
  ctx.fillStyle = "#475569";
  ctx.font = "400 22px 'Be Vietnam Pro'";
  ctx.fillText("Hơn 70% sinh viên gặp khó khăn tiếp cận thông tin", c1TextX, card1Y + 330);
  ctx.fillText("do các bài đăng bị trôi nhanh trên mạng xã hội,", c1TextX, card1Y + 368);
  ctx.fillText("không có hệ thống lưu trữ và nhắc lịch tập trung.", c1TextX, card1Y + 406);

  // Takeaway Box
  ctx.fillStyle = "#F8FAFC";
  ctx.strokeStyle = "rgba(226, 232, 240, 0.9)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(c1TextX, card1Y + 460, card1W - 100, 75, 18);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#002B7F";
  ctx.font = "bold 18px 'Be Vietnam Pro'";
  ctx.fillText("Hệ quả thực tế:", c1TextX + 24, card1Y + 492);
  ctx.fillStyle = "#64748B";
  ctx.font = "500 17px 'Be Vietnam Pro'";
  ctx.fillText("Mất cơ hội xét học bổng và điểm rèn luyện ngoại khóa.", c1TextX + 24, card1Y + 520);

  // CARD 2 (RIGHT): 82.9% & 91.4% with Active Laser Bars
  const card2X = card1X + card1W + 40;
  const card2Y = 270;
  const card2W = 800;
  const card2H = 590;

  drawCardWithSpecular(card2X, card2Y, card2W, card2H, 28, f, { sheenDelay: 50 });

  const c2TextX = card2X + 50;
  const pBarW = card2W - 100;

  // BLOCK 1: 82.9%
  const val1 = (82.9 * heroProgress).toFixed(1);
  ctx.fillStyle = "#D97706";
  ctx.font = "900 68px 'Be Vietnam Pro'";
  ctx.fillText(`${val1}%`, c2TextX, card2Y + 95);

  ctx.fillStyle = "#0F172A";
  ctx.font = "bold 26px 'Be Vietnam Pro'";
  ctx.fillText("Khó khăn tra cứu tiêu chuẩn Cert A1, A2, A3", c2TextX, card2Y + 145);

  ctx.fillStyle = "#64748B";
  ctx.font = "400 20px 'Be Vietnam Pro'";
  ctx.fillText("Mơ hồ giữa các quy định minh chứng điểm rèn luyện.", c2TextX, card2Y + 185);

  // Progress Bar 1 with Laser Pulse Bead
  ctx.fillStyle = "rgba(241, 245, 249, 1)";
  ctx.beginPath();
  ctx.roundRect(c2TextX, card2Y + 215, pBarW, 10, 5);
  ctx.fill();

  const bar1Filled = pBarW * (82.9 / 100) * heroProgress;
  const pGrad1 = ctx.createLinearGradient(c2TextX, 0, c2TextX + pBarW, 0);
  pGrad1.addColorStop(0, "#002B7F");
  pGrad1.addColorStop(1, "#D97706");
  ctx.fillStyle = pGrad1;
  ctx.beginPath();
  ctx.roundRect(c2TextX, card2Y + 215, bar1Filled, 10, 5);
  ctx.fill();

  // Glowing laser cursor at tip
  if (bar1Filled > 5) {
    ctx.fillStyle = "#FFFFFF";
    ctx.shadowColor = "#D97706";
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(c2TextX + bar1Filled, card2Y + 220, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowColor = "transparent";
  }

  // Divider
  ctx.strokeStyle = "rgba(226, 232, 240, 0.7)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(c2TextX, card2Y + 285);
  ctx.lineTo(c2TextX + pBarW, card2Y + 285);
  ctx.stroke();

  // BLOCK 2: 91.4%
  const val2 = (91.4 * heroProgress).toFixed(1);
  ctx.fillStyle = "#059669";
  ctx.font = "900 68px 'Be Vietnam Pro'";
  ctx.fillText(`${val2}%`, c2TextX, card2Y + 375);

  ctx.fillStyle = "#0F172A";
  ctx.font = "bold 26px 'Be Vietnam Pro'";
  ctx.fillText("Ủng hộ xây dựng nền tảng kết nối tập trung", c2TextX, card2Y + 425);

  ctx.fillStyle = "#64748B";
  ctx.font = "400 20px 'Be Vietnam Pro'";
  ctx.fillText("Mong muốn một giải pháp chính thống, đồng bộ cho ULIS.", c2TextX, card2Y + 465);

  // Progress Bar 2 with Laser Pulse Bead
  ctx.fillStyle = "rgba(241, 245, 249, 1)";
  ctx.beginPath();
  ctx.roundRect(c2TextX, card2Y + 495, pBarW, 10, 5);
  ctx.fill();

  const bar2Filled = pBarW * (91.4 / 100) * heroProgress;
  const pGrad2 = ctx.createLinearGradient(c2TextX, 0, c2TextX + pBarW, 0);
  pGrad2.addColorStop(0, "#002B7F");
  pGrad2.addColorStop(1, "#059669");
  ctx.fillStyle = pGrad2;
  ctx.beginPath();
  ctx.roundRect(c2TextX, card2Y + 495, bar2Filled, 10, 5);
  ctx.fill();

  if (bar2Filled > 5) {
    ctx.fillStyle = "#FFFFFF";
    ctx.shadowColor = "#059669";
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(c2TextX + bar2Filled, card2Y + 500, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowColor = "transparent";
  }

  ctx.restore();
}

// ------------------------------------------
// SCENE 3: Event Hub & Cyber Laser QR Scanner (0:15 - 0:25)
// ------------------------------------------
function renderScene03(f) {
  const p = Math.min(f / 45, 1.0);
  const exitOpacity = f > 570 ? (600 - f) / 30 : 1.0;
  ctx.save();
  ctx.globalAlpha = Math.min(f / 20, 1.0) * exitOpacity;

  const leftX = 160;

  // Header (Y = 120, 175)
  ctx.fillStyle = "#0284C7";
  ctx.font = "bold 18px 'Be Vietnam Pro'";
  ctx.letterSpacing = "2px";
  ctx.fillText("TÍNH NĂNG 01  •  EVENT HUB", leftX, 120);

  ctx.fillStyle = "#0A2540";
  ctx.font = "900 52px 'Be Vietnam Pro'";
  ctx.letterSpacing = "-0.5px";
  ctx.fillText("Lịch sự kiện & Tuyển quân toàn trường", leftX, 175);

  ctx.fillStyle = "#64748B";
  ctx.font = "500 22px 'Be Vietnam Pro'";
  ctx.fillText("Cổng tổng hợp sự kiện khoa học, hội thảo học thuật và tuyển quân CLB", leftX, 218);

  // LEFT COLUMN: 3 Feature Cards with Specular Sheen
  const features = [
    { num: "01", title: "Lọc chuẩn hóa theo Cert A1, A2, A3", desc: "Đồng bộ mục đích rèn luyện và chuẩn đầu ra ngoại khóa cho từng khóa sinh viên." },
    { num: "02", title: "Suất tham gia thời gian thực (Realtime)", desc: "Tránh quá tải nộp đơn, minh bạch số lượng chỗ ngồi còn lại cho từng sự kiện." },
    { num: "03", title: "Mã QR Check-in điểm danh tự động", desc: "Xác thực danh sách sinh viên tức thời tại hội trường, chống gian lận minh chứng." }
  ];

  features.forEach((feat, idx) => {
    const cardY = 270 + idx * 205;
    const cardProgress = Math.min(Math.max((f - idx * 10) / 35, 0), 1.0);
    const cardOffset = (1 - easeOutCubic(cardProgress)) * 30;

    ctx.save();
    ctx.translate(leftX + cardOffset, cardY);

    drawCardWithSpecular(0, 0, 680, 180, 24, f, { sheenDelay: idx * 45 });

    // Number Badge with pulse
    ctx.fillStyle = "rgba(239, 246, 255, 1)";
    ctx.beginPath();
    ctx.roundRect(30, 30, 56, 44, 12);
    ctx.fill();

    ctx.fillStyle = "#002B7F";
    ctx.font = "bold 22px 'Be Vietnam Pro'";
    ctx.textAlign = "center";
    ctx.fillText(feat.num, 58, 60);

    // Title & Desc
    ctx.textAlign = "left";
    ctx.fillStyle = "#0F172A";
    ctx.font = "bold 24px 'Be Vietnam Pro'";
    ctx.fillText(feat.title, 105, 58);

    ctx.fillStyle = "#475569";
    ctx.font = "400 19px 'Be Vietnam Pro'";
    ctx.fillText(feat.desc.substring(0, 48), 105, 105);
    ctx.fillText(feat.desc.substring(48), 105, 138);

    ctx.restore();
  });

  // RIGHT COLUMN: Hero Event Poster Card
  const heroCardX = leftX + 680 + 40;
  const heroCardY = 270;
  const heroCardW = 880;
  const heroCardH = 590;

  drawCardWithSpecular(heroCardX, heroCardY, heroCardW, heroCardH, 28, f, { sheenDelay: 70 });

  // Banner image (Height 340px)
  if (assets.ev01.complete) {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(heroCardX, heroCardY, heroCardW, 340, [28, 28, 0, 0]);
    ctx.clip();
    ctx.drawImage(assets.ev01, heroCardX, heroCardY, heroCardW, 340);
    ctx.restore();
  }

  // Card Content Area (Height 250px)
  const cX = heroCardX + 40;
  const cY = heroCardY + 380;

  // Title
  ctx.fillStyle = "#0A2540";
  ctx.font = "bold 28px 'Be Vietnam Pro'";
  ctx.fillText("Hội thảo: Viết Báo Cáo Nghiên Cứu Khoa Học 2026", cX, cY);

  // Subtitle
  ctx.fillStyle = "#0284C7";
  ctx.font = "600 20px 'Be Vietnam Pro'";
  ctx.fillText("Cert A1 • Học thuật & NCKH  •  Hội trường Sunwah (20/11 - 08:30)", cX, cY + 40);

  // Realtime Seat Progress Bar with Shimmer Pulse
  const sBarW = 580;
  ctx.fillStyle = "rgba(241, 245, 249, 1)";
  ctx.beginPath();
  ctx.roundRect(cX, cY + 75, sBarW, 8, 4);
  ctx.fill();

  const filledW = sBarW * 0.55 * easeOutCubic(p);
  ctx.fillStyle = "#002B7F";
  ctx.beginPath();
  ctx.roundRect(cX, cY + 75, filledW, 8, 4);
  ctx.fill();

  // Moving shimmer pulse along progress bar
  if (filledW > 10) {
    const shimmerPos = (f * 5) % filledW;
    ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
    ctx.beginPath();
    ctx.arc(cX + shimmerPos, cY + 79, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "#64748B";
  ctx.font = "500 17px 'Be Vietnam Pro'";
  ctx.fillText("Còn 45/100 suất đăng ký chính thức", cX, cY + 115);

  // High-Tech Cyber Laser QR Code Scanner
  const qrX = heroCardX + heroCardW - 170;
  const qrY = heroCardY + 400;

  ctx.fillStyle = "#F8FAFC";
  ctx.strokeStyle = "rgba(2, 132, 199, 0.4)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(qrX, qrY, 130, 130, 20);
  ctx.fill();
  ctx.stroke();

  // Animated Laser Scanner Beam sweeping up and down QR box
  drawAnimatedLaserScanner(qrX, qrY, 130, 130, f);

  // Pulsing Sonar Waves
  const pulseRadius = 38 + ((f * 1.6) % 26);
  const pulseAlpha = Math.max(0, 1 - (pulseRadius - 38) / 26);
  ctx.strokeStyle = `rgba(16, 185, 129, ${pulseAlpha})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(qrX + 65, qrY + 65, pulseRadius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "#002B7F";
  ctx.font = "bold 13px 'Be Vietnam Pro'";
  ctx.textAlign = "center";
  ctx.fillText("QR CHECK-IN", qrX + 65, qrY + 105);

  ctx.fillStyle = "#10B981";
  ctx.font = "bold 32px 'Segoe UI Emoji', sans-serif";
  ctx.fillText("📱", qrX + 65, qrY + 65);

  ctx.restore();
}

// ------------------------------------------
// SCENE 4: Club Directory with Kinetic Energy Pulses (0:25 - 0:33)
// ------------------------------------------
function renderScene04(f) {
  const p = Math.min(f / 45, 1.0);
  const exitOpacity = f > 450 ? (480 - f) / 30 : 1.0;
  ctx.save();
  ctx.globalAlpha = Math.min(f / 20, 1.0) * exitOpacity;

  const leftX = 160;

  // Header (Y = 120, 175)
  ctx.fillStyle = "#0284C7";
  ctx.font = "bold 18px 'Be Vietnam Pro'";
  ctx.letterSpacing = "2px";
  ctx.fillText("TÍNH NĂNG 02  •  CLUB DIRECTORY", leftX, 120);

  ctx.fillStyle = "#0A2540";
  ctx.font = "900 52px 'Be Vietnam Pro'";
  ctx.letterSpacing = "-0.5px";
  ctx.fillText("Hệ sinh thái 30+ Câu lạc bộ", leftX, 175);

  ctx.fillStyle = "#64748B";
  ctx.font = "500 22px 'Be Vietnam Pro'";
  ctx.fillText("Khắc phục hoàn toàn tình trạng thông tin tuyển thành viên bị trôi và phân tán", leftX, 218);

  // LEFT COLUMN: Bento Hero Card 30+ with Concentric Radar Rings
  const heroProgress = easeOutCubic(p);
  const leftW = 560;
  const leftH = 590;

  drawCardWithSpecular(leftX, 270, leftW, leftH, 28, f, { sheenDelay: 0 });

  const cX = leftX + 50;

  // Concentric Radar Orbit Rings behind 30+
  ctx.save();
  for (let r = 1; r <= 3; r++) {
    const ringRadius = 70 * r + ((f * 0.5) % 35);
    const ringAlpha = Math.max(0, 0.12 - (ringRadius - 70) * 0.0006);
    ctx.strokeStyle = `rgba(2, 132, 199, ${ringAlpha})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(leftX + leftW / 2, 400, ringRadius, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();

  // Big 30+ Number
  const numVal = Math.floor(30 * heroProgress);
  const numGrad = ctx.createLinearGradient(cX, 350, cX + 280, 480);
  numGrad.addColorStop(0, "#002B7F");
  numGrad.addColorStop(1, "#0284C7");
  ctx.fillStyle = numGrad;
  ctx.font = "900 128px 'Be Vietnam Pro'";
  ctx.letterSpacing = "-3px";
  ctx.fillText(`${numVal}+`, cX, 420);

  ctx.fillStyle = "#0F172A";
  ctx.font = "bold 32px 'Be Vietnam Pro'";
  ctx.fillText("CLB trực thuộc toàn trường", cX, 485);

  ctx.fillStyle = "#475569";
  ctx.font = "400 22px 'Be Vietnam Pro'";
  ctx.fillText("Tập hợp hồ sơ, ban chuyên môn và lịch mở đơn", cX, 540);
  ctx.fillText("của cả 3 khối CLB trực thuộc Đoàn - Hội ULIS.", cX, 578);

  ctx.fillStyle = "#F8FAFC";
  ctx.strokeStyle = "rgba(226, 232, 240, 0.9)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(cX, 630, leftW - 100, 75, 18);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#002B7F";
  ctx.font = "bold 18px 'Be Vietnam Pro'";
  ctx.fillText("Đồng bộ hóa lịch tuyển quân:", cX + 24, 662);
  ctx.fillStyle = "#64748B";
  ctx.font = "500 17px 'Be Vietnam Pro'";
  ctx.fillText("Giúp tân sinh viên không bỏ lỡ đợt tuyển đầu năm.", cX + 24, 690);

  // RIGHT COLUMN: 3 Rows with Kinetic Traveling Energy Pulses
  const rightX = leftX + leftW + 40;
  const rows = [
    { title: "Khối Học thuật & NCKH", desc: "K-ULIS (Hàn Quốc), SRC Nghiên cứu trẻ, E4C Tiếng Anh, CLB Tiếng Trung...", badge: "Cert A1", color: "#0284C7" },
    { title: "Khối Tài năng, Văn hóa & Thể thao", desc: "MMC Âm nhạc, Dance Club, UFC Bóng đá, Guitar Club, CLB Võ thuật...", badge: "Ngoại khóa", color: "#F59E0B" },
    { title: "Khối Kỹ năng, Xung kích & Tình nguyện", desc: "Đội Lễ tân URT, Sắc Màu, Máu Ngoại Ngữ, Hoa Phượng Đỏ, Đội Thanh niên xung kích...", badge: "Cert A2 • A3", color: "#10B981" }
  ];

  rows.forEach((r, idx) => {
    const rowY = 270 + idx * 205;
    const rowProgress = Math.min(Math.max((f - idx * 10) / 35, 0), 1.0);
    const rowOffset = (1 - easeOutCubic(rowProgress)) * 30;

    ctx.save();
    ctx.translate(rightX + rowOffset, rowY);

    drawCardWithSpecular(0, 0, 1000, 180, 24, f, { sheenDelay: idx * 40 });

    // Left Color Accent Bar
    ctx.fillStyle = r.color;
    ctx.beginPath();
    ctx.roundRect(0, 0, 8, 180, [24, 0, 0, 24]);
    ctx.fill();

    // Kinetic Energy Pulse Bead Traveling along accent bar
    const pulseTravelY = (f * 3.5 + idx * 60) % 180;
    ctx.fillStyle = "#FFFFFF";
    ctx.shadowColor = r.color;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(4, pulseTravelY, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowColor = "transparent";

    // Title
    ctx.fillStyle = "#0A2540";
    ctx.font = "bold 26px 'Be Vietnam Pro'";
    ctx.fillText(r.title, 45, 60);

    // Description
    ctx.fillStyle = "#475569";
    ctx.font = "400 20px 'Be Vietnam Pro'";
    ctx.fillText(r.desc, 45, 115);

    // Pill Badge with live blinking dot
    ctx.fillStyle = "#F1F5F9";
    ctx.strokeStyle = "rgba(226, 232, 240, 0.9)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(810, 40, 150, 44, 22);
    ctx.fill();
    ctx.stroke();

    // Live green blinking dot
    const blinkAlpha = 0.4 + Math.sin(f * 0.15) * 0.6;
    ctx.fillStyle = `rgba(16, 185, 129, ${blinkAlpha})`;
    ctx.beginPath();
    ctx.arc(830, 62, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#002B7F";
    ctx.font = "bold 16px 'Be Vietnam Pro'";
    ctx.textAlign = "center";
    ctx.fillText(r.badge, 895, 68);

    ctx.restore();
  });

  ctx.restore();
}

// ------------------------------------------
// SCENE 5: Cert Hub with Prismatic Holographic Foils (0:33 - 0:40)
// ------------------------------------------
function renderScene05(f) {
  const p = Math.min(f / 45, 1.0);
  const exitOpacity = f > 390 ? (420 - f) / 30 : 1.0;
  ctx.save();
  ctx.globalAlpha = Math.min(f / 20, 1.0) * exitOpacity;

  const leftX = 160;

  // Header (Y = 120, 175)
  ctx.fillStyle = "#0284C7";
  ctx.font = "bold 18px 'Be Vietnam Pro'";
  ctx.letterSpacing = "2px";
  ctx.fillText("TÍNH NĂNG 03  •  CERT HUB", leftX, 120);

  ctx.fillStyle = "#0A2540";
  ctx.font = "900 52px 'Be Vietnam Pro'";
  ctx.letterSpacing = "-0.5px";
  ctx.fillText("Chuẩn hóa chứng nhận ngoại khóa A1 • A2 • A3", leftX, 175);

  ctx.fillStyle = "#64748B";
  ctx.font = "500 22px 'Be Vietnam Pro'";
  ctx.fillText("Cẩm nang minh bạch hóa quy định điểm rèn luyện cho sinh viên các khóa", leftX, 218);

  // 3 Stately Horizontal Tier Cards with Metallic Foil Glints
  const tiers = [
    {
      code: "CERT A1",
      label: "Học Thuật & Nghiên Cứu Khoa Học",
      examples: "Hội thảo nghiên cứu khoa học các cấp, tọa đàm học thuật ngoại ngữ, báo cáo chuyên đề khoa học.",
      points: "+5 đến +10 ĐRL",
      colorStart: "#002B7F",
      colorEnd: "#0284C7"
    },
    {
      code: "CERT A2",
      label: "Kỹ Năng & Hoạt Động Đoàn - Hội",
      examples: "Ban tổ chức sự kiện, tuyển quân CLB, tập huấn kỹ năng mềm, hội thao sinh viên, lễ tân khánh tiết.",
      points: "+3 đến +8 ĐRL",
      colorStart: "#D97706",
      colorEnd: "#F59E0B"
    },
    {
      code: "CERT A3",
      label: "Tình Nguyện & Hoạt Động Vì Cộng Đồng",
      examples: "Hiến máu nhân đạo toàn trường, chiến dịch Mùa hè xanh, Tiếp sức mùa thi, công tác thiện nguyện xã hội.",
      points: "+5 đến +15 ĐRL",
      colorStart: "#059669",
      colorEnd: "#10B981"
    }
  ];

  tiers.forEach((t, idx) => {
    const cardY = 270 + idx * 205;
    const cardProgress = Math.min(Math.max((f - idx * 10) / 35, 0), 1.0);
    const cardOffset = (1 - easeOutCubic(cardProgress)) * 40;

    ctx.save();
    ctx.translate(leftX + cardOffset, cardY);

    drawCardWithSpecular(0, 0, 1600, 180, 24, f, { sheenDelay: idx * 45 });

    // Metallic Foil Code Badge (Left)
    const foilGrad = ctx.createLinearGradient(40, 45, 180, 97);
    foilGrad.addColorStop(0, t.colorStart);
    foilGrad.addColorStop(1, t.colorEnd);
    ctx.fillStyle = foilGrad;
    ctx.shadowColor = t.colorStart;
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.roundRect(40, 45, 140, 52, 16);
    ctx.fill();
    ctx.shadowColor = "transparent";

    // Prismatic Sheen Sweep across badge
    const badgeSheenX = 40 + ((f * 3 + idx * 40) % 240);
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(40, 45, 140, 52, 16);
    ctx.clip();
    const bSheen = ctx.createLinearGradient(badgeSheenX - 30, 45, badgeSheenX + 30, 97);
    bSheen.addColorStop(0, "rgba(255, 255, 255, 0)");
    bSheen.addColorStop(0.5, "rgba(255, 255, 255, 0.5)");
    bSheen.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = bSheen;
    ctx.fillRect(40, 45, 140, 52);
    ctx.restore();

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 22px 'Be Vietnam Pro'";
    ctx.textAlign = "center";
    ctx.fillText(t.code, 110, 78);

    // Label & Examples
    ctx.textAlign = "left";
    ctx.fillStyle = "#0A2540";
    ctx.font = "bold 26px 'Be Vietnam Pro'";
    ctx.fillText(t.label, 210, 80);

    ctx.fillStyle = "#475569";
    ctx.font = "400 20px 'Be Vietnam Pro'";
    ctx.fillText(t.examples, 210, 130);

    // Points Tag (Right) with Animated Green Checkmark
    ctx.fillStyle = "#F8FAFC";
    ctx.strokeStyle = "rgba(226, 232, 240, 0.9)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(1340, 60, 220, 56, 28);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = t.colorStart;
    ctx.font = "bold 20px 'Be Vietnam Pro'";
    ctx.textAlign = "center";
    ctx.fillText(`✓ ${t.points}`, 1450, 96);

    ctx.restore();
  });

  ctx.restore();
}

// ------------------------------------------
// SCENE 6: Outro — Finale with Lens Flare & Prismatic Confetti (0:40 - 0:45)
// ------------------------------------------
function renderScene06(f) {
  const p = Math.min(f / 45, 1.0);
  ctx.save();
  ctx.globalAlpha = Math.min(f / 20, 1.0);
  ctx.textAlign = "center";

  const centerX = 960;

  // Floating Prismatic Shards / Confetti in Finale
  FINALE_CONFETTI.forEach(c => {
    const py = (c.y - f * c.floatSpeed + 900 * 10) % 900 + 40;
    const px = c.x + Math.sin(f * 0.03 + c.phase) * 20;
    const rot = f * c.rotSpeed + c.phase;

    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(rot);
    ctx.fillStyle = c.color;
    ctx.globalAlpha = 0.22 + 0.16 * Math.sin(f * 0.05 + c.phase);
    ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size * 0.6);
    ctx.restore();
  });

  // University Crest Logo (Y = 180)
  ctx.save();
  ctx.translate(centerX, 180);
  ctx.scale(spring(p), spring(p));

  if (assets.logo.complete) {
    ctx.shadowColor = "rgba(10, 37, 64, 0.16)";
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 14;
    const logoSize = 140;
    ctx.drawImage(assets.logo, -logoSize / 2, -logoSize / 2, logoSize, logoSize);
  }
  ctx.restore();

  // Grand Title (Y = 350)
  const titleY = 350 - (1 - easeOutCubic(p)) * 20;
  ctx.fillStyle = "#002B7F";
  ctx.font = "900 114px 'Be Vietnam Pro'";
  ctx.letterSpacing = "-2px";
  ctx.fillText("ULIS VIBE", centerX, titleY);

  // Cinematic Anamorphic Lens Flare passing across Grand Title
  const flareX = centerX - 400 + ((f * 8) % 800);
  drawAnamorphicFlare(flareX, titleY - 25, 340, 0.55);

  // Slogan (Y = 420)
  ctx.fillStyle = "#002B7F";
  ctx.font = "bold 36px 'Be Vietnam Pro'";
  ctx.fillText("MỘT ĐIỂM CHẠM — VẠN CƠ HỘI NGOẠI KHÓA", centerX, titleY + 68);

  // Academic Presentation Card (Y = 520) with Perimeter Laser Trace
  const cWidth = 1180;
  const cHeight = 175;
  const cX = centerX - cWidth / 2;
  const cY = 520;

  drawCardWithSpecular(cX, cY, cWidth, cHeight, 24, f, { sheenDelay: 0 });

  // Perimeter Laser Point Tracing the Academic Card
  const perimeter = 2 * (cWidth + cHeight);
  const laserDist = (f * 7) % perimeter;
  let lpX = cX, lpY = cY;
  if (laserDist < cWidth) {
    lpX = cX + laserDist; lpY = cY;
  } else if (laserDist < cWidth + cHeight) {
    lpX = cX + cWidth; lpY = cY + (laserDist - cWidth);
  } else if (laserDist < 2 * cWidth + cHeight) {
    lpX = cX + cWidth - (laserDist - (cWidth + cHeight)); lpY = cY + cHeight;
  } else {
    lpX = cX; lpY = cY + cHeight - (laserDist - (2 * cWidth + cHeight));
  }
  ctx.fillStyle = "#38BDF8";
  ctx.shadowColor = "#0284C7";
  ctx.shadowBlur = 14;
  ctx.beginPath();
  ctx.arc(lpX, lpY, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowColor = "transparent";

  ctx.fillStyle = "#0A2540";
  ctx.font = "bold 26px 'Be Vietnam Pro'";
  ctx.fillText("ĐỀ ÁN BÀI TẬP NHÓM GIỮA KỲ • HỌC PHẦN FLF1007", centerX, 570);

  ctx.fillStyle = "#475569";
  ctx.font = "500 22px 'Be Vietnam Pro'";
  ctx.fillText("Bộ môn Công nghệ Thông tin & Truyền thông — Trường ĐH Ngoại ngữ, ĐHQGHN", centerX, 612);

  ctx.fillStyle = "#64748B";
  ctx.font = "400 19px 'Be Vietnam Pro'";
  ctx.fillText("Nhóm 109: Đoàn Thị Phương Thảo (Trưởng nhóm) • Đạt • Uyên • Linh • Trang", centerX, 650);

  // CTA Pill Button (Y = 770) with Multi-Tier Pulsing Energy Aura
  ctx.save();
  ctx.translate(centerX, 770);

  // Pulsing Ambient Aura
  const pulseR = 8 + Math.sin(f * 0.1) * 6;
  ctx.fillStyle = "rgba(2, 132, 199, 0.18)";
  ctx.beginPath();
  ctx.roundRect(-280 - pulseR, -32 - pulseR, 560 + pulseR * 2, 64 + pulseR * 2, 36);
  ctx.fill();

  ctx.fillStyle = "#002B7F";
  ctx.shadowColor = "rgba(0, 43, 127, 0.35)";
  ctx.shadowBlur = 32;
  ctx.shadowOffsetY = 12;
  ctx.beginPath();
  ctx.roundRect(-280, -32, 560, 64, 32);
  ctx.fill();

  // CTA Sheen Sweep
  const ctaSheenX = -280 + ((f * 6) % 700);
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(-280, -32, 560, 64, 32);
  ctx.clip();
  const ctaSheenGrad = ctx.createLinearGradient(ctaSheenX - 50, -32, ctaSheenX + 50, 32);
  ctaSheenGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
  ctaSheenGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.45)");
  ctaSheenGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = ctaSheenGrad;
  ctx.fillRect(-280, -32, 560, 64);
  ctx.restore();

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 21px 'Be Vietnam Pro'";
  ctx.letterSpacing = "0.5px";
  ctx.fillText("TRẢI NGHIỆM TẠI HTTP://LOCALHOST:5500", 0, 8);
  ctx.restore();

  ctx.restore();
}

// ==========================================
// 5. PLAYBACK & CONTROLLER LOGIC
// ==========================================
const SCENE_RANGES = [
  { start: 0, end: 419, name: "01 • Bối cảnh đề án" },
  { start: 420, end: 899, name: "02 • Khảo sát 105 sinh viên" },
  { start: 900, end: 1499, name: "03 • Cổng sự kiện Event Hub" },
  { start: 1500, end: 1979, name: "04 • Danh bạ 30+ CLB" },
  { start: 1980, end: 2399, name: "05 • Chuẩn hóa Cert A1-A2-A3" },
  { start: 2400, end: 2700, name: "06 • Tổng kết & Kêu gọi" },
];

function updateUI() {
  scrubber.value = currentFrame;
  const currentSec = Math.floor(currentFrame / FPS);
  const min = String(Math.floor(currentSec / 60)).padStart(2, "0");
  const sec = String(currentSec % 60).padStart(2, "0");
  timecodeCurrent.textContent = `${min}:${sec}`;

  // Dynamic Scene Indicator & Button Highlighting
  const currentSceneIdx = SCENE_RANGES.findIndex(s => currentFrame >= s.start && currentFrame <= s.end);
  if (currentSceneIdx !== -1) {
    if (currentSceneTag) {
      currentSceneTag.textContent = SCENE_RANGES[currentSceneIdx].name;
    }
    const jumpBtns = document.querySelectorAll(".scene-jump-btn");
    jumpBtns.forEach((btn) => {
      const sceneNum = parseInt(btn.getAttribute("data-scene"));
      if (sceneNum === currentSceneIdx) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }
}

function play() {
  if (isPlaying) return;
  isPlaying = true;
  bigPlayBtn.classList.add("hidden");
  btnPlay.innerHTML = SVG_PAUSE;
  audio.start();
  lastTimestamp = performance.now();
  loop();
}

function pause() {
  if (!isPlaying) return;
  isPlaying = false;
  bigPlayBtn.classList.remove("hidden");
  btnPlay.innerHTML = SVG_PLAY;
  audio.stop();
  if (animationReqId) cancelAnimationFrame(animationReqId);
}

function loop(timestamp = performance.now()) {
  if (!isPlaying) return;

  currentFrame++;
  if (currentFrame >= TOTAL_FRAMES) {
    currentFrame = 0;
    pause();
    renderFrame(0);
    updateUI();
    return;
  }

  if ([420, 900, 1500, 1980, 2400].includes(currentFrame)) {
    audio.playWhoosh();
  }

  renderFrame(currentFrame);
  updateUI();
  animationReqId = requestAnimationFrame(loop);
}

function jumpToFrame(f) {
  currentFrame = Math.max(0, Math.min(f, TOTAL_FRAMES - 1));
  renderFrame(currentFrame);
  updateUI();
  audio.playWhoosh();
}

// Event Listeners
canvas.style.cursor = "pointer";
canvas.addEventListener("click", () => isPlaying ? pause() : play());
bigPlayBtn.addEventListener("click", play);
btnPlay.addEventListener("click", () => isPlaying ? pause() : play());
btnRestart.addEventListener("click", () => {
  pause();
  jumpToFrame(0);
  play();
});

scrubber.addEventListener("input", (e) => {
  pause();
  jumpToFrame(parseInt(e.target.value));
});

// Fullscreen
btnFullscreen.addEventListener("click", () => {
  const container = document.getElementById("video-container");
  if (!document.fullscreenElement) {
    container.requestFullscreen().catch(err => console.log(err));
  } else {
    document.exitFullscreen();
  }
});

// Mute Toggle
btnAudioToggle.addEventListener("click", () => {
  const isMuted = audio.toggleMute();
  const currentIcon = document.getElementById("audio-icon");
  if (currentIcon) {
    currentIcon.outerHTML = isMuted ? SVG_AUDIO_OFF : SVG_AUDIO_ON;
  }
});

// Keyboard Shortcuts: Space, Arrows, F, M, Home
window.addEventListener("keydown", (e) => {
  if (document.activeElement && ["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
    return;
  }
  if (e.code === "Space") {
    e.preventDefault();
    isPlaying ? pause() : play();
  } else if (e.code === "ArrowLeft") {
    e.preventDefault();
    jumpToFrame(currentFrame - 5 * FPS);
  } else if (e.code === "ArrowRight") {
    e.preventDefault();
    jumpToFrame(currentFrame + 5 * FPS);
  } else if (e.code === "KeyF") {
    e.preventDefault();
    const container = document.getElementById("video-container");
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(err => console.log(err));
    } else {
      document.exitFullscreen();
    }
  } else if (e.code === "KeyM") {
    e.preventDefault();
    const isMuted = audio.toggleMute();
    const currentIcon = document.getElementById("audio-icon");
    if (currentIcon) {
      currentIcon.outerHTML = isMuted ? SVG_AUDIO_OFF : SVG_AUDIO_ON;
    }
  } else if (e.code === "Home") {
    e.preventDefault();
    pause();
    jumpToFrame(0);
  }
});

// ==========================================
// 6. MP4 EXPORT ENGINE (WEBCODECS / MEDIARECORDER)
// ==========================================
btnExport.addEventListener("click", async () => {
  pause();
  exportOverlay.classList.remove("hidden");
  exportProgressBar.style.width = "0%";
  exportProgressText.textContent = "Khởi tạo công cụ xuất video 1080p 60fps...";

  try {
    const stream = canvas.captureStream(60);

    if (audio.destNode) {
      const audioTracks = audio.destNode.stream.getAudioTracks();
      if (audioTracks.length > 0) {
        stream.addTrack(audioTracks[0]);
      }
    }

    const mimeType = MediaRecorder.isTypeSupported("video/mp4;codecs=avc1") ? "video/mp4;codecs=avc1" :
                     MediaRecorder.isTypeSupported("video/mp4") ? "video/mp4" :
                     MediaRecorder.isTypeSupported("video/webm;codecs=vp9") ? "video/webm;codecs=vp9" :
                     "video/webm";

    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: mimeType,
      videoBitsPerSecond: 10_000_000,
    });

    const recordedChunks = [];
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) recordedChunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const extension = mimeType.includes("mp4") ? "mp4" : "webm";
      const blob = new Blob(recordedChunks, { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ULIS_VIBE_Gioi_Thieu_De_An.${extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      exportOverlay.classList.add("hidden");
      audio.stop();
      jumpToFrame(0);
      alert("Đã kết xuất và tải thành công video 1080p 60fps chuẩn Gradient Minimalism!");
    };

    mediaRecorder.start();
    audio.start();

    let exportFrame = 0;
    const exportInterval = setInterval(() => {
      renderFrame(exportFrame);
      exportFrame++;
      const percent = Math.floor((exportFrame / TOTAL_FRAMES) * 100);
      exportProgressBar.style.width = `${percent}%`;
      exportProgressText.textContent = `${percent}% (${exportFrame} / ${TOTAL_FRAMES} frames)`;

      if (exportFrame >= TOTAL_FRAMES) {
        clearInterval(exportInterval);
        mediaRecorder.stop();
      }
    }, 1000 / 60);

  } catch (err) {
    console.error("Export error:", err);
    alert("Trình duyệt không hỗ trợ MediaRecorder trực tiếp.");
    exportOverlay.classList.add("hidden");
  }
});

// Initial Render
renderFrame(0);
updateUI();
