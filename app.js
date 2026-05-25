/**
 * ==========================================================================
 * BLEXX MULTI-HOUSE DIGITAL ENGINE & GIF GENERATOR
 * Technical Architecture: Triangle, Circle & Square Base Frameworks
 * Houses: Chance (Cyan), Manifestation (Amber), Devotion (Magenta)
 * ==========================================================================
 */

// --- Firebase Web SDK 10+ ES Module Imports from Google CDN ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getStorage, ref, uploadString, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCIeaclBLrp2XNE-o71zbl6u83SVf_FtS4",
  authDomain: "blexxing-gener8r.firebaseapp.com",
  projectId: "blexxing-gener8r",
  storageBucket: "blexxing-gener8r.firebasestorage.app",
  messagingSenderId: "281372301540",
  appId: "1:281372301540:web:1e212206d542bda2e834f1",
  measurementId: "G-NV6WKFMKPH"
};

// Initialize Firebase App & Services
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

// --- Utility Helpers ---
const delay = ms => new Promise(res => setTimeout(res, ms));

document.addEventListener('DOMContentLoaded', () => {
  
  // --- UI Elements ---
  const canvas = document.getElementById('entropy-canvas');
  const ctx = canvas.getContext('2d');
  
  const statusDot = document.getElementById('status-dot');
  const statusText = document.getElementById('status-text');
  const systemTime = document.getElementById('system-time');
  
  const btnFreeze = document.getElementById('freeze-btn');
  const btnRelease = document.getElementById('release-btn');
  const btnGif = document.getElementById('gif-btn');
  const btnExportBack = document.getElementById('export-back-btn');
  
  const cardInvitation = document.getElementById('invitation-card');
  const cardReceipt = document.getElementById('receipt-card');
  const cardProcessing = document.getElementById('processing-card');
  const cardExport = document.getElementById('export-card');
  
  const inviteQuote = document.getElementById('invite-quote');
  const inviteInstruction = document.getElementById('invite-instruction');
  const hudHouseTitle = document.getElementById('hud-house-title');
  
  const receiptSigilName = document.getElementById('receipt-sigil-name');
  const receiptSigilDesc = document.getElementById('receipt-sigil-desc');
  const receiptSigilDirective = document.getElementById('receipt-sigil-directive');
  const receiptSeed = document.getElementById('receipt-seed');
  const receiptEntropy = document.getElementById('receipt-entropy');
  const receiptTimestamp = document.getElementById('receipt-timestamp');
  const receiptHash = document.getElementById('receipt-hash');
  
  const loaderProgressBar = document.getElementById('loader-progress-bar');
  const loaderStatus = document.getElementById('loader-status');
  const loaderPercent = document.getElementById('loader-percent');
  
  const gifPreview = document.getElementById('gif-preview');
  const downloadGifLink = document.getElementById('download-gif-link');
  const emailGifLink = document.getElementById('email-gif-link');
  
  const btnPhysical = document.getElementById('physical-btn');
  const physicalModal = document.getElementById('physical-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const cancelShipmentBtn = document.getElementById('cancel-shipment-btn');
  const physicalForm = document.getElementById('physical-form');

  // --- Constants & Config ---
  const CANVAS_WIDTH = 500;
  const CANVAS_HEIGHT = 500;
  const CENTER_X = CANVAS_WIDTH / 2;
  const CENTER_Y = CANVAS_HEIGHT / 2;

  // --- Multi-House Architecture Profiles ---
  const HOUSE_CONFIG = {
    chance: {
      name: "CHANCE",
      title: "HOUSE OF CHANCE",
      themeClass: "house-chance",
      colorGlow: "#00f3ff",
      seedPrefix: "BX-CHNC",
      inviteQuote: `"The door is never where you left it. In the House of Chance, we do not build paths; we step into the wind."`,
      inviteInstruction: `Stop measuring the distance. Release your grip on the "how" and the "when." To capture your digital Blexxing, initiate the sealing ritual below.`,
      sigilData: [
        {
          id: "BNSH",
          name: "01 BANISH",
          desc: "Active extraction. Purging pre-calculated patterns to generate clear runway area for external chaos.",
          directive: "Pushing back historical stability mechanics to welcome high-variance events."
        },
        {
          id: "RSK",
          name: "02 RISK",
          desc: "The strategic wager. Executing real-world actions where the transaction cost itself serves as the psychological payout.",
          directive: "Moving past permission states; serving as the functional catalyst for localized tension generation."
        },
        {
          id: "SMN",
          name: "03 SUMMON",
          desc: "Unconditional integration. Complete physical and narrative ownership over whatever variant state collapses into the perimeter.",
          directive: "Accepting the feedback loop outcome without deploying filtering or structural egress mechanisms."
        }
      ]
    },
    manifestation: {
      name: "MANIFESTATION",
      title: "HOUSE OF MANIFESTATION",
      themeClass: "house-manifestation",
      colorGlow: "#ffb700",
      seedPrefix: "BX-MNFS",
      inviteQuote: `"We do not seek what is already there. In the House of Manifestation, we draw the circle to hold the dream until it breathes."`,
      inviteInstruction: `Define your reality. Command the canvas of raw visual energy to crystallize your thoughts. Initiate the sealing ritual below to manifest your sigil.`,
      sigilData: [
        {
          id: "VSN",
          name: "01 VISION",
          desc: "Active creation. Projecting and expanding raw future waves outward until they harmonize with material states.",
          directive: "Setting radial intention coordinates to align reality pathways."
        },
        {
          id: "FCS",
          name: "02 FOCUS",
          desc: "Dense spatial centering. Locking down multiple targeting vectors to collapse infinite variants onto a single absolute coordinate.",
          directive: "Eliminating surrounding wave noise to force reality crystallization."
        },
        {
          id: "ALN",
          name: "03 ALIGN",
          desc: "Harmonized integration. Grounding perfect vesica-piscis circular orbits to merge internal intention with external timeline feedback.",
          directive: "Attaining phase coherence across internal desire and external reaction systems."
        }
      ]
    },
    devotion: {
      name: "DEVOTION",
      title: "HOUSE OF DEVOTION",
      themeClass: "house-devotion",
      colorGlow: "#ff007f",
      seedPrefix: "BX-DVTN",
      inviteQuote: `"The anchor holds when the ground splits. In the House of Devotion, we lay the square foundation to stand against the storm."`,
      inviteInstruction: `Dedicate your energy. Lock down visual noise into rigid, unbreakable structural architecture. Initiate the sealing ritual below to anchor your devotions.`,
      sigilData: [
        {
          id: "ANC",
          name: "01 ANCHOR",
          desc: "High-integrity structural grounding. Establishing an unyielding framework to lock down core values against external disruption.",
          directive: "Reinforcing perimeter constraints to resist chaos and establish foundations."
        },
        {
          id: "SCF",
          name: "02 SACRIFICE",
          desc: "The systemic threshold. Slicing structural square segments along diagonal split axes to liberate energy for long-term expansion.",
          directive: "Incurring strategic transaction costs to release localized potential."
        },
        {
          id: "SNC",
          name: "03 SANCTUARY",
          desc: "Fortified spatial enclosure. Nested concentric barrier fortresses surrounding and securing high-value digital cores.",
          directive: "Constructing multi-layered perimeter shields to insulate inner integrity."
        }
      ]
    }
  };

  // --- State Variables ---
  let currentHouse = 'chance';
  let isCollapsed = false;
  let isCollapsing = false;
  let collapsedSigilIndex = 0; // 0, 1, 2
  let animationFrameId = null;
  let time = 0;
  let entropySpeed = 1;
  let seedCode = "";
  let fullFulfillmentCode = "";
  let fullSecureHash = "";

  // --- Geolocation State & Resolver ---
  let userLocation = "SECURE NODE";

  async function fetchUserLocation() {
    try {
      const res = await fetch('https://ipapi.co/json/');
      if (res.ok) {
        const data = await res.json();
        if (data.city && data.country_code) {
          const regionStr = data.region_code ? `, ${data.region_code}` : '';
          userLocation = `${data.city}${regionStr}, ${data.country_code}`.toUpperCase();
          console.log("Resolved Geolocation Node (IP):", userLocation);
          return;
        }
      }
    } catch (e) {
      console.warn("IP Geolocation failed, attempting native browser fallback...", e);
    }
    
    // Fallback: Try native browser Geolocation API
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            if (res.ok) {
              const data = await res.json();
              const city = data.address.city || data.address.town || data.address.village || 'Unknown City';
              const country = data.address.country_code ? data.address.country_code.toUpperCase() : 'Global';
              userLocation = `${city}, ${country}`.toUpperCase();
              console.log("Resolved Geolocation Node (OSM):", userLocation);
            }
          } catch (err) {
            console.error("OSM Reverse Geocoding failed:", err);
          }
        },
        () => {},
        { timeout: 3000 }
      );
    }
  }
  // Initialize background Geolocation fetch immediately
  fetchUserLocation();

  // Timing parameters for Entropy Engine Loop
  const LOOP_TIMINGS = {
    stateDuration: 220, // Milliseconds per core sigil
    glitchDuration: 70  // Milliseconds per glitch partition
  };

  // --- Real-time Clock ---
  function updateClock() {
    const now = new Date();
    const pad = (num) => String(num).padStart(2, '0');
    systemTime.textContent = `${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}:${pad(now.getUTCSeconds())} UTC`;
  }
  setInterval(updateClock, 1000);
  updateClock();

  // --- Cryptographic Helper ---
  function generateSeedAndHash(housePrefix, sigilId) {
    const chars = '0123456789ABCDEF';
    let seed = '';
    for (let i = 0; i < 6; i++) {
      seed += chars[Math.floor(Math.random() * 16)];
    }
    const fullCode = `${housePrefix}-${seed}-${sigilId}`;
    
    let hash = '';
    for (let i = 0; i < 32; i++) {
      hash += chars[Math.floor(Math.random() * 16)];
    }
    const displayHash = `${hash.substring(0, 8)}...${hash.substring(24, 32)}`;
    
    return { seed, fullCode, displayHash, hash };
  }

  // --- Dynamic Canvas Render Functions ---

  function clearCanvas(targetCtx) {
    targetCtx.fillStyle = '#050507';
    targetCtx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }

  function setGlow(targetCtx, color, blur = 15) {
    targetCtx.shadowColor = color;
    targetCtx.shadowBlur = blur;
  }

  function resetGlow(targetCtx) {
    targetCtx.shadowBlur = 0;
    targetCtx.shadowColor = 'transparent';
  }

  /**
   * HOUSE OF CHANCE: Triangle Base Draw Routines
   */
  function drawBanish(targetCtx, scale = 1, t = 0) {
    const cx = CENTER_X;
    const cy = CENTER_Y + 15;
    const R = 120 * scale;
    const sin60 = Math.sin(Math.PI / 3);
    const cos60 = Math.cos(Math.PI / 3);
    
    const x_bl = cx - R * sin60;
    const y_bl = cy + R * cos60;
    const x_br = cx + R * sin60;
    const y_br = cy + R * cos60;
    
    targetCtx.lineWidth = 3;
    targetCtx.lineCap = 'round';
    targetCtx.lineJoin = 'round';
    
    // Draw Grounded Base Line
    targetCtx.strokeStyle = '#ffffff';
    setGlow(targetCtx, 'rgba(255, 255, 255, 0.4)', 8);
    targetCtx.beginPath();
    targetCtx.moveTo(x_bl, y_bl);
    targetCtx.lineTo(x_br, y_br);
    targetCtx.stroke();
    resetGlow(targetCtx);
    
    // Draw Truncated Sides (Banish void)
    targetCtx.strokeStyle = '#ffffff';
    setGlow(targetCtx, 'rgba(255, 255, 255, 0.4)', 8);
    
    targetCtx.beginPath();
    targetCtx.moveTo(x_bl, y_bl);
    targetCtx.lineTo(x_bl + R * sin60 * 0.55, y_bl - R * cos60 * 0.55);
    targetCtx.stroke();
    
    targetCtx.beginPath();
    targetCtx.moveTo(x_br, y_br);
    targetCtx.lineTo(x_br - R * sin60 * 0.55, y_br - R * cos60 * 0.55);
    targetCtx.stroke();
    resetGlow(targetCtx);
    
    // Draw Floating Chevron Vertex (Upper Gateway)
    const top_y = cy - R;
    const offset = 22 * scale;
    
    targetCtx.strokeStyle = HOUSE_CONFIG.chance.colorGlow;
    setGlow(targetCtx, HOUSE_CONFIG.chance.colorGlow, 12);
    targetCtx.beginPath();
    targetCtx.moveTo(cx - 24 * scale, top_y + 12 * scale - offset);
    targetCtx.lineTo(cx, top_y - offset);
    targetCtx.lineTo(cx + 24 * scale, top_y + 12 * scale - offset);
    targetCtx.stroke();
    resetGlow(targetCtx);
    
    // Radiating Chaos Shards
    const numShards = 7;
    targetCtx.strokeStyle = HOUSE_CONFIG.chance.colorGlow;
    targetCtx.lineWidth = 2;
    for (let i = 0; i < numShards; i++) {
      const angle = (i * Math.PI * 2) / numShards + (t * 0.015);
      const expansion = (Math.sin(t * 0.08 + i) * 6) + 12;
      const r_start = (45 + expansion) * scale;
      const r_end = r_start + (14 * scale);
      
      const x1 = cx + Math.cos(angle) * r_start;
      const y1 = cy + Math.sin(angle) * r_start;
      const x2 = cx + Math.cos(angle) * r_end;
      const y2 = cy + Math.sin(angle) * r_end;
      
      setGlow(targetCtx, HOUSE_CONFIG.chance.colorGlow, 8);
      targetCtx.beginPath();
      targetCtx.moveTo(x1, y1);
      targetCtx.lineTo(x2, y2);
      targetCtx.stroke();
      resetGlow(targetCtx);
      if (i % 2 === 0) {
        targetCtx.fillStyle = '#ffffff';
        targetCtx.fillRect(x2 - 2, y2 - 2, 4, 4);
      }
    }
  }

  function drawRisk(targetCtx, scale = 1, t = 0) {
    const cx = CENTER_X;
    const cy = CENTER_Y;
    const H = 320 * scale;
    const W = 13 * scale;
    
    targetCtx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    targetCtx.lineWidth = 1;
    targetCtx.setLineDash([4, 8]);
    targetCtx.beginPath();
    targetCtx.moveTo(cx, cy - (H/2) - 25);
    targetCtx.lineTo(cx, cy + (H/2) + 25);
    targetCtx.stroke();
    targetCtx.setLineDash([]);
    
    const tickWidth = 28 * scale;
    const ticks = [-120, -60, 0, 60, 120];
    targetCtx.strokeStyle = 'rgba(0, 243, 255, 0.3)';
    targetCtx.fillStyle = 'rgba(143, 143, 158, 0.6)';
    targetCtx.font = `${8 * scale}px 'Share Tech Mono'`;
    targetCtx.textAlign = 'right';
    
    ticks.forEach((offset) => {
      const y_pos = cy + offset * scale;
      targetCtx.beginPath();
      targetCtx.moveTo(cx - tickWidth / 2, y_pos);
      targetCtx.lineTo(cx + tickWidth / 2, y_pos);
      targetCtx.stroke();
      const label = (( -offset / 120 )).toFixed(1);
      targetCtx.fillText(`${label}`, cx - (tickWidth / 2) - 6, y_pos + 3);
    });

    const tensionWiggle = isCollapsed ? 0 : Math.sin(t * 0.25) * 5;
    const finalCy = cy + tensionWiggle;

    targetCtx.lineWidth = 2.5;
    targetCtx.strokeStyle = '#ffffff';
    setGlow(targetCtx, 'rgba(255, 255, 255, 0.5)', 8);
    targetCtx.beginPath();
    targetCtx.moveTo(cx, finalCy - H/2);
    targetCtx.lineTo(cx + W, finalCy);
    targetCtx.lineTo(cx, finalCy + H/2);
    targetCtx.lineTo(cx - W, finalCy);
    targetCtx.closePath();
    targetCtx.stroke();
    resetGlow(targetCtx);
    
    targetCtx.fillStyle = HOUSE_CONFIG.chance.colorGlow;
    setGlow(targetCtx, HOUSE_CONFIG.chance.colorGlow, 15);
    targetCtx.beginPath();
    targetCtx.moveTo(cx, finalCy - H * 0.4);
    targetCtx.lineTo(cx + W * 0.4, finalCy);
    targetCtx.lineTo(cx, finalCy + H * 0.4);
    targetCtx.lineTo(cx - W * 0.4, finalCy);
    targetCtx.closePath();
    targetCtx.fill();
    resetGlow(targetCtx);
  }

  function drawSummon(targetCtx, scale = 1, t = 0) {
    const cx = CENTER_X;
    const cy = CENTER_Y + 15;
    const R = 120 * scale;
    const sin60 = Math.sin(Math.PI / 3);
    const cos60 = Math.cos(Math.PI / 3);
    const centroidY = cy + (R * cos60) / 2;

    const x1 = cx;
    const y1 = cy - R;
    const x2 = cx + R * sin60;
    const y2 = cy + R * cos60;
    const x3 = cx - R * sin60;
    const y3 = cy + R * cos60;

    targetCtx.lineWidth = 4;
    targetCtx.lineCap = 'round';
    targetCtx.lineJoin = 'round';
    
    targetCtx.strokeStyle = '#ffffff';
    setGlow(targetCtx, 'rgba(255, 255, 255, 0.4)', 8);
    targetCtx.beginPath();
    targetCtx.moveTo(x1, y1);
    targetCtx.lineTo(x2, y2);
    targetCtx.lineTo(x3, y3);
    targetCtx.closePath();
    targetCtx.stroke();
    resetGlow(targetCtx);

    targetCtx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    targetCtx.lineWidth = 1;
    targetCtx.beginPath();
    targetCtx.moveTo(cx - 70 * scale, centroidY);
    targetCtx.lineTo(cx + 70 * scale, centroidY);
    targetCtx.moveTo(cx, centroidY - 70 * scale);
    targetCtx.lineTo(cx, centroidY + 70 * scale);
    targetCtx.stroke();

    targetCtx.strokeStyle = 'rgba(0, 243, 255, 0.25)';
    targetCtx.setLineDash([3, 5]);
    targetCtx.beginPath();
    targetCtx.arc(cx, centroidY, 32 * scale, 0, Math.PI * 2);
    targetCtx.stroke();
    targetCtx.setLineDash([]);
    
    targetCtx.strokeStyle = 'rgba(0, 243, 255, 0.15)';
    targetCtx.beginPath();
    targetCtx.arc(cx, centroidY, 52 * scale, 0, Math.PI * 2);
    targetCtx.stroke();

    const seedPulse = isCollapsed ? 0 : Math.sin(t * 0.12) * 2;
    const seedRadius = (12 + seedPulse) * scale;
    
    targetCtx.fillStyle = '#ffffff';
    setGlow(targetCtx, HOUSE_CONFIG.chance.colorGlow, 20);
    targetCtx.beginPath();
    targetCtx.arc(cx, centroidY, seedRadius, 0, Math.PI * 2);
    targetCtx.fill();
    resetGlow(targetCtx);
  }

  /**
   * HOUSE OF MANIFESTATION: Circle Base Draw Routines
   */
  function drawVision(targetCtx, scale = 1, t = 0) {
    const cx = CENTER_X;
    const cy = CENTER_Y + 15;
    const R = 110 * scale;
    
    targetCtx.lineWidth = 2.5;
    
    // Horizontal Laser Axis
    targetCtx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    targetCtx.beginPath();
    targetCtx.moveTo(cx - R * 1.35, cy);
    targetCtx.lineTo(cx + R * 1.35, cy);
    targetCtx.stroke();
    
    // Concentric Solid Rings
    targetCtx.strokeStyle = '#ffffff';
    setGlow(targetCtx, 'rgba(255, 255, 255, 0.4)', 8);
    targetCtx.beginPath();
    targetCtx.arc(cx, cy, R * 0.72, 0, Math.PI * 2);
    targetCtx.stroke();
    
    targetCtx.beginPath();
    targetCtx.arc(cx, cy, R, 0, Math.PI * 2);
    targetCtx.stroke();
    resetGlow(targetCtx);

    // Expanding Amber Ripple Circle
    const rippleSpeed = 0.04;
    const maxRipple = R * 1.25;
    const rippleRadius = (R * 0.4) + ((t * 2.5) % (maxRipple - R * 0.4));
    const rippleOpacity = 1.0 - ((rippleRadius - R * 0.4) / (maxRipple - R * 0.4));
    
    targetCtx.strokeStyle = `rgba(255, 183, 0, ${rippleOpacity * 0.85})`;
    setGlow(targetCtx, HOUSE_CONFIG.manifestation.colorGlow, 15);
    targetCtx.lineWidth = 2;
    targetCtx.beginPath();
    targetCtx.arc(cx, cy, rippleRadius, 0, Math.PI * 2);
    targetCtx.stroke();
    resetGlow(targetCtx);
  }

  function drawFocus(targetCtx, scale = 1, t = 0) {
    const cx = CENTER_X;
    const cy = CENTER_Y + 15;
    const R = 110 * scale;
    
    targetCtx.lineWidth = 3;
    
    // Outer Target Rings
    targetCtx.strokeStyle = '#ffffff';
    setGlow(targetCtx, 'rgba(255,255,255,0.4)', 6);
    targetCtx.beginPath();
    targetCtx.arc(cx, cy, R * 1.1, 0, Math.PI * 2);
    targetCtx.stroke();
    
    targetCtx.lineWidth = 1.5;
    targetCtx.strokeStyle = HOUSE_CONFIG.manifestation.colorGlow;
    setGlow(targetCtx, HOUSE_CONFIG.manifestation.colorGlow, 10);
    targetCtx.beginPath();
    targetCtx.arc(cx, cy, R * 0.76, 0, Math.PI * 2);
    targetCtx.stroke();
    resetGlow(targetCtx);
    
    // Concentric Inward Crosshair ticks
    targetCtx.strokeStyle = '#ffffff';
    targetCtx.lineWidth = 2.5;
    const crosshairOffset = isCollapsed ? 0 : Math.sin(t * 0.18) * 8;
    const length = 20 * scale;
    
    // 4 crosshair needles pointing in
    const directions = [0, Math.PI/2, Math.PI, Math.PI*1.5];
    directions.forEach(dir => {
      const sx = cx + Math.cos(dir) * (R * 1.1 - crosshairOffset);
      const sy = cy + Math.sin(dir) * (R * 1.1 - crosshairOffset);
      const ex = cx + Math.cos(dir) * (R * 1.1 - length - crosshairOffset);
      const ey = cy + Math.sin(dir) * (R * 1.1 - length - crosshairOffset);
      
      targetCtx.beginPath();
      targetCtx.moveTo(sx, sy);
      targetCtx.lineTo(ex, ey);
      targetCtx.stroke();
    });
    
    // Target seed core
    targetCtx.fillStyle = '#ffffff';
    setGlow(targetCtx, HOUSE_CONFIG.manifestation.colorGlow, 20);
    targetCtx.beginPath();
    targetCtx.arc(cx, cy, 6 * scale, 0, Math.PI * 2);
    targetCtx.fill();
    resetGlow(targetCtx);
  }

  function drawAlign(targetCtx, scale = 1, t = 0) {
    const cx = CENTER_X;
    const cy = CENTER_Y + 15;
    const R = 110 * scale;
    
    const overlapShift = 28 * scale;
    const circleRadius = R * 0.72;
    
    targetCtx.lineWidth = 3;
    
    // Left Align Circle
    targetCtx.strokeStyle = '#ffffff';
    setGlow(targetCtx, 'rgba(255,255,255,0.4)', 6);
    targetCtx.beginPath();
    targetCtx.arc(cx - overlapShift, cy, circleRadius, 0, Math.PI * 2);
    targetCtx.stroke();
    
    // Right Align Circle
    targetCtx.beginPath();
    targetCtx.arc(cx + overlapShift, cy, circleRadius, 0, Math.PI * 2);
    targetCtx.stroke();
    resetGlow(targetCtx);
    
    // Radar Align line
    targetCtx.strokeStyle = 'rgba(255, 183, 0, 0.15)';
    targetCtx.lineWidth = 1;
    targetCtx.beginPath();
    targetCtx.moveTo(cx, cy - R);
    targetCtx.lineTo(cx, cy + R);
    targetCtx.stroke();
    
    // Alignment Seed locked in the vesica-piscis center
    const pulse = isCollapsed ? 0 : Math.sin(t * 0.1) * 3;
    targetCtx.fillStyle = '#ffffff';
    setGlow(targetCtx, HOUSE_CONFIG.manifestation.colorGlow, 22);
    targetCtx.beginPath();
    targetCtx.arc(cx, cy, (12 + pulse) * scale, 0, Math.PI * 2);
    targetCtx.fill();
    resetGlow(targetCtx);
  }

  /**
   * HOUSE OF DEVOTION: Square Base Draw Routines
   */
  function drawRotatingSquare(targetCtx, cx, cy, w, h, angle) {
    targetCtx.save();
    targetCtx.translate(cx, cy);
    targetCtx.rotate(angle);
    targetCtx.beginPath();
    targetCtx.rect(-w / 2, -h / 2, w, h);
    targetCtx.stroke();
    targetCtx.restore();
  }

  function drawAnchor(targetCtx, scale = 1, t = 0) {
    const cx = CENTER_X;
    const cy = CENTER_Y + 15;
    const S = 190 * scale; // Square size
    
    targetCtx.lineWidth = 3;
    targetCtx.strokeStyle = '#ffffff';
    targetCtx.lineJoin = 'miter';
    
    // Main Square Frame
    setGlow(targetCtx, 'rgba(255,255,255,0.4)', 6);
    targetCtx.beginPath();
    targetCtx.rect(cx - S/2, cy - S/2, S, S);
    targetCtx.stroke();
    resetGlow(targetCtx);
    
    // Reinforced Corner L-Brackets
    targetCtx.strokeStyle = HOUSE_CONFIG.devotion.colorGlow;
    setGlow(targetCtx, HOUSE_CONFIG.devotion.colorGlow, 10);
    targetCtx.lineWidth = 4;
    const bracketSize = 24 * scale;
    
    // Top-Left L
    targetCtx.beginPath();
    targetCtx.moveTo(cx - S/2 + bracketSize, cy - S/2);
    targetCtx.lineTo(cx - S/2, cy - S/2);
    targetCtx.lineTo(cx - S/2, cy - S/2 + bracketSize);
    targetCtx.stroke();
    
    // Top-Right L
    targetCtx.beginPath();
    targetCtx.moveTo(cx + S/2 - bracketSize, cy - S/2);
    targetCtx.lineTo(cx + S/2, cy - S/2);
    targetCtx.lineTo(cx + S/2, cy - S/2 + bracketSize);
    targetCtx.stroke();
    
    // Bottom-Left L
    targetCtx.beginPath();
    targetCtx.moveTo(cx - S/2 + bracketSize, cy + S/2);
    targetCtx.lineTo(cx - S/2, cy + S/2);
    targetCtx.lineTo(cx - S/2, cy + S/2 - bracketSize);
    targetCtx.stroke();
    
    // Bottom-Right L
    targetCtx.beginPath();
    targetCtx.moveTo(cx + S/2 - bracketSize, cy + S/2);
    targetCtx.lineTo(cx + S/2, cy + S/2);
    targetCtx.lineTo(cx + S/2, cy + S/2 - bracketSize);
    targetCtx.stroke();
    resetGlow(targetCtx);
    
    // Central Anchor Stabilizing shaft
    targetCtx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    targetCtx.lineWidth = 1;
    targetCtx.beginPath();
    targetCtx.moveTo(cx, cy - S/2 - 15);
    targetCtx.lineTo(cx, cy + S/2 + 15);
    targetCtx.stroke();
    
    // Core Locking Bolt
    targetCtx.fillStyle = '#ffffff';
    setGlow(targetCtx, HOUSE_CONFIG.devotion.colorGlow, 15);
    targetCtx.fillRect(cx - 8 * scale, cy - 8 * scale, 16 * scale, 16 * scale);
    resetGlow(targetCtx);
  }

  function drawSacrifice(targetCtx, scale = 1, t = 0) {
    const cx = CENTER_X;
    const cy = CENTER_Y + 15;
    const S = 195 * scale;
    
    targetCtx.lineWidth = 2.5;
    
    // Crossing diagonal tension axes
    targetCtx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    targetCtx.beginPath();
    targetCtx.moveTo(cx - S/2 - 10, cy - S/2 - 10);
    targetCtx.lineTo(cx + S/2 + 10, cy + S/2 + 10);
    targetCtx.moveTo(cx + S/2 + 10, cy - S/2 - 10);
    targetCtx.lineTo(cx - S/2 - 10, cy + S/2 + 10);
    targetCtx.stroke();
    
    // Layered displaced squares to show "shear/sacrifice"
    const offsetShear = isCollapsed ? 0 : Math.sin(t * 0.15) * 5;
    
    targetCtx.strokeStyle = '#ffffff';
    setGlow(targetCtx, 'rgba(255,255,255,0.4)', 6);
    targetCtx.beginPath();
    targetCtx.rect(cx - S/2 + offsetShear, cy - S/2 - offsetShear, S, S);
    targetCtx.stroke();
    
    targetCtx.strokeStyle = HOUSE_CONFIG.devotion.colorGlow;
    setGlow(targetCtx, HOUSE_CONFIG.devotion.colorGlow, 12);
    targetCtx.beginPath();
    targetCtx.rect(cx - (S * 0.65)/2 - offsetShear, cy - (S * 0.65)/2 + offsetShear, S * 0.65, S * 0.65);
    targetCtx.stroke();
    resetGlow(targetCtx);
  }

  function drawSanctuary(targetCtx, scale = 1, t = 0) {
    const cx = CENTER_X;
    const cy = CENTER_Y + 15;
    const S = 200 * scale;
    
    targetCtx.lineWidth = 2.5;
    targetCtx.strokeStyle = '#ffffff';
    
    // Concentric nesting fortress squares
    setGlow(targetCtx, 'rgba(255,255,255,0.4)', 6);
    targetCtx.beginPath();
    targetCtx.rect(cx - S/2, cy - S/2, S, S);
    targetCtx.stroke();
    
    targetCtx.beginPath();
    targetCtx.rect(cx - (S * 0.7)/2, cy - (S * 0.7)/2, S * 0.7, S * 0.7);
    targetCtx.stroke();
    resetGlow(targetCtx);
    
    targetCtx.strokeStyle = HOUSE_CONFIG.devotion.colorGlow;
    setGlow(targetCtx, HOUSE_CONFIG.devotion.colorGlow, 10);
    targetCtx.beginPath();
    targetCtx.rect(cx - (S * 0.42)/2, cy - (S * 0.42)/2, S * 0.42, S * 0.42);
    targetCtx.stroke();
    resetGlow(targetCtx);
    
    // Secured core inside sanctuary
    const pulse = isCollapsed ? 0 : Math.sin(t * 0.08) * 2;
    targetCtx.fillStyle = '#ffffff';
    setGlow(targetCtx, HOUSE_CONFIG.devotion.colorGlow, 20);
    targetCtx.fillRect(cx - (9 + pulse) * scale, cy - (9 + pulse) * scale, (18 + pulse * 2) * scale, (18 + pulse * 2) * scale);
    resetGlow(targetCtx);
  }

  /**
   * Intermediate Variations Drawing Router
   */
  function drawEntropyVariation(targetCtx, variantIndex, scale = 1, t = 0) {
    const cx = CENTER_X;
    const cy = CENTER_Y + 15;
    const R = 120 * scale;
    const sin60 = Math.sin(Math.PI / 3);
    const cos60 = Math.cos(Math.PI / 3);
    
    targetCtx.lineWidth = 2.5;
    targetCtx.lineCap = 'round';
    targetCtx.lineJoin = 'round';
    
    // --- TRIANGLE Variations (CHANCE) ---
    if (currentHouse === 'chance') {
      if (variantIndex === 0) {
        // Nested Orbit (Double Concentric Triangles)
        const rOuter = R * 1.15;
        const rInner = R * 0.7;
        const rotOuter = t * 0.015;
        const rotInner = -t * 0.025;
        
        targetCtx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        targetCtx.beginPath();
        for (let i = 0; i < 3; i++) {
          const a = rotOuter + (i * Math.PI * 2) / 3 - Math.PI / 2;
          targetCtx.lineTo(cx + Math.cos(a) * rOuter, cy + Math.sin(a) * rOuter);
        }
        targetCtx.closePath();
        targetCtx.stroke();
        
        targetCtx.strokeStyle = 'rgba(0, 243, 255, 0.7)';
        setGlow(targetCtx, '#00f3ff', 8);
        targetCtx.beginPath();
        for (let i = 0; i < 3; i++) {
          const a = rotInner + (i * Math.PI * 2) / 3 - Math.PI / 2;
          targetCtx.lineTo(cx + Math.cos(a) * rInner, cy + Math.sin(a) * rInner);
        }
        targetCtx.closePath();
        targetCtx.stroke();
        resetGlow(targetCtx);
        
      } else if (variantIndex === 1) {
        // Dotted Matrix Triangle
        const x1 = cx, y1 = cy - R;
        const x2 = cx + R * sin60, y2 = cy + R * cos60;
        const x3 = cx - R * sin60, y3 = cy + R * cos60;
        
        targetCtx.fillStyle = '#00f3ff';
        setGlow(targetCtx, '#00f3ff', 8);
        const drawDottedLine = (sx, sy, ex, ey, dots = 10) => {
          for (let i = 0; i <= dots; i++) {
            targetCtx.beginPath();
            targetCtx.arc(sx + (ex - sx) * (i / dots), sy + (ey - sy) * (i / dots), 2.5, 0, Math.PI * 2);
            targetCtx.fill();
          }
        };
        drawDottedLine(x1, y1, x2, y2);
        drawDottedLine(x2, y2, x3, y3);
        drawDottedLine(x3, y3, x1, y1);
        resetGlow(targetCtx);
        
        targetCtx.strokeStyle = '#ffffff';
        targetCtx.lineWidth = 1.5;
        [ {x:x1, y:y1}, {x:x2, y:y2}, {x:x3, y:y3} ].forEach(vertex => {
          targetCtx.beginPath();
          targetCtx.arc(vertex.x, vertex.y, 8, 0, Math.PI * 2);
          targetCtx.stroke();
        });
        
      } else if (variantIndex === 2) {
        // Morphing Axis Split (Dynamic Wobble)
        const wobbleX = Math.sin(t * 0.08) * 16;
        const wobbleY = Math.cos(t * 0.06) * 10;
        const x1 = cx + wobbleX, y1 = cy - R + wobbleY;
        const x2 = cx + R * sin60, y2 = cy + R * cos60;
        const x3 = cx - R * sin60, y3 = cy + R * cos60;
        
        targetCtx.strokeStyle = '#ffffff';
        targetCtx.beginPath();
        targetCtx.moveTo(x1, y1);
        targetCtx.lineTo(x2, y2);
        targetCtx.lineTo(x3, y3);
        targetCtx.closePath();
        targetCtx.stroke();
        
        targetCtx.strokeStyle = 'rgba(0, 243, 255, 0.4)';
        targetCtx.setLineDash([2, 5]);
        targetCtx.beginPath();
        targetCtx.moveTo(cx, cy - R - 10);
        targetCtx.lineTo(cx, cy + R + 10);
        targetCtx.stroke();
        targetCtx.setLineDash([]);
        
      } else if (variantIndex === 3) {
        // Shattered Frame (Missing side and pieces)
        const x1 = cx, y1 = cy - R;
        const x2 = cx + R * sin60, y2 = cy + R * cos60;
        const x3 = cx - R * sin60, y3 = cy + R * cos60;
        
        targetCtx.strokeStyle = '#ffffff';
        targetCtx.beginPath(); targetCtx.moveTo(x1, y1); targetCtx.lineTo(x3, y3); targetCtx.stroke();
        targetCtx.beginPath(); targetCtx.moveTo(x1, y1); targetCtx.lineTo(x2, y2); targetCtx.stroke();
        
        targetCtx.strokeStyle = 'rgba(0, 243, 255, 0.55)';
        setGlow(targetCtx, '#00f3ff', 6);
        const numTicks = 6;
        for (let i = 0; i <= numTicks; i++) {
          const px = x3 + (x2 - x3) * (i / numTicks);
          targetCtx.beginPath(); targetCtx.moveTo(px, y3 - 4); targetCtx.lineTo(px, y3 + 4); targetCtx.stroke();
        }
        resetGlow(targetCtx);
        
        targetCtx.fillStyle = '#ffffff';
        for (let i = 0; i < 4; i++) {
          const px = x3 + (x2 - x3) * ((i + 1) / 5) + Math.sin(t * 0.1 + i) * 5;
          targetCtx.fillRect(px - 2, y3 + 12 + Math.cos(t * 0.1 + i) * 4 - 2, 4, 4);
        }
      }
    }
    
    // --- CIRCLE Variations (MANIFESTATION) ---
    else if (currentHouse === 'manifestation') {
      if (variantIndex === 0) {
        // Nested Concentric Circle Orbit
        targetCtx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        targetCtx.beginPath();
        targetCtx.arc(cx, cy, R * 1.12, 0, Math.PI * 2);
        targetCtx.stroke();
        
        // Inner rotating circle dot
        targetCtx.strokeStyle = HOUSE_CONFIG.manifestation.colorGlow;
        setGlow(targetCtx, HOUSE_CONFIG.manifestation.colorGlow, 8);
        targetCtx.beginPath();
        targetCtx.arc(cx, cy, R * 0.75, 0, Math.PI * 2);
        targetCtx.stroke();
        
        const dotAngle = t * 0.04;
        targetCtx.fillStyle = '#ffffff';
        targetCtx.beginPath();
        targetCtx.arc(cx + Math.cos(dotAngle) * R * 0.75, cy + Math.sin(dotAngle) * R * 0.75, 5, 0, Math.PI * 2);
        targetCtx.fill();
        resetGlow(targetCtx);
        
      } else if (variantIndex === 1) {
        // Dotted Circle matrix
        targetCtx.fillStyle = HOUSE_CONFIG.manifestation.colorGlow;
        setGlow(targetCtx, HOUSE_CONFIG.manifestation.colorGlow, 8);
        const dotsCount = 28;
        for (let i = 0; i < dotsCount; i++) {
          const a = (i * Math.PI * 2) / dotsCount;
          targetCtx.beginPath();
          targetCtx.arc(cx + Math.cos(a) * R, cy + Math.sin(a) * R, 2.5, 0, Math.PI * 2);
          targetCtx.fill();
        }
        resetGlow(targetCtx);
        
      } else if (variantIndex === 2) {
        // Liquid Morphing circle (Radius shifts by angle)
        targetCtx.strokeStyle = '#ffffff';
        targetCtx.beginPath();
        const steps = 60;
        for (let i = 0; i <= steps; i++) {
          const a = (i * Math.PI * 2) / steps;
          const wobbleRadius = R * (0.95 + Math.sin(a * 5 + t * 0.12) * 0.06);
          targetCtx.lineTo(cx + Math.cos(a) * wobbleRadius, cy + Math.sin(a) * wobbleRadius);
        }
        targetCtx.closePath();
        targetCtx.stroke();
        
      } else if (variantIndex === 3) {
        // Shattered circle arc
        targetCtx.strokeStyle = '#ffffff';
        // Draw 3/4 circle
        targetCtx.beginPath();
        targetCtx.arc(cx, cy, R, 0, Math.PI * 1.6);
        targetCtx.stroke();
        
        // Circular shards in the gap
        targetCtx.strokeStyle = HOUSE_CONFIG.manifestation.colorGlow;
        setGlow(targetCtx, HOUSE_CONFIG.manifestation.colorGlow, 6);
        const shardAngleStart = Math.PI * 1.65;
        const shardAngleEnd = Math.PI * 1.95;
        const numShards = 3;
        for (let i = 0; i < numShards; i++) {
          const stepAngle = shardAngleStart + (shardAngleEnd - shardAngleStart) * (i / (numShards - 1)) + Math.sin(t * 0.08) * 0.02;
          const dist = R + Math.sin(t * 0.08 + i) * 6;
          targetCtx.beginPath();
          targetCtx.arc(cx, cy, dist, stepAngle, stepAngle + 0.06);
          targetCtx.stroke();
        }
        resetGlow(targetCtx);
      }
    }
    
    // --- SQUARE Variations (DEVOTION) ---
    else if (currentHouse === 'devotion') {
      if (variantIndex === 0) {
        // Nested rotating squares
        targetCtx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        drawRotatingSquare(targetCtx, cx, cy, R * 1.5, R * 1.5, t * 0.012);
        
        targetCtx.strokeStyle = HOUSE_CONFIG.devotion.colorGlow;
        setGlow(targetCtx, HOUSE_CONFIG.devotion.colorGlow, 8);
        drawRotatingSquare(targetCtx, cx, cy, R * 0.95, R * 0.95, -t * 0.02);
        resetGlow(targetCtx);
        
      } else if (variantIndex === 1) {
        // Dotted Square border
        targetCtx.fillStyle = HOUSE_CONFIG.devotion.colorGlow;
        setGlow(targetCtx, HOUSE_CONFIG.devotion.colorGlow, 8);
        
        const S = R * 1.45;
        const dotsPerSide = 8;
        const half = S / 2;
        
        const drawEdgeDots = (x_s, y_s, dx, dy) => {
          for (let i = 0; i < dotsPerSide; i++) {
            targetCtx.beginPath();
            targetCtx.arc(x_s + dx * (i / dotsPerSide), y_s + dy * (i / dotsPerSide), 2.5, 0, Math.PI * 2);
            targetCtx.fill();
          }
        };
        
        drawEdgeDots(cx - half, cy - half, S, 0);  // Top
        drawEdgeDots(cx + half, cy - half, 0, S);  // Right
        drawEdgeDots(cx + half, cy + half, -S, 0); // Bottom
        drawEdgeDots(cx - half, cy + half, 0, -S); // Left
        resetGlow(targetCtx);
        
      } else if (variantIndex === 2) {
        // Wobble Corners (Pulsing corners)
        const S = R * 1.45;
        const half = S / 2;
        const pulseVal = Math.sin(t * 0.08) * 12;
        
        targetCtx.strokeStyle = '#ffffff';
        targetCtx.beginPath();
        targetCtx.moveTo(cx - half - pulseVal, cy - half - pulseVal); // TL
        targetCtx.lineTo(cx + half + pulseVal, cy - half - pulseVal); // TR
        targetCtx.lineTo(cx + half + pulseVal, cy + half + pulseVal); // BR
        targetCtx.lineTo(cx - half - pulseVal, cy + half + pulseVal); // BL
        targetCtx.closePath();
        targetCtx.stroke();
        
      } else if (variantIndex === 3) {
        // Shattered Square (Missing bottom border)
        const S = R * 1.45;
        const half = S / 2;
        
        targetCtx.strokeStyle = '#ffffff';
        targetCtx.beginPath();
        // Top, left, right edges drawn
        targetCtx.moveTo(cx - half, cy + half);
        targetCtx.lineTo(cx - half, cy - half);
        targetCtx.lineTo(cx + half, cy - half);
        targetCtx.lineTo(cx + half, cy + half);
        targetCtx.stroke();
        
        // Shattered debris falling below bottom edge
        targetCtx.fillStyle = HOUSE_CONFIG.devotion.colorGlow;
        setGlow(targetCtx, HOUSE_CONFIG.devotion.colorGlow, 8);
        const steps = 4;
        for (let i = 0; i < steps; i++) {
          const px = cx - half + S * ((i + 1) / (steps + 1)) + Math.sin(t * 0.15 + i) * 6;
          const py = cy + half + 14 + Math.cos(t * 0.1 + i) * 4;
          targetCtx.fillRect(px - 2, py - 2, 4, 4);
        }
        resetGlow(targetCtx);
      }
    }
  }

  /**
   * Chromatic aberration and glitch slices
   */
  function drawGlitchDistortion(targetCtx, t) {
    const splitOffset = Math.sin(t * 0.4) * 4;
    
    if (Math.random() < 0.35) {
      targetCtx.globalCompositeOperation = 'screen';
      targetCtx.fillStyle = 'rgba(0, 243, 255, 0.25)';
      targetCtx.fillRect(splitOffset, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      targetCtx.fillStyle = 'rgba(255, 0, 85, 0.25)';
      targetCtx.fillRect(-splitOffset, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      targetCtx.globalCompositeOperation = 'source-over';
    }

    const numSlices = Math.floor(Math.random() * 4) + 2;
    for (let i = 0; i < numSlices; i++) {
      const sliceY = Math.floor(Math.random() * CANVAS_HEIGHT);
      const sliceH = Math.floor(Math.random() * 45) + 10;
      const shiftX = (Math.random() - 0.5) * 28;
      
      targetCtx.drawImage(
        canvas,
        0, sliceY, CANVAS_WIDTH, sliceH,
        shiftX, sliceY, CANVAS_WIDTH, sliceH
      );
    }

    if (Math.random() < 0.4) {
      targetCtx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      targetCtx.font = "8px 'Share Tech Mono'";
      targetCtx.fillText("SYS_ENTROPY: OVERLOAD", 15, Math.random() * CANVAS_HEIGHT);
      targetCtx.fillText("BX-SEAL_INCOMING_VECTOR", 320, Math.random() * CANVAS_HEIGHT);
    }

    const numLines = Math.floor(Math.random() * 3);
    for (let i = 0; i < numLines; i++) {
      targetCtx.strokeStyle = Math.random() > 0.5 ? '#ffffff' : 'var(--color-cyan)';
      targetCtx.lineWidth = Math.random() * 1.5;
      const lineY = Math.random() * CANVAS_HEIGHT;
      targetCtx.beginPath();
      targetCtx.moveTo(0, lineY);
      targetCtx.lineTo(CANVAS_WIDTH, lineY);
      targetCtx.stroke();
    }
  }

  // --- Active Draw Router for Core Houses ---
  function drawHouseCoreSigil(targetCtx, houseKey, sigilIndex, scale = 1, t = 0) {
    if (houseKey === 'chance') {
      if (sigilIndex === 0) drawBanish(targetCtx, scale, t);
      else if (sigilIndex === 1) drawRisk(targetCtx, scale, t);
      else drawSummon(targetCtx, scale, t);
    } else if (houseKey === 'manifestation') {
      if (sigilIndex === 0) drawVision(targetCtx, scale, t);
      else if (sigilIndex === 1) drawFocus(targetCtx, scale, t);
      else drawAlign(targetCtx, scale, t);
    } else if (houseKey === 'devotion') {
      if (sigilIndex === 0) drawAnchor(targetCtx, scale, t);
      else if (sigilIndex === 1) drawSacrifice(targetCtx, scale, t);
      else drawSanctuary(targetCtx, scale, t);
    }
  }

  // --- Game Loop Implementation ---

  function runEntropyEngine() {
    time += entropySpeed;
    
    clearCanvas(ctx);

    if (isCollapsing) {
      // Rapid visual cycle through all available geometry configurations during collapse
      const tempState = Math.floor(Math.random() * 7);
      if (tempState < 3) {
        drawHouseCoreSigil(ctx, currentHouse, tempState, 1.05, time);
      } else {
        drawEntropyVariation(ctx, tempState - 3, 1.05, time);
      }
      drawGlitchDistortion(ctx, time);
      
    } else if (isCollapsed) {
      const pulse = 1.0 + Math.sin(time * 0.04) * 0.02;
      drawHouseCoreSigil(ctx, currentHouse, collapsedSigilIndex, pulse, time);

      if (Math.random() < 0.015) {
        drawGlitchDistortion(ctx, time);
      }

    } else {
      // 10-Phase High-Tempo Visual Loop Cycle
      const totalCycleDuration = 5 * LOOP_TIMINGS.stateDuration + 5 * LOOP_TIMINGS.glitchDuration;
      const currentTimeMs = (Date.now()) % totalCycleDuration;

      let acc = 0;

      // Phase 01: Core Sigil 01
      if (currentTimeMs < LOOP_TIMINGS.stateDuration) {
        drawHouseCoreSigil(ctx, currentHouse, 0, 1.0, time);
      } 
      // Phase 02: Core Sigil 01 + Glitch
      else if (currentTimeMs < (acc = LOOP_TIMINGS.stateDuration + LOOP_TIMINGS.glitchDuration)) {
        drawHouseCoreSigil(ctx, currentHouse, 0, 1.0, time);
        drawGlitchDistortion(ctx, time);
      }
      // Phase 03: Intermediate Variant 0
      else if (currentTimeMs < (acc += LOOP_TIMINGS.stateDuration)) {
        drawEntropyVariation(ctx, 0, 1.0, time);
      }
      // Phase 04: Intermediate Variant 0 + Glitch
      else if (currentTimeMs < (acc += LOOP_TIMINGS.glitchDuration)) {
        drawEntropyVariation(ctx, 0, 1.0, time);
        drawGlitchDistortion(ctx, time);
      }
      // Phase 05: Core Sigil 02
      else if (currentTimeMs < (acc += LOOP_TIMINGS.stateDuration)) {
        drawHouseCoreSigil(ctx, currentHouse, 1, 1.0, time);
      }
      // Phase 06: Core Sigil 02 + Glitch
      else if (currentTimeMs < (acc += LOOP_TIMINGS.glitchDuration)) {
        drawHouseCoreSigil(ctx, currentHouse, 1, 1.0, time);
        drawGlitchDistortion(ctx, time);
      }
      // Phase 07: Dynamic intermediate variations 1, 2, 3
      else if (currentTimeMs < (acc += LOOP_TIMINGS.stateDuration)) {
        const variantCycle = (Math.floor(time / 15) % 3) + 1;
        drawEntropyVariation(ctx, variantCycle, 1.0, time);
      }
      // Phase 08: Dynamic intermediate variations + Glitch
      else if (currentTimeMs < (acc += LOOP_TIMINGS.glitchDuration)) {
        const variantCycle = (Math.floor(time / 15) % 3) + 1;
        drawEntropyVariation(ctx, variantCycle, 1.0, time);
        drawGlitchDistortion(ctx, time);
      }
      // Phase 09: Core Sigil 03 (Summon/Align/Sanctuary)
      else if (currentTimeMs < (acc += LOOP_TIMINGS.stateDuration)) {
        drawHouseCoreSigil(ctx, currentHouse, 2, 1.0, time);
      }
      // Phase 10: Core Sigil 03 + Glitch
      else {
        drawHouseCoreSigil(ctx, currentHouse, 2, 1.0, time);
        drawGlitchDistortion(ctx, time);
      }
    }

    animationFrameId = requestAnimationFrame(runEntropyEngine);
  }

  // --- Interaction Event Handlers ---

  /**
   * Action 1: FREEZE THE FLOW
   */
  btnFreeze.addEventListener('click', () => {
    if (isCollapsed || isCollapsing) return;

    isCollapsing = true;
    btnFreeze.disabled = true;
    
    statusText.textContent = "DECRYPTION ACTIVE";
    statusText.classList.add('locked');
    statusDot.classList.remove('pulsing');
    statusDot.classList.add('locked');

    setTimeout(() => {
      isCollapsing = false;
      isCollapsed = true;
      btnFreeze.disabled = false;

      // Settle on one of the 3 active sigils
      collapsedSigilIndex = Math.floor(Math.random() * 3);
      const chosenSigil = HOUSE_CONFIG[currentHouse].sigilData[collapsedSigilIndex];

      const { seed, fullCode, displayHash, hash } = generateSeedAndHash(HOUSE_CONFIG[currentHouse].seedPrefix, chosenSigil.id);
      seedCode = seed;
      fullFulfillmentCode = fullCode;
      fullSecureHash = hash;

      receiptSigilName.textContent = chosenSigil.name;
      receiptSigilDesc.textContent = chosenSigil.desc;
      receiptSigilDirective.textContent = chosenSigil.directive;
      receiptSeed.textContent = fullCode;
      receiptHash.textContent = displayHash;
      
      const entropy = (95.00 + Math.random() * 4.99).toFixed(2);
      receiptEntropy.textContent = `${entropy}% VARIANCE`;
      
      const now = new Date();
      receiptTimestamp.textContent = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

      cardInvitation.classList.add('hidden');
      cardReceipt.classList.remove('hidden');

      statusText.textContent = "BX SECURE SEAL";

    }, 850);
  });

  /**
   * Action 2: UNSEAL THE PATTERN
   */
  btnRelease.addEventListener('click', () => {
    isCollapsed = false;
    isCollapsing = false;
    
    cardReceipt.classList.add('hidden');
    cardInvitation.classList.remove('hidden');
    
    statusText.textContent = "ENTROPY ACTIVE";
    statusText.classList.remove('locked');
    statusDot.classList.add('pulsing');
    statusDot.classList.remove('locked');
  });

  /**
   * Action 3: HOUSE TAB SWITCHING
   */
  document.querySelectorAll('.house-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      const selectedHouse = e.target.getAttribute('data-house');
      if (selectedHouse === currentHouse) return;

      // 1. Release active collapsed state if changing houses
      isCollapsed = false;
      isCollapsing = false;
      cardReceipt.classList.add('hidden');
      cardExport.classList.add('hidden');
      cardProcessing.classList.add('hidden');
      cardInvitation.classList.remove('hidden');
      
      statusText.textContent = "ENTROPY ACTIVE";
      statusText.classList.remove('locked');
      statusDot.classList.add('pulsing');
      statusDot.classList.remove('locked');

      // 2. Adjust active tab CSS highlights
      document.querySelectorAll('.house-tab').forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');

      // 3. Set body class selector to trigger CSS transitions
      document.body.className = HOUSE_CONFIG[selectedHouse].themeClass;

      // 4. Update memory parameters
      currentHouse = selectedHouse;

      // 5. Update HTML text components dynamically
      const activeHouse = HOUSE_CONFIG[selectedHouse];
      hudHouseTitle.textContent = activeHouse.title;
      inviteQuote.textContent = activeHouse.inviteQuote;
      inviteInstruction.textContent = activeHouse.inviteInstruction;
    });
  });

  // --- GIF Compiler Engine ---

  btnGif.addEventListener('click', async () => {
    if (!isCollapsed) return;

    cardReceipt.classList.add('hidden');
    cardProcessing.classList.remove('hidden');
    
    loaderProgressBar.style.width = '0%';
    loaderPercent.textContent = '0%';
    loaderStatus.textContent = 'PREPARING MATRIX FRAMEWORKS...';

    await delay(700);

    loaderProgressBar.style.width = '15%';
    loaderPercent.textContent = '15%';
    loaderStatus.textContent = 'CAPTURING GEOMETRIC CYCLES...';

    const offscreen = document.createElement('canvas');
    offscreen.width = 400;
    offscreen.height = 400;
    const octx = offscreen.getContext('2d', { willReadFrequently: true });
    
    const frameImages = [];
    const numFrames = 15;
    
    const activeHouse = HOUSE_CONFIG[currentHouse];

    for (let f = 0; f < numFrames; f++) {
      clearCanvas(octx);
      
      const progress = f / numFrames;
      const angle = progress * Math.PI * 2;
      const scale = 0.90 + Math.sin(angle) * 0.05;
      const mockTime = f * 3.5;
      
      // Draw dynamic pulses for the specific collapsed sigil in offscreen
      drawHouseCoreSigil(octx, currentHouse, collapsedSigilIndex, scale, mockTime);

      // Glitch frame overlay for tech aesthetic
      if (f === 5 || f === 12) {
        octx.globalCompositeOperation = 'screen';
        octx.fillStyle = `rgba(${currentHouse === 'chance' ? '0, 243, 255' : currentHouse === 'manifestation' ? '255, 183, 0' : '255, 0, 127'}, 0.45)`;
        octx.fillRect(3, 0, 400, 400);
        octx.fillStyle = 'rgba(255, 0, 85, 0.45)';
        octx.fillRect(-3, 0, 400, 400);
        octx.globalCompositeOperation = 'source-over';
        
        octx.strokeStyle = activeHouse.colorGlow;
        octx.lineWidth = 1.5;
        octx.beginPath();
        octx.moveTo(0, 180); octx.lineTo(400, 180);
        octx.moveTo(0, 260); octx.lineTo(400, 260);
        octx.stroke();
      }

      // Draw custom bounding frame
      octx.strokeStyle = 'rgba(255,255,255,0.06)';
      octx.lineWidth = 1;
      octx.strokeRect(10, 10, 380, 380);

      // Monospace label logs printed at the bottom of the GIF card
      octx.fillStyle = 'rgba(255,255,255,0.2)';
      octx.font = "8px 'Share Tech Mono'";
      octx.textAlign = 'left';
      octx.fillText(`DEC: BX-${activeHouse.name}-SECURE-STABLE`, 20, 380);
      
      octx.textAlign = 'right';
      octx.fillStyle = activeHouse.colorGlow;
      octx.fillText(fullFulfillmentCode, 380, 380);
      
      frameImages.push(offscreen.toDataURL('image/png'));
    }

    await delay(800);

    loaderProgressBar.style.width = '35%';
    loaderPercent.textContent = '35%';
    loaderStatus.textContent = 'COMPILING ENCODERS...';

    await delay(600);

    loaderStatus.textContent = 'COMPILING MULTI-THREAD WORKERS...';

    gifshot.createGIF({
      images: frameImages,
      gifWidth: 400,
      gifHeight: 400,
      interval: 0.1, // 100ms per frame
      progressCallback: (progressPercent) => {
        const computedPercent = Math.min(90, Math.round(35 + progressPercent * 55));
        loaderProgressBar.style.width = `${computedPercent}%`;
        loaderPercent.textContent = `${computedPercent}%`;
      }
    }, (obj) => {
      if (obj.error) {
        console.error('GIF Generation Error:', obj.error);
        alert(`Compilation Error: ${obj.error}`);
        
        cardProcessing.classList.add('hidden');
        cardReceipt.classList.remove('hidden');
        return;
      }

      loaderProgressBar.style.width = '95%';
      loaderPercent.textContent = '95%';
      loaderStatus.textContent = 'PUBLISHING TO SECURE ARCHIVE...';

      gifPreview.src = obj.image;
      downloadGifLink.href = obj.image;
      downloadGifLink.download = `BLEXX_${seedCode}_${activeHouse.sigilData[collapsedSigilIndex].id}.gif`;

      // 1. Upload base64 GIF to Firebase Storage in background
      const storageRef = ref(storage, `blexxings/${seedCode}.gif`);
      
      uploadString(storageRef, obj.image, 'data_url').then((snapshot) => {
        getDownloadURL(snapshot.ref).then((downloadURL) => {
          console.log("GIF successfully uploaded to Storage:", downloadURL);
          
          // 2. Write metadata document to Firestore database
          const blexxingData = {
            house: currentHouse,
            houseName: activeHouse.name,
            sigilName: activeHouse.sigilData[collapsedSigilIndex].name,
            sigilId: activeHouse.sigilData[collapsedSigilIndex].id,
            seed: seedCode,
            fulfillmentCode: fullFulfillmentCode,
            entropy: parseFloat(document.getElementById('receipt-entropy').textContent) || 99.84,
            hash: fullSecureHash,
            gifUrl: downloadURL,
            location: userLocation,
            timestamp: serverTimestamp()
          };
          
          addDoc(collection(db, "blexxings"), blexxingData).then((docRef) => {
            console.log("Document successfully written with ID:", docRef.id);
            // Trigger real-time feed load
            loadGlobalFeed();
          }).catch(err => console.error("Error writing document to Firestore:", err));
          
          // 3. Update the Email pre-filled body to link directly to the hosted animated GIF!
          const emailSubject = encodeURIComponent(`My Digital Blexxing - House of ${activeHouse.name}`);
          const emailBody = encodeURIComponent(
`I have bound the sacred pattern in the House of ${activeHouse.name}!

Sealed Sigil: ${fullFulfillmentCode}
Secure Hash: ${fullSecureHash}

🔗 View my live animated Blexxing here:
${downloadURL}

Generate your own digital Blexxing here: https://bitsofdust.github.io/blexx-gif/`
          );
          emailGifLink.href = `mailto:?subject=${emailSubject}&body=${emailBody}`;
        });
      }).catch(err => {
        console.error("Firebase Storage Upload Failed:", err);
        
        // Fallback: If Firebase fails, still configure the mailto link without the hosted URL
        const emailSubject = encodeURIComponent(`My Digital Blexxing - House of ${activeHouse.name}`);
        const emailBody = encodeURIComponent(
`I have bound the sacred pattern in the House of ${activeHouse.name}!

Sealed Sigil: ${fullFulfillmentCode}
Secure Hash: ${fullSecureHash}

⚡ [Tip: Drag and drop or copy-paste your downloaded Blexxing file directly into this email to share the pulsing animation!]

Generate your own digital Blexxing here: https://bitsofdust.github.io/blexx-gif/`
        );
        emailGifLink.href = `mailto:?subject=${emailSubject}&body=${emailBody}`;
      });

      // Allow final steps to be read before finishing
      setTimeout(() => {
        loaderProgressBar.style.width = '100%';
        loaderPercent.textContent = '100%';
        loaderStatus.textContent = 'COMPILATION COMPLETE!';
        
        setTimeout(() => {
          cardProcessing.classList.add('hidden');
          cardExport.classList.remove('hidden');
        }, 1200);
      }, 800);
    });
  });

  btnExportBack.addEventListener('click', () => {
    cardExport.classList.add('hidden');
    cardReceipt.classList.remove('hidden');
  });

  // --- Global Blexxing Archive Loader ---
  function loadGlobalFeed() {
    const q = query(collection(db, "blexxings"), orderBy("timestamp", "desc"), limit(3));
    getDocs(q).then((querySnapshot) => {
      const feedContainer = document.getElementById('feed-container');
      if (!feedContainer) return;
      feedContainer.innerHTML = '';
      
      if (querySnapshot.empty) {
        feedContainer.innerHTML = '<div class="feed-placeholder font-mono">NO CRYPTOGRAPHIC ARCHIVES SEALED YET. BIND THE PATTERN.</div>';
        return;
      }
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const card = document.createElement('div');
        const houseColorClass = data.house === 'chance' ? 'chance-text' : data.house === 'manifestation' ? 'amber-text' : 'magenta-text';
        const houseAccentColor = data.house === 'chance' ? '#00f3ff' : data.house === 'manifestation' ? '#ffb700' : '#ff007f';
        
        card.className = 'feed-card glass-sub-panel';
        card.innerHTML = `
          <div class="feed-card-header font-mono">
            <span class="feed-house ${houseColorClass}">HOUSE: ${data.house.toUpperCase()}</span>
            <span class="feed-location font-mono">[${data.location || 'SECURE NODE'}]</span>
            <span class="feed-time">${data.timestamp ? new Date(data.timestamp.seconds * 1000).toLocaleTimeString() : 'RECENT'}</span>
          </div>
          <div class="feed-card-body">
            <div class="feed-thumbnail-wrapper">
              <img src="${data.gifUrl}" alt="${data.sigilName}" class="feed-thumbnail" style="border-color: ${houseAccentColor}">
            </div>
            <div class="feed-meta font-mono">
              <div class="feed-sigil">${data.sigilName}</div>
              <div class="feed-seed">${data.fulfillmentCode}</div>
            </div>
          </div>
        `;
        feedContainer.appendChild(card);
      });
    }).catch(err => {
      console.error("Error loading feed:", err);
      const feedContainer = document.getElementById('feed-container');
      if (feedContainer) {
        feedContainer.innerHTML = '<div class="feed-placeholder font-mono">SECURE ARCHIVE STORAGE ACTIVE. RETRIEVAL PROTOCOLS STANDBY.</div>';
      }
    });
  }

  // --- Physical Shipment Modal Actions ---
  if (btnPhysical && physicalModal) {
    btnPhysical.addEventListener('click', () => {
      physicalModal.showModal();
    });

    closeModalBtn.addEventListener('click', () => {
      physicalModal.close();
    });

    cancelShipmentBtn.addEventListener('click', () => {
      physicalModal.close();
    });

    physicalForm.addEventListener('submit', (e) => {
      e.preventDefault(); // Intercept method="dialog" submit to write data first

      const orderData = {
        name: document.getElementById('ship-name').value,
        address: document.getElementById('ship-address').value,
        city: document.getElementById('ship-city').value,
        state: document.getElementById('ship-state').value,
        zip: document.getElementById('ship-zip').value,
        country: document.getElementById('ship-country').value,
        seed: seedCode,
        fulfillmentCode: fullFulfillmentCode,
        hash: fullSecureHash,
        house: currentHouse,
        timestamp: new Date()
      };

      // 1. Save to Cloud Firestore spreadsheet database ledger
      addDoc(collection(db, "physical_orders"), orderData).then((docRef) => {
        console.log("Physical order securely saved to Firestore spreadsheet database with ID:", docRef.id);
        
        // 2. Generate and download a local CSV spreadsheet sheet file!
        const csvHeaders = "NAME,STREET_ADDRESS,CITY,STATE,POSTAL_CODE,COUNTRY,SEED_CODE,FULFILLMENT_CODE,SECURE_HASH,HOUSE_REALM,TIMESTAMP_UTC\n";
        const csvRow = `"${orderData.name.replace(/"/g, '""')}","${orderData.address.replace(/"/g, '""')}","${orderData.city.replace(/"/g, '""')}","${orderData.state.replace(/"/g, '""')}","${orderData.zip.replace(/"/g, '""')}","${orderData.country.replace(/"/g, '""')}","${orderData.seed}","${orderData.fulfillmentCode}","${orderData.hash}","${orderData.house.toUpperCase()}","${orderData.timestamp.toISOString()}"\n`;
        const csvBlob = new Blob([csvHeaders + csvRow], { type: "text/csv;charset=utf-8;" });
        const csvUrl = URL.createObjectURL(csvBlob);
        
        const downloadLink = document.createElement("a");
        downloadLink.setAttribute("href", csvUrl);
        downloadLink.setAttribute("download", `BLEXX_SHIPMENT_${orderData.seed}.csv`);
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        alert("PHYSICAL SHIPMENT CONFIRMED!\n\nOrder saved to Firestore database ledger & downloaded as a CSV spreadsheet.");
        
        // Reset form and close
        physicalForm.reset();
        physicalModal.close();
      }).catch((err) => {
        console.error("Firestore Physical Order Error:", err);
        alert("ERROR: Could not establish connection to the database. Order not saved.");
      });
    });
  }

  // --- Booting the Application ---
  loadGlobalFeed();
  runEntropyEngine();
});
