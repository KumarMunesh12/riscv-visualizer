import { useEffect, useRef } from 'react';

// ─── Configuration ────────────────────────────────────────────────────────────
const CONFIG = {
  COUNT: 80,           // number of particles
  MAX_SPEED: 0.4,      // max drift speed
  MIN_RADIUS: 1.5,     // smallest particle radius
  MAX_RADIUS: 4.5,     // largest particle radius
  CONNECTION_DIST: 130,// max px distance to draw a connecting line
  BOUNCE_DAMPING: 0.7, // velocity damping on edge bounce
  MOUSE_RADIUS: 120,   // repel radius around cursor
  MOUSE_FORCE: 0.06,   // repel strength

  // Colors tuned to match the dark terminal palette
  COLORS: [
    'rgba(249,115,22,',   // orange  – opcode
    'rgba(167,139,250,',  // purple  – rd
    'rgba(96,165,250,',   // blue    – rs1
    'rgba(52,211,153,',   // green   – funct3
    'rgba(244,114,182,',  // pink    – rs2
    'rgba(251,191,36,',   // yellow  – funct7
  ],
};

// ─── Particle class ───────────────────────────────────────────────────────────
class Particle {
  constructor(w, h) {
    this.reset(w, h);
    // start at a random position rather than edges
    this.x = Math.random() * w;
    this.y = Math.random() * h;
  }

  reset(w, h) {
    this.w = w;
    this.h = h;
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.vx = (Math.random() - 0.5) * CONFIG.MAX_SPEED * 2;
    this.vy = (Math.random() - 0.5) * CONFIG.MAX_SPEED * 2;
    this.radius = CONFIG.MIN_RADIUS + Math.random() * (CONFIG.MAX_RADIUS - CONFIG.MIN_RADIUS);
    this.colorBase = CONFIG.COLORS[Math.floor(Math.random() * CONFIG.COLORS.length)];
    this.alpha = 0.25 + Math.random() * 0.55;
    this.pulseOffset = Math.random() * Math.PI * 2;
    this.pulseSpeed = 0.008 + Math.random() * 0.012;
  }

  update(t, mouse) {
    // mouse repulsion
    if (mouse.x !== null) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < CONFIG.MOUSE_RADIUS && dist > 0) {
        const force = (CONFIG.MOUSE_RADIUS - dist) / CONFIG.MOUSE_RADIUS;
        this.vx += (dx / dist) * force * CONFIG.MOUSE_FORCE * 6;
        this.vy += (dy / dist) * force * CONFIG.MOUSE_FORCE * 6;
      }
    }

    // velocity cap
    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (speed > CONFIG.MAX_SPEED * 3) {
      this.vx = (this.vx / speed) * CONFIG.MAX_SPEED * 3;
      this.vy = (this.vy / speed) * CONFIG.MAX_SPEED * 3;
    }

    // gentle return to max speed if almost stopped
    if (speed < CONFIG.MAX_SPEED * 0.2) {
      this.vx += (Math.random() - 0.5) * 0.02;
      this.vy += (Math.random() - 0.5) * 0.02;
    }

    this.x += this.vx;
    this.y += this.vy;

    // bounce off edges
    if (this.x < this.radius) { this.x = this.radius; this.vx *= -CONFIG.BOUNCE_DAMPING; }
    if (this.x > this.w - this.radius) { this.x = this.w - this.radius; this.vx *= -CONFIG.BOUNCE_DAMPING; }
    if (this.y < this.radius) { this.y = this.radius; this.vy *= -CONFIG.BOUNCE_DAMPING; }
    if (this.y > this.h - this.radius) { this.y = this.h - this.radius; this.vy *= -CONFIG.BOUNCE_DAMPING; }

    // pulsing alpha
    this.currentAlpha = this.alpha * (0.7 + 0.3 * Math.sin(t * this.pulseSpeed + this.pulseOffset));
  }

  draw(ctx, t) {
    const r = this.radius * (0.85 + 0.15 * Math.sin(t * this.pulseSpeed * 0.7 + this.pulseOffset));

    // outer glow
    const glow = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, r * 3.5);
    glow.addColorStop(0, this.colorBase + (this.currentAlpha * 0.5).toFixed(3) + ')');
    glow.addColorStop(1, this.colorBase + '0)');
    ctx.beginPath();
    ctx.arc(this.x, this.y, r * 3.5, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();

    // core circle
    ctx.beginPath();
    ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
    ctx.fillStyle = this.colorBase + this.currentAlpha.toFixed(3) + ')';
    ctx.fill();

    // bright center specular
    ctx.beginPath();
    ctx.arc(this.x - r * 0.25, this.y - r * 0.25, r * 0.35, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,' + (this.currentAlpha * 0.6).toFixed(3) + ')';
    ctx.fill();
  }
}

// ─── Draw connections between nearby particles ────────────────────────────────
function drawConnections(ctx, particles) {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const a = particles[i];
      const b = particles[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < CONFIG.CONNECTION_DIST) {
        const opacity = (1 - dist / CONFIG.CONNECTION_DIST) * 0.18;
        // gradient line between the two particle colors
        const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
        grad.addColorStop(0, a.colorBase + opacity.toFixed(3) + ')');
        grad.addColorStop(1, b.colorBase + opacity.toFixed(3) + ')');
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  }
}

// ─── React component ──────────────────────────────────────────────────────────
export default function ParticleBackground() {
  const canvasRef = useRef(null);
  const stateRef  = useRef({ particles: [], mouse: { x: null, y: null }, raf: null, t: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const state = stateRef.current;

    // ── resize handler
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight;
      // resize existing particles' bounds
      state.particles.forEach(p => { p.w = canvas.width; p.h = canvas.height; });
    };

    // ── init particles
    const init = () => {
      resize();
      state.particles = Array.from({ length: CONFIG.COUNT }, () =>
        new Particle(canvas.width, canvas.height)
      );
    };

    // ── mouse tracking
    const onMouseMove = (e) => {
      state.mouse.x = e.clientX;
      state.mouse.y = e.clientY + window.scrollY;
    };
    const onMouseLeave = () => { state.mouse.x = null; state.mouse.y = null; };

    // ── animation loop
    const tick = () => {
      state.t++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // subtle radial vignette
      const vignette = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, canvas.height * 0.1,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.8
      );
      vignette.addColorStop(0, 'rgba(0,0,0,0)');
      vignette.addColorStop(1, 'rgba(0,0,0,0.35)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // update + draw connections first (behind particles)
      state.particles.forEach(p => p.update(state.t, state.mouse));
      drawConnections(ctx, state.particles);
      state.particles.forEach(p => p.draw(ctx, state.t));

      state.raf = requestAnimationFrame(tick);
    };

    init();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);
    tick();

    return () => {
      cancelAnimationFrame(state.raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',   // clicks pass through to the UI below
        zIndex: 0,
      }}
      aria-hidden="true"
    />
  );
}
