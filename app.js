/**
 * ==========================================================================
 * BLEXX INTERACTIVE ENGINE & GIF COMPILER
 * Technical Architecture: Triangle House of Chance
 * ==========================================================================
 */

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
  
  const receiptSigilName = document.getElementById('receipt-sigil-name');
  const receiptSigilDesc = document.getElementById('receipt-sigil-desc');
  const receiptSigilDirective = document.getElementById('receipt-sigil-directive');
  const receiptSeed = document.getElementById('receipt-seed');
  const receiptTimestamp = document.getElementById('receipt-timestamp');
  const receiptHash = document.getElementById('receipt-hash');
  
  const loaderProgressBar = document.getElementById('loader-progress-bar');
  const loaderStatus = document.getElementById('loader-status');
  const loaderPercent = document.getElementById('loader-percent');
  
  const gifPreview = document.getElementById('gif-preview');
  const downloadGifLink = document.getElementById('download-gif-link');

  // --- Constants & Config ---
  const CANVAS_WIDTH = 500;
  const CANVAS_HEIGHT = 500;
  const CENTER_X = CANVAS_WIDTH / 2;
  const CENTER_Y = CANVAS_HEIGHT / 2;

  // Narrative data for the 3-Sigil Trinity
  const SIGIL_DATA = [
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
      id: "RCV",
      name: "03 RECEIVE",
      desc: "Unconditional integration. Complete physical and narrative ownership over whatever variant state collapses into the perimeter.",
      directive: "Accepting the feedback loop outcome without deploying filtering or structural egress mechanisms."
    }
  ];

  // --- State Variables ---
  let isCollapsed = false;
  let isCollapsing = false;
  let collapsedSigilIndex = 0; // 0: Banish, 1: Risk, 2: Receive
  let animationFrameId = null;
  let time = 0;
  let entropySpeed = 1; // Animation speed coefficient
  let seedCode = "";
  let fullFulfillmentCode = "";

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
  function generateSeedAndHash(sigilId) {
    const chars = '0123456789ABCDEF';
    let seed = '';
    for (let i = 0; i < 6; i++) {
      seed += chars[Math.floor(Math.random() * 16)];
    }
    const fullCode = `BX-CHNC-${seed}-${sigilId}`;
    
    // Simulate a secure SHA-256 hash for visual authenticity
    let hash = '';
    for (let i = 0; i < 32; i++) {
      hash += chars[Math.floor(Math.random() * 16)];
    }
    const displayHash = `${hash.substring(0, 8)}...${hash.substring(24, 32)}`;
    
    return { seed, fullCode, displayHash };
  }

  // --- Dynamic Canvas Render Functions ---

  /**
   * Clears canvas and sets default dark obsidian background
   */
  function clearCanvas(targetCtx) {
    targetCtx.fillStyle = '#050507';
    targetCtx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }

  /**
   * Helper to set premium glow effects
   */
  function setGlow(targetCtx, color = '#00f3ff', blur = 15) {
    targetCtx.shadowColor = color;
    targetCtx.shadowBlur = blur;
  }

  /**
   * Reset shadow parameters to maintain high-contrast shapes
   */
  function resetGlow(targetCtx) {
    targetCtx.shadowBlur = 0;
    targetCtx.shadowColor = 'transparent';
  }

  /**
   * SIGIL 01: BANISH Drawing Routine
   * Detached top vertex and radiating shards
   */
  function drawBanish(targetCtx, scale = 1, t = 0) {
    const cx = CENTER_X;
    const cy = CENTER_Y + 15; // Shift slightly down to balance mass
    const R = 120 * scale;
    
    const sin60 = Math.sin(Math.PI / 3);
    const cos60 = Math.cos(Math.PI / 3);
    
    // Equilateral Base points
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
    
    // Draw Truncated Sides (Banish requires void/shatter effect)
    targetCtx.strokeStyle = '#ffffff';
    setGlow(targetCtx, 'rgba(255, 255, 255, 0.4)', 8);
    
    // Left Side going up (truncated at 60%)
    targetCtx.beginPath();
    targetCtx.moveTo(x_bl, y_bl);
    targetCtx.lineTo(x_bl + R * sin60 * 0.55, y_bl - R * cos60 * 0.55);
    targetCtx.stroke();
    
    // Right Side going up (truncated at 60%)
    targetCtx.beginPath();
    targetCtx.moveTo(x_br, y_br);
    targetCtx.lineTo(x_br - R * sin60 * 0.55, y_br - R * cos60 * 0.55);
    targetCtx.stroke();
    resetGlow(targetCtx);
    
    // Draw Floating Chevron Vertex (Upper Gateway)
    const top_y = cy - R;
    const offset = 22 * scale; // Distance of float
    
    targetCtx.strokeStyle = '#00f3ff';
    setGlow(targetCtx, '#00f3ff', 12);
    targetCtx.beginPath();
    // Chevron pointing up
    targetCtx.moveTo(cx - 24 * scale, top_y + 12 * scale - offset);
    targetCtx.lineTo(cx, top_y - offset);
    targetCtx.lineTo(cx + 24 * scale, top_y + 12 * scale - offset);
    targetCtx.stroke();
    resetGlow(targetCtx);
    
    // Radiating Chaos Shards (High-Frequency Extraction)
    const numShards = 7;
    targetCtx.strokeStyle = '#00f3ff';
    targetCtx.lineWidth = 2;
    
    for (let i = 0; i < numShards; i++) {
      // Calculate angles pointing outward from center void
      const angle = (i * Math.PI * 2) / numShards + (t * 0.015);
      
      // Animate expansion radius using time
      const expansion = (Math.sin(t * 0.08 + i) * 6) + 12;
      const r_start = (45 + expansion) * scale;
      const r_end = r_start + (14 * scale);
      
      const x1 = cx + Math.cos(angle) * r_start;
      const y1 = cy + Math.sin(angle) * r_start;
      const x2 = cx + Math.cos(angle) * r_end;
      const y2 = cy + Math.sin(angle) * r_end;
      
      setGlow(targetCtx, '#00f3ff', 8);
      targetCtx.beginPath();
      targetCtx.moveTo(x1, y1);
      targetCtx.lineTo(x2, y2);
      targetCtx.stroke();
      resetGlow(targetCtx);
      
      // Little square pixel blocks on end of some shards for tech visual
      if (i % 2 === 0) {
        targetCtx.fillStyle = '#ffffff';
        targetCtx.fillRect(x2 - 2, y2 - 2, 4, 4);
      }
    }
  }

  /**
   * SIGIL 02: RISK Drawing Routine
   * High-aspect vertical needle along coordinate track
   */
  function drawRisk(targetCtx, scale = 1, t = 0) {
    const cx = CENTER_X;
    const cy = CENTER_Y;
    const H = 320 * scale; // Diamond length
    const W = 13 * scale;  // Diamond width
    
    // Vertical Track line (Dashed absolute vertical coordinate)
    targetCtx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    targetCtx.lineWidth = 1;
    targetCtx.setLineDash([4, 8]);
    targetCtx.beginPath();
    targetCtx.moveTo(cx, cy - (H/2) - 25);
    targetCtx.lineTo(cx, cy + (H/2) + 25);
    targetCtx.stroke();
    targetCtx.setLineDash([]); // Reset dash
    
    // Draw Axis Tension ticks with small coordinates
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
      
      // Draw grid tick metric
      const label = (( -offset / 120 )).toFixed(1);
      targetCtx.fillText(`${label}`, cx - (tickWidth / 2) - 6, y_pos + 3);
    });

    // Animate Needle vertical wiggle to show "tension/uncertainty"
    const tensionWiggle = isCollapsed ? 0 : Math.sin(t * 0.25) * 5;
    const finalCy = cy + tensionWiggle;

    // Inner glowing vertical needle
    targetCtx.lineWidth = 2.5;
    targetCtx.strokeStyle = '#ffffff';
    setGlow(targetCtx, 'rgba(255, 255, 255, 0.5)', 8);
    
    // Main compressed needle diamond
    targetCtx.beginPath();
    targetCtx.moveTo(cx, finalCy - H/2); // Top Point
    targetCtx.lineTo(cx + W, finalCy);   // Right Point
    targetCtx.lineTo(cx, finalCy + H/2); // Bottom Point
    targetCtx.lineTo(cx - W, finalCy);   // Left Point
    targetCtx.closePath();
    targetCtx.stroke();
    resetGlow(targetCtx);
    
    // Center glowing core needle
    targetCtx.fillStyle = '#00f3ff';
    setGlow(targetCtx, '#00f3ff', 15);
    targetCtx.beginPath();
    targetCtx.moveTo(cx, finalCy - H * 0.4);
    targetCtx.lineTo(cx + W * 0.4, finalCy);
    targetCtx.lineTo(cx, finalCy + H * 0.4);
    targetCtx.lineTo(cx - W * 0.4, finalCy);
    targetCtx.closePath();
    targetCtx.fill();
    resetGlow(targetCtx);
  }

  /**
   * SIGIL 03: RECEIVE Drawing Routine
   * Grounded equilateral architecture with Solid Seed at center mass
   */
  function drawReceive(targetCtx, scale = 1, t = 0) {
    const cx = CENTER_X;
    const cy = CENTER_Y + 15; // Shift down
    const R = 120 * scale;
    
    const sin60 = Math.sin(Math.PI / 3);
    const cos60 = Math.cos(Math.PI / 3);
    
    // Centroid of the triangle
    const centroidY = cy + (R * cos60) / 2; // approx cy + 15 in default

    // Vertices of the equilateral triangle
    const x1 = cx;
    const y1 = cy - R;
    const x2 = cx + R * sin60;
    const y2 = cy + R * cos60;
    const x3 = cx - R * sin60;
    const y3 = cy + R * cos60;

    targetCtx.lineWidth = 4;
    targetCtx.lineCap = 'round';
    targetCtx.lineJoin = 'round';
    
    // Draw Perfect Symmetrical Triangle Border
    targetCtx.strokeStyle = '#ffffff';
    setGlow(targetCtx, 'rgba(255, 255, 255, 0.4)', 8);
    targetCtx.beginPath();
    targetCtx.moveTo(x1, y1);
    targetCtx.lineTo(x2, y2);
    targetCtx.lineTo(x3, y3);
    targetCtx.closePath();
    targetCtx.stroke();
    resetGlow(targetCtx);

    // Crosshairs targeting coordinates
    targetCtx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    targetCtx.lineWidth = 1;
    targetCtx.beginPath();
    targetCtx.moveTo(cx - 70 * scale, centroidY);
    targetCtx.lineTo(cx + 70 * scale, centroidY);
    targetCtx.moveTo(cx, centroidY - 70 * scale);
    targetCtx.lineTo(cx, centroidY + 70 * scale);
    targetCtx.stroke();

    // Radar Tracking Ring (Equilibrium tracking)
    targetCtx.strokeStyle = 'rgba(0, 243, 255, 0.25)';
    targetCtx.lineWidth = 1;
    targetCtx.setLineDash([3, 5]);
    targetCtx.beginPath();
    targetCtx.arc(cx, centroidY, 32 * scale, 0, Math.PI * 2);
    targetCtx.stroke();
    targetCtx.setLineDash([]); // Reset
    
    // Outer solid tracking ring
    targetCtx.strokeStyle = 'rgba(0, 243, 255, 0.15)';
    targetCtx.beginPath();
    targetCtx.arc(cx, centroidY, 52 * scale, 0, Math.PI * 2);
    targetCtx.stroke();

    // The Solid Seed (Dense glowing center mass core)
    const seedPulse = isCollapsed ? 0 : Math.sin(t * 0.12) * 2;
    const seedRadius = (12 + seedPulse) * scale;
    
    targetCtx.fillStyle = '#ffffff';
    setGlow(targetCtx, '#00f3ff', 20);
    targetCtx.beginPath();
    targetCtx.arc(cx, centroidY, seedRadius, 0, Math.PI * 2);
    targetCtx.fill();
    resetGlow(targetCtx);
  }

  /**
   * Glitch Distortion Effect
   * Slices, horizontal shifts, chromatic aberration, and noise artifacts
   */
  function drawGlitchDistortion(targetCtx, t) {
    // 1. Chromatic Aberration Simulation (RGB Channel Split)
    // We achieve this by drawing displaced red & blue overlays
    const splitOffset = Math.sin(t * 0.4) * 4;
    
    if (Math.random() < 0.35) {
      targetCtx.globalCompositeOperation = 'screen';
      
      // Temporarily draw cyan shifted right
      targetCtx.fillStyle = 'rgba(0, 243, 255, 0.3)';
      targetCtx.fillRect(splitOffset, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      // Draw red shifted left
      targetCtx.fillStyle = 'rgba(255, 0, 85, 0.3)';
      targetCtx.fillRect(-splitOffset, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      targetCtx.globalCompositeOperation = 'source-over';
    }

    // 2. Horizontal slice offset shift
    const numSlices = Math.floor(Math.random() * 4) + 2;
    for (let i = 0; i < numSlices; i++) {
      const sliceY = Math.floor(Math.random() * CANVAS_HEIGHT);
      const sliceH = Math.floor(Math.random() * 45) + 10;
      const shiftX = (Math.random() - 0.5) * 28;
      
      // Copy portion of screen and shift it horizontally
      targetCtx.drawImage(
        canvas,
        0, sliceY, CANVAS_WIDTH, sliceH,
        shiftX, sliceY, CANVAS_WIDTH, sliceH
      );
    }

    // 3. Draw chaotic binary tech text / status logs in background
    if (Math.random() < 0.4) {
      targetCtx.fillStyle = 'rgba(0, 243, 255, 0.35)';
      targetCtx.font = "8px 'Share Tech Mono'";
      targetCtx.fillText("SYS_ENTROPY: OVERLOAD", 15, Math.random() * CANVAS_HEIGHT);
      targetCtx.fillText("BX-COLLAPSE_INCOMING_VECTOR", 320, Math.random() * CANVAS_HEIGHT);
    }

    // 4. Glitchy horizontal lightning beams
    const numLines = Math.floor(Math.random() * 3);
    for (let i = 0; i < numLines; i++) {
      targetCtx.strokeStyle = Math.random() > 0.5 ? '#ffffff' : '#00f3ff';
      targetCtx.lineWidth = Math.random() * 2;
      const lineY = Math.random() * CANVAS_HEIGHT;
      targetCtx.beginPath();
      targetCtx.moveTo(0, lineY);
      targetCtx.lineTo(CANVAS_WIDTH, lineY);
      targetCtx.stroke();
    }
  }

  // --- Game Loop Implementation ---

  function runEntropyEngine() {
    time += entropySpeed;
    
    // Clear canvas
    clearCanvas(ctx);

    if (isCollapsing) {
      // High-speed visual chaos cycle during collapse
      const tempState = Math.floor(Math.random() * 3);
      if (tempState === 0) drawBanish(ctx, 1.05, time);
      else if (tempState === 1) drawRisk(ctx, 1.05, time);
      else drawReceive(ctx, 1.05, time);
      
      drawGlitchDistortion(ctx, time);
      
    } else if (isCollapsed) {
      // Locked state: slow pulse and very occasional micro-glitches
      const pulse = 1.0 + Math.sin(time * 0.04) * 0.02;
      
      if (collapsedSigilIndex === 0) {
        drawBanish(ctx, pulse, time);
      } else if (collapsedSigilIndex === 1) {
        drawRisk(ctx, pulse, time);
      } else {
        drawReceive(ctx, pulse, time);
      }

      // Micro-glitch event: 1.5% chance per frame
      if (Math.random() < 0.015) {
        drawGlitchDistortion(ctx, time);
      }

    } else {
      // Normal Loop State Routing
      // Loop cycle timeline configuration
      const totalCycleDuration = 3 * LOOP_TIMINGS.stateDuration + 3 * LOOP_TIMINGS.glitchDuration;
      const currentTimeMs = (Date.now()) % totalCycleDuration;

      // Determine which state segment we are currently in
      let accumulatedTime = 0;

      // State 01: BANISH
      if (currentTimeMs < LOOP_TIMINGS.stateDuration) {
        drawBanish(ctx, 1.0, time);
      } 
      // Glitch 1
      else if (currentTimeMs < (accumulatedTime = LOOP_TIMINGS.stateDuration + LOOP_TIMINGS.glitchDuration)) {
        drawBanish(ctx, 1.0, time);
        drawGlitchDistortion(ctx, time);
      }
      // State 02: RISK
      else if (currentTimeMs < (accumulatedTime += LOOP_TIMINGS.stateDuration)) {
        drawRisk(ctx, 1.0, time);
      }
      // Glitch 2
      else if (currentTimeMs < (accumulatedTime += LOOP_TIMINGS.glitchDuration)) {
        drawRisk(ctx, 1.0, time);
        drawGlitchDistortion(ctx, time);
      }
      // State 03: RECEIVE
      else if (currentTimeMs < (accumulatedTime += LOOP_TIMINGS.stateDuration)) {
        drawReceive(ctx, 1.0, time);
      }
      // Glitch 3
      else {
        drawReceive(ctx, 1.0, time);
        drawGlitchDistortion(ctx, time);
      }
    }

    animationFrameId = requestAnimationFrame(runEntropyEngine);
  }

  // --- Interaction Event Handlers ---

  /**
   * Action 1: FREEZE THE FLOW
   * Collapse the active visual loop into one of the 3 states
   */
  btnFreeze.addEventListener('click', () => {
    if (isCollapsed || isCollapsing) return;

    isCollapsing = true;
    btnFreeze.disabled = true;
    
    // Visual indicator updates
    statusText.textContent = "DECRYPTION ACTIVE";
    statusText.classList.add('locked');
    statusDot.classList.remove('pulsing');
    statusDot.classList.add('locked');

    // Simulate collapse compression sequence
    setTimeout(() => {
      isCollapsing = false;
      isCollapsed = true;
      btnFreeze.disabled = false;

      // 1. Choose collapsed Sigil via "Bet with the Universe" random distribution
      collapsedSigilIndex = Math.floor(Math.random() * 3);
      const chosenSigil = SIGIL_DATA[collapsedSigilIndex];

      // 2. Generate cryptographically mapped receipt metadata
      const { seed, fullCode, displayHash } = generateSeedAndHash(chosenSigil.id);
      seedCode = seed;
      fullFulfillmentCode = fullCode;

      // 3. Inject details into Static Receipt Card elements
      receiptSigilName.textContent = chosenSigil.name;
      receiptSigilDesc.textContent = chosenSigil.desc;
      receiptSigilDirective.textContent = chosenSigil.directive;
      receiptSeed.textContent = fullCode;
      receiptHash.textContent = displayHash;
      
      const now = new Date();
      receiptTimestamp.textContent = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

      // 4. Reveal Receipt, Hide Invitation with clean fade animation
      cardInvitation.classList.add('hidden');
      cardReceipt.classList.remove('hidden');

      // Update HUD status label
      statusText.textContent = "BX SECURE COLLAPSE";

    }, 850); // Duration of collapse sequence
  });

  /**
   * Action 2: RELEASE TO FLOW
   * Resets locked state back to fast looping entropy engine
   */
  btnRelease.addEventListener('click', () => {
    isCollapsed = false;
    isCollapsing = false;
    
    // UI state restores
    cardReceipt.classList.add('hidden');
    cardInvitation.classList.remove('hidden');
    
    statusText.textContent = "ENTROPY ACTIVE";
    statusText.classList.remove('locked');
    statusDot.classList.add('pulsing');
    statusDot.classList.remove('locked');
  });

  // --- GIF Compiler Engine using GifShot ---

  btnGif.addEventListener('click', () => {
    if (!isCollapsed) return;

    // Transition panels
    cardReceipt.classList.add('hidden');
    cardProcessing.classList.remove('hidden');
    
    // Reset Progress indicators
    loaderProgressBar.style.width = '0%';
    loaderPercent.textContent = '0%';
    loaderStatus.textContent = 'PREPARING MATRIX FRAMEWORKS...';

    // 1. Instantiate Offscreen Canvas (prevents rendering directly on visible screen)
    const offscreen = document.createElement('canvas');
    offscreen.width = 400;
    offscreen.height = 400;
    const octx = offscreen.getContext('2d', { willReadFrequently: true });
    
    const frameImages = [];
    const numFrames = 15; // 1.5 second loop at 10 fps
    
    // Temporarily disable main draw rendering speed
    loaderProgressBar.style.width = '10%';
    loaderPercent.textContent = '10%';
    loaderStatus.textContent = 'CAPTURING GEOMETRIC CYCLES...';

    // 2. Offscreen Canvas Drawing loop to capture pulses and subtle glitches
    for (let f = 0; f < numFrames; f++) {
      clearCanvas(octx);
      
      // Calculate pulsing values
      const progress = f / numFrames;
      const angle = progress * Math.PI * 2;
      const scale = 0.90 + Math.sin(angle) * 0.05; // Gentle pulse in GIF card
      const mockTime = f * 3.5;
      
      // Draw standard sigil shapes
      if (collapsedSigilIndex === 0) {
        drawBanish(octx, scale, mockTime);
      } else if (collapsedSigilIndex === 1) {
        drawRisk(octx, scale, mockTime);
      } else {
        drawReceive(octx, scale, mockTime);
      }

      // Add a single heavy glitch frame inside the GIF loop for aesthetic authenticity
      if (f === 5 || f === 12) {
        // Draw chromatic RGB shifts
        octx.globalCompositeOperation = 'screen';
        octx.fillStyle = 'rgba(0, 243, 255, 0.45)';
        octx.fillRect(3, 0, 400, 400);
        octx.fillStyle = 'rgba(255, 0, 85, 0.45)';
        octx.fillRect(-3, 0, 400, 400);
        octx.globalCompositeOperation = 'source-over';
        
        // Draw glitch lines
        octx.strokeStyle = '#00f3ff';
        octx.lineWidth = 1.5;
        octx.beginPath();
        octx.moveTo(0, 180); octx.lineTo(400, 180);
        octx.moveTo(0, 260); octx.lineTo(400, 260);
        octx.stroke();
      }

      // 3. Render Card Metadata overlay (Seed, code text, stamp frame) directly in GIF!
      octx.strokeStyle = 'rgba(255,255,255,0.06)';
      octx.lineWidth = 1;
      octx.strokeRect(10, 10, 380, 380);

      // Monospace label logs printed at the bottom of the GIF card
      octx.fillStyle = 'rgba(255,255,255,0.2)';
      octx.font = "8px 'Share Tech Mono'";
      octx.textAlign = 'left';
      octx.fillText("DEC: BX-CHNC-SECURE-STABLE", 20, 380);
      
      octx.textAlign = 'right';
      octx.fillStyle = '#00f3ff';
      octx.fillText(fullFulfillmentCode, 380, 380);
      
      // Store the frame data URL
      frameImages.push(offscreen.toDataURL('image/png'));
    }

    loaderProgressBar.style.width = '30%';
    loaderPercent.textContent = '30%';
    loaderStatus.textContent = 'COMPILING ENCODERS...';

    // 4. Trigger Web Workers using Yahoo's gifshot.js library
    gifshot.createGIF({
      images: frameImages,
      gifWidth: 400,
      gifHeight: 400,
      interval: 0.1, // 100ms per frame
      progressCallback: (progressPercent) => {
        // gifshot returns a float from 0.0 to 1.0 representing render progress
        const computedPercent = Math.min(99, Math.round(30 + progressPercent * 70));
        loaderProgressBar.style.width = `${computedPercent}%`;
        loaderPercent.textContent = `${computedPercent}%`;
        loaderStatus.textContent = 'COMPILING MULTI-THREAD WORKERS...';
      }
    }, (obj) => {
      if (obj.error) {
        console.error('GIF Generation Error:', obj.error);
        alert(`Compilation Error: ${obj.error}`);
        
        // Reset view back to receipt
        cardProcessing.classList.add('hidden');
        cardReceipt.classList.remove('hidden');
        return;
      }

      // Success callback
      loaderProgressBar.style.width = '100%';
      loaderPercent.textContent = '100%';
      loaderStatus.textContent = 'COMPILATION COMPLETE!';

      setTimeout(() => {
        // Set image source preview
        gifPreview.src = obj.image;
        
        // Setup download link href and specific dynamic filename
        downloadGifLink.href = obj.image;
        downloadGifLink.download = `BLEXX_${seedCode}_${SIGIL_DATA[collapsedSigilIndex].id}.gif`;

        // Switch panel to Export View
        cardProcessing.classList.add('hidden');
        cardExport.classList.remove('hidden');
      }, 500);
    });
  });

  btnExportBack.addEventListener('click', () => {
    cardExport.classList.add('hidden');
    cardReceipt.classList.remove('hidden');
  });

  // --- Booting the Application ---
  runEntropyEngine();
});
