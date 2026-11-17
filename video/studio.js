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

// ==========================================
// 3. SILKY GRADIENT MESH BACKDROP (Full Screen Luminous Ambiance)
// ==========================================
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
// 4. SCENE ORCHESTRATION WITH FLUID STAGGERED MOTION
// ==========================================
function renderFrame(frame) {
  ctx.clearRect(0, 0, 1920, 1080);
  drawGradientMesh(frame);

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
}

// ------------------------------------------
// SCENE 1: Academic Editorial Intro (0:00 - 0:07)
// Bold, Commanding, Balanced Layout
// ------------------------------------------
function renderScene01(f) {
  const p = Math.min(f / 45, 1.0);
  const exitOpacity = f > 390 ? (420 - f) / 30 : 1.0;
  const opacity = Math.min(f / 20, 1.0) * exitOpacity;

  ctx.save();
  ctx.globalAlpha = opacity;

  const leftX = 160;

  // Top Category Pill Tag (Y = 220)
  const pillProgress = Math.min(f / 30, 1.0);
  ctx.save();
  ctx.fillStyle = "rgba(239, 246, 255, 0.9)";
  ctx.strokeStyle = "rgba(191, 219, 254, 0.8)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(leftX, 200, 920, 48, 24);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#002B7F";
  ctx.font = "bold 20px 'Be Vietnam Pro'";
  ctx.letterSpacing = "2px";
  ctx.fillText("TRƯỜNG ĐẠI HỌC NGOẠI NGỮ – ĐHQGHN  •  BỘ MÔN CNTT & TRUYỀN THÔNG", leftX + 28, 231);
  ctx.restore();

  // Grand Display Title: ULIS VIBE (Y = 410) - Solid High-Contrast Dark Blue (No AI Gradient Mask)
  const titleOffset = (1 - easeOutCubic(p)) * 30;
  ctx.fillStyle = "#002B7F";
  ctx.font = "900 126px 'Be Vietnam Pro'";
  ctx.letterSpacing = "-2px";
  ctx.fillText("ULIS VIBE", leftX, 390 + titleOffset);

  // Thesis Subtitle (Y = 480)
  ctx.fillStyle = "#1E293B";
  ctx.font = "600 36px 'Be Vietnam Pro'";
  ctx.fillText("Cổng sự kiện, câu lạc bộ & chuẩn hóa chứng nhận ngoại khóa.", leftX, 470 + titleOffset * 0.7);

  // Description Paragraph (Y = 540)
  ctx.fillStyle = "#475569";
  ctx.font = "400 24px 'Be Vietnam Pro'";
  ctx.fillText("Nền tảng số hóa tập trung giải quyết triệt để vấn đề phân tán thông tin,", leftX, 540 + titleOffset * 0.5);
  ctx.fillText("đồng bộ hóa lịch tuyển quân và khung minh chứng Cert A1 - A2 - A3.", leftX, 576 + titleOffset * 0.5);

  // Academic Badges Row (Y = 660)
  ctx.save();
  // Badge 1: Course Info
  ctx.fillStyle = "#FFFFFF";
  ctx.strokeStyle = "rgba(226, 232, 240, 0.9)";
  ctx.lineWidth = 1.5;
  ctx.shadowColor = "rgba(10, 37, 64, 0.05)";
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 6;
  ctx.beginPath();
  ctx.roundRect(leftX, 650, 480, 56, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#0A2540";
  ctx.font = "bold 20px 'Be Vietnam Pro'";
  ctx.fillText("Đề án Giữa kỳ • Học phần FLF1007", leftX + 30, 685);

  // Badge 2: Team 109
  ctx.beginPath();
  ctx.roundRect(leftX + 510, 650, 380, 56, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#D97706";
  ctx.font = "bold 20px 'Be Vietnam Pro'";
  ctx.fillText("Nhóm thực hiện: Nhóm 109", leftX + 540, 685);
  ctx.restore();

  // Right Side: Grand University Logo Artwork (Y = 460) - Pure Logo Without Background Disc
  ctx.save();
  const sealX = 1480;
  const sealY = 460;
  const floatY = Math.sin(f * 0.04) * 8;

  ctx.translate(sealX, sealY + floatY);
  ctx.scale(spring(p), spring(p));

  if (assets.logo.complete) {
    ctx.shadowColor = "rgba(10, 37, 64, 0.14)";
    ctx.shadowBlur = 45;
    ctx.shadowOffsetY = 16;
    const logoSize = 250;
    ctx.drawImage(assets.logo, -logoSize / 2, -logoSize / 2, logoSize, logoSize);
  }
  ctx.restore();

  ctx.restore();
}

// ------------------------------------------
// SCENE 2: Khảo sát thực tế 105 sinh viên (0:07 - 0:15)
// Balanced, High-Contrast 2-Card Layout (Zero Overlap!)
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

  // ----------------------------------------------------
  // CARD 1 (LEFT): Hero 71.5% - Full Height (Y = 270 to 860)
  // Dimensions: 760px width x 590px height
  // ----------------------------------------------------
  const card1X = leftX;
  const card1Y = 270;
  const card1W = 760;
  const card1H = 590;

  ctx.save();
  ctx.fillStyle = "#FFFFFF";
  ctx.shadowColor = "rgba(10, 37, 64, 0.08)";
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 14;
  ctx.beginPath();
  ctx.roundRect(card1X, card1Y, card1W, card1H, 28);
  ctx.fill();

  ctx.shadowColor = "transparent";
  ctx.strokeStyle = "rgba(226, 232, 240, 0.85)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Left Color Accent Bar
  ctx.fillStyle = "#EF4444";
  ctx.beginPath();
  ctx.roundRect(card1X, card1Y, 8, card1H, [28, 0, 0, 28]);
  ctx.fill();

  // Internal Card Content
  const c1TextX = card1X + 50;

  // Tag
  ctx.fillStyle = "rgba(254, 242, 242, 1)";
  ctx.beginPath();
  ctx.roundRect(c1TextX, card1Y + 45, 220, 36, 18);
  ctx.fill();
  ctx.fillStyle = "#DC2626";
  ctx.font = "bold 15px 'Be Vietnam Pro'";
  ctx.fillText("TỶ LỆ BÁO ĐỘNG", c1TextX + 42, card1Y + 68);

  // Huge Stat Number
  const heroVal = (71.5 * heroProgress).toFixed(1);
  const heroGrad = ctx.createLinearGradient(c1TextX, card1Y + 120, c1TextX + 320, card1Y + 240);
  heroGrad.addColorStop(0, "#002B7F");
  heroGrad.addColorStop(1, "#EF4444");
  ctx.fillStyle = heroGrad;
  ctx.font = "900 120px 'Be Vietnam Pro'";
  ctx.letterSpacing = "-3px";
  ctx.fillText(`${heroVal}%`, c1TextX, card1Y + 210);

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
  ctx.restore();

  // ----------------------------------------------------
  // CARD 2 (RIGHT): 82.9% & 91.4% - Full Height (Y = 270 to 860)
  // Dimensions: 800px width x 590px height
  // ----------------------------------------------------
  const card2X = card1X + card1W + 40;
  const card2Y = 270;
  const card2W = 800;
  const card2H = 590;

  ctx.save();
  ctx.fillStyle = "#FFFFFF";
  ctx.shadowColor = "rgba(10, 37, 64, 0.08)";
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 14;
  ctx.beginPath();
  ctx.roundRect(card2X, card2Y, card2W, card2H, 28);
  ctx.fill();

  ctx.shadowColor = "transparent";
  ctx.strokeStyle = "rgba(226, 232, 240, 0.85)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  const c2TextX = card2X + 50;
  const pBarW = card2W - 100;

  // BLOCK 1: 82.9% (Y = card2Y + 45 to +260)
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

  // Progress Bar 1 (Distinct Y offset = card2Y + 215, height 10px)
  ctx.fillStyle = "rgba(241, 245, 249, 1)";
  ctx.beginPath();
  ctx.roundRect(c2TextX, card2Y + 215, pBarW, 10, 5);
  ctx.fill();

  const pGrad1 = ctx.createLinearGradient(c2TextX, 0, c2TextX + pBarW, 0);
  pGrad1.addColorStop(0, "#002B7F");
  pGrad1.addColorStop(1, "#D97706");
  ctx.fillStyle = pGrad1;
  ctx.beginPath();
  ctx.roundRect(c2TextX, card2Y + 215, pBarW * (82.9 / 100) * heroProgress, 10, 5);
  ctx.fill();

  // Subtle Horizontal Divider (Y = card2Y + 285)
  ctx.strokeStyle = "rgba(226, 232, 240, 0.7)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(c2TextX, card2Y + 285);
  ctx.lineTo(c2TextX + pBarW, card2Y + 285);
  ctx.stroke();

  // BLOCK 2: 91.4% (Y = card2Y + 340 to +540)
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

  // Progress Bar 2 (Distinct Y offset = card2Y + 495, height 10px)
  ctx.fillStyle = "rgba(241, 245, 249, 1)";
  ctx.beginPath();
  ctx.roundRect(c2TextX, card2Y + 495, pBarW, 10, 5);
  ctx.fill();

  const pGrad2 = ctx.createLinearGradient(c2TextX, 0, c2TextX + pBarW, 0);
  pGrad2.addColorStop(0, "#002B7F");
  pGrad2.addColorStop(1, "#059669");
  ctx.fillStyle = pGrad2;
  ctx.beginPath();
  ctx.roundRect(c2TextX, card2Y + 495, pBarW * (91.4 / 100) * heroProgress, 10, 5);
  ctx.fill();

  ctx.restore();

  ctx.restore();
}

// ------------------------------------------
// SCENE 3: Event Hub & QR Check-in (0:15 - 0:25)
// Spacious 3-Spec Cards + Hero Card with ZERO Overlap
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

  // LEFT COLUMN: 3 Distinct Feature Cards (Y = 270 to 860)
  // Dimensions: 680px width, 180px height each, 25px gap
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

    ctx.fillStyle = "#FFFFFF";
    ctx.shadowColor = "rgba(10, 37, 64, 0.06)";
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 10;
    ctx.beginPath();
    ctx.roundRect(0, 0, 680, 180, 24);
    ctx.fill();

    ctx.shadowColor = "transparent";
    ctx.strokeStyle = "rgba(226, 232, 240, 0.85)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Number Badge
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

  // RIGHT COLUMN: Hero Event Poster Card (Y = 270 to 860)
  // Dimensions: 880px width x 590px height
  const heroCardX = leftX + 680 + 40;
  const heroCardY = 270;
  const heroCardW = 880;
  const heroCardH = 590;

  ctx.save();
  ctx.fillStyle = "#FFFFFF";
  ctx.shadowColor = "rgba(10, 37, 64, 0.12)";
  ctx.shadowBlur = 45;
  ctx.shadowOffsetY = 16;
  ctx.beginPath();
  ctx.roundRect(heroCardX, heroCardY, heroCardW, heroCardH, 28);
  ctx.fill();

  ctx.shadowColor = "transparent";
  ctx.strokeStyle = "rgba(226, 232, 240, 0.9)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

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

  // Realtime Seat Progress Bar (Height 8px, Width 580px)
  const sBarW = 580;
  ctx.fillStyle = "rgba(241, 245, 249, 1)";
  ctx.beginPath();
  ctx.roundRect(cX, cY + 75, sBarW, 8, 4);
  ctx.fill();

  ctx.fillStyle = "#002B7F";
  ctx.beginPath();
  ctx.roundRect(cX, cY + 75, sBarW * 0.55 * easeOutCubic(p), 8, 4);
  ctx.fill();

  ctx.fillStyle = "#64748B";
  ctx.font = "500 17px 'Be Vietnam Pro'";
  ctx.fillText("Còn 45/100 suất đăng ký chính thức", cX, cY + 115);

  // Clean QR Verification Chip (Completely separated on right, 120x120px)
  const qrX = heroCardX + heroCardW - 170;
  const qrY = heroCardY + 400;

  ctx.fillStyle = "#F8FAFC";
  ctx.strokeStyle = "rgba(2, 132, 199, 0.4)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(qrX, qrY, 130, 130, 20);
  ctx.fill();
  ctx.stroke();

  // Green Pulsing Sonar Ring
  const pulseRadius = 38 + ((f * 1.5) % 25);
  const pulseAlpha = Math.max(0, 1 - (pulseRadius - 38) / 25);
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

  ctx.restore();
}

// ------------------------------------------
// SCENE 4: Club Directory (0:25 - 0:33)
// Balanced Bento: 30+ Hero Card + 3 Spacious Rows
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

  // LEFT COLUMN: Bento Hero Card 30+ (Y = 270 to 860)
  // Dimensions: 560px width x 590px height
  const heroProgress = easeOutCubic(p);
  const leftW = 560;
  const leftH = 590;

  ctx.save();
  ctx.fillStyle = "#FFFFFF";
  ctx.shadowColor = "rgba(10, 37, 64, 0.08)";
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 14;
  ctx.beginPath();
  ctx.roundRect(leftX, 270, leftW, leftH, 28);
  ctx.fill();

  ctx.shadowColor = "transparent";
  ctx.strokeStyle = "rgba(226, 232, 240, 0.85)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  const cX = leftX + 50;

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
  ctx.restore();

  // RIGHT COLUMN: 3 Spacious Identity Rows (Y = 270 to 860)
  // Dimensions: 1000px width, 180px height each, 25px gap
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

    ctx.fillStyle = "#FFFFFF";
    ctx.shadowColor = "rgba(10, 37, 64, 0.06)";
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 10;
    ctx.beginPath();
    ctx.roundRect(0, 0, 1000, 180, 24);
    ctx.fill();

    ctx.shadowColor = "transparent";
    ctx.strokeStyle = "rgba(226, 232, 240, 0.85)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Left Color Accent Bar
    ctx.fillStyle = r.color;
    ctx.beginPath();
    ctx.roundRect(0, 0, 8, 180, [24, 0, 0, 24]);
    ctx.fill();

    // Title
    ctx.fillStyle = "#0A2540";
    ctx.font = "bold 26px 'Be Vietnam Pro'";
    ctx.fillText(r.title, 45, 60);

    // Description
    ctx.fillStyle = "#475569";
    ctx.font = "400 20px 'Be Vietnam Pro'";
    ctx.fillText(r.desc, 45, 115);

    // Pill Badge
    ctx.fillStyle = "#F1F5F9";
    ctx.strokeStyle = "rgba(226, 232, 240, 0.9)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(830, 40, 130, 44, 22);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#002B7F";
    ctx.font = "bold 16px 'Be Vietnam Pro'";
    ctx.textAlign = "center";
    ctx.fillText(r.badge, 895, 68);

    ctx.restore();
  });

  ctx.restore();
}

// ------------------------------------------
// SCENE 5: Cert Hub — Clear Tiered Spectrum (0:33 - 0:40)
// Spacious 3 Tier Cards with ZERO Overlap
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

  // 3 Stately Horizontal Tier Cards (Y = 270 to 860)
  // Dimensions: 1600px width x 180px height each, 25px gap
  const tiers = [
    {
      code: "CERT A1",
      label: "Học Thuật & Nghiên Cứu Khoa Học",
      examples: "Hội thảo nghiên cứu khoa học các cấp, tọa đàm học thuật ngoại ngữ, báo cáo chuyên đề khoa học.",
      points: "+5 đến +10 ĐRL",
      color: "#002B7F"
    },
    {
      code: "CERT A2",
      label: "Kỹ Năng & Hoạt Động Đoàn - Hội",
      examples: "Ban tổ chức sự kiện, tuyển quân CLB, tập huấn kỹ năng mềm, hội thao sinh viên, lễ tân khánh tiết.",
      points: "+3 đến +8 ĐRL",
      color: "#0284C7"
    },
    {
      code: "CERT A3",
      label: "Tình Nguyện & Hoạt Động Vì Cộng Đồng",
      examples: "Hiến máu nhân đạo toàn trường, chiến dịch Mùa hè xanh, Tiếp sức mùa thi, công tác thiện nguyện xã hội.",
      points: "+5 đến +15 ĐRL",
      color: "#10B981"
    }
  ];

  tiers.forEach((t, idx) => {
    const cardY = 270 + idx * 205;
    const cardProgress = Math.min(Math.max((f - idx * 10) / 35, 0), 1.0);
    const cardOffset = (1 - easeOutCubic(cardProgress)) * 40;

    ctx.save();
    ctx.translate(leftX + cardOffset, cardY);

    // White Card
    ctx.fillStyle = "#FFFFFF";
    ctx.shadowColor = "rgba(10, 37, 64, 0.07)";
    ctx.shadowBlur = 35;
    ctx.shadowOffsetY = 12;
    ctx.beginPath();
    ctx.roundRect(0, 0, 1600, 180, 24);
    ctx.fill();

    ctx.shadowColor = "transparent";
    ctx.strokeStyle = "rgba(226, 232, 240, 0.85)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Code Pill Badge (Left)
    ctx.fillStyle = t.color;
    ctx.beginPath();
    ctx.roundRect(40, 45, 140, 52, 16);
    ctx.fill();

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

    // Points Tag (Right)
    ctx.fillStyle = "#F8FAFC";
    ctx.strokeStyle = "rgba(226, 232, 240, 0.9)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(1360, 60, 200, 56, 28);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = t.color;
    ctx.font = "bold 20px 'Be Vietnam Pro'";
    ctx.textAlign = "center";
    ctx.fillText(t.points, 1460, 96);

    ctx.restore();
  });

  ctx.restore();
}

// ------------------------------------------
// SCENE 6: Outro — Decisive Academic Conclusion (0:40 - 0:45)
// Commandingly Proportioned Keynote Finale
// ------------------------------------------
function renderScene06(f) {
  const p = Math.min(f / 45, 1.0);
  ctx.save();
  ctx.globalAlpha = Math.min(f / 20, 1.0);
  ctx.textAlign = "center";

  const centerX = 960;

  // University Crest Logo (Y = 190) - Pure Logo Without Background Disc
  ctx.save();
  ctx.translate(centerX, 190);
  ctx.scale(spring(p), spring(p));

  if (assets.logo.complete) {
    ctx.shadowColor = "rgba(10, 37, 64, 0.14)";
    ctx.shadowBlur = 35;
    ctx.shadowOffsetY = 12;
    const logoSize = 140;
    ctx.drawImage(assets.logo, -logoSize / 2, -logoSize / 2, logoSize, logoSize);
  }
  ctx.restore();

  // Grand Title (Y = 360)
  const titleY = 360 - (1 - easeOutCubic(p)) * 20;
  // Grand Title: ULIS VIBE (Solid High Contrast Dark Blue)
  ctx.fillStyle = "#002B7F";
  ctx.font = "900 114px 'Be Vietnam Pro'";
  ctx.letterSpacing = "-2px";
  ctx.fillText("ULIS VIBE", centerX, titleY);

  // Slogan (Y = 430)
  ctx.fillStyle = "#002B7F";
  ctx.font = "bold 36px 'Be Vietnam Pro'";
  ctx.fillText("MỘT ĐIỂM CHẠM — VẠN CƠ HỘI NGOẠI KHÓA", centerX, titleY + 68);

  // Academic Presentation Card (Y = 540)
  ctx.save();
  const cWidth = 1180;
  const cHeight = 175;
  ctx.fillStyle = "#FFFFFF";
  ctx.strokeStyle = "rgba(226, 232, 240, 0.9)";
  ctx.lineWidth = 1.5;
  ctx.shadowColor = "rgba(10, 37, 64, 0.08)";
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 14;
  ctx.beginPath();
  ctx.roundRect(centerX - cWidth / 2, 530, cWidth, cHeight, 24);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#0A2540";
  ctx.font = "bold 26px 'Be Vietnam Pro'";
  ctx.fillText("ĐỀ ÁN BÀI TẬP NHÓM GIỮA KỲ • HỌC PHẦN FLF1007", centerX, 580);

  ctx.fillStyle = "#475569";
  ctx.font = "500 22px 'Be Vietnam Pro'";
  ctx.fillText("Bộ môn Công nghệ Thông tin & Truyền thông — Trường ĐH Ngoại ngữ, ĐHQGHN", centerX, 622);

  ctx.fillStyle = "#64748B";
  ctx.font = "400 19px 'Be Vietnam Pro'";
  ctx.fillText("Nhóm 109: Đoàn Thị Phương Thảo (Trưởng nhóm) • Đạt • Uyên • Linh • Trang", centerX, 660);
  ctx.restore();

  // CTA Pill Button (Y = 780)
  ctx.save();
  ctx.translate(centerX, 780);
  ctx.fillStyle = "#002B7F";
  ctx.shadowColor = "rgba(0, 43, 127, 0.25)";
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 10;
  ctx.beginPath();
  ctx.roundRect(-280, -32, 560, 64, 32);
  ctx.fill();

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
