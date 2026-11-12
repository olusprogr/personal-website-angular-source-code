import { Component, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';

type Particle = { x: number; y: number; vx: number; vy: number; r: number };

@Component({
  selector: 'app-particle-canvas',
  standalone: true,
  template: `<canvas class="particle-canvas"></canvas>`,
  styles: [`
    :host { display: contents; }
    .particle-canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
    }
  `]
})
export class ParticleCanvasComponent implements AfterViewInit, OnDestroy {
  private animFrameId = 0;
  private running = false;
  private visibility: IntersectionObserver | null = null;
  private cleanup: (() => void)[] = [];

  constructor(private elRef: ElementRef) {}

  ngAfterViewInit(): void {
    this.initCanvas();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animFrameId);
    this.visibility?.disconnect();
    this.cleanup.forEach(fn => fn());
  }

  private initCanvas(): void {
    const canvas = this.elRef.nativeElement.querySelector('.particle-canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d')!;
    const DIST = 100;
    const COUNT = 110;
    const MOUSE_DIST = 170;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    this.cleanup.push(() => window.removeEventListener('resize', resize));

    // The canvas ignores pointer events (content sits on top), so track the cursor on window.
    const mouse = { x: -9999, y: -9999 };
    const onMove = (e: PointerEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onLeave = () => { mouse.x = mouse.y = -9999; };
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    this.cleanup.push(() => window.removeEventListener('pointermove', onMove));
    this.cleanup.push(() => document.removeEventListener('pointerleave', onLeave));

    const particles: Particle[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 2 + 1.5
    }));

    const dist = (a: Particle, b: Particle) => Math.hypot(a.x - b.x, a.y - b.y);

    const draw = () => {
      const dark = document.documentElement.dataset['theme'] === 'dark';
      const rgb = dark ? '129,140,248' : '99,102,241';
      const boost = dark ? 1.8 : 1;

      const rect = canvas.getBoundingClientRect();
      const mx = mouse.x - rect.left;
      const my = mouse.y - rect.top;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        // Push particles away from the cursor a little.
        const dx = p.x - mx;
        const dy = p.y - my;
        const d = Math.hypot(dx, dy);
        if (d < MOUSE_DIST && d > 0.01) {
          const force = (1 - d / MOUSE_DIST) * 1.2;
          p.x += (dx / d) * force;
          p.y += (dy / d) * force;
        }

        if (p.x < 0) { p.x = 0; p.vx = Math.abs(p.vx); }
        if (p.x > canvas.width) { p.x = canvas.width; p.vx = -Math.abs(p.vx); }
        if (p.y < 0) { p.y = 0; p.vy = Math.abs(p.vy); }
        if (p.y > canvas.height) { p.y = canvas.height; p.vy = -Math.abs(p.vy); }
      }

      const used = new Array(particles.length).fill(false);

      for (let i = 0; i < particles.length - 2; i++) {
        if (used[i]) continue;
        let formedTriangle = false;
        for (let j = i + 1; j < particles.length - 1 && !formedTriangle; j++) {
          if (used[j]) continue;
          if (dist(particles[i], particles[j]) > DIST) continue;
          for (let k = j + 1; k < particles.length; k++) {
            if (used[k]) continue;
            if (dist(particles[i], particles[k]) > DIST) continue;
            if (dist(particles[j], particles[k]) > DIST) continue;
            used[i] = used[j] = used[k] = true;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.lineTo(particles[k].x, particles[k].y);
            ctx.closePath();
            ctx.fillStyle = `rgba(${rgb},${0.03 * boost})`;
            ctx.fill();
            ctx.strokeStyle = `rgba(${rgb},${0.1 * boost})`;
            ctx.lineWidth = 1;
            ctx.stroke();
            formedTriangle = true;
            break;
          }
        }
      }

      // Lines from the cursor to nearby particles.
      for (const p of particles) {
        const d = Math.hypot(p.x - mx, p.y - my);
        if (d < MOUSE_DIST) {
          ctx.beginPath();
          ctx.moveTo(mx, my);
          ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = `rgba(${rgb},${(1 - d / MOUSE_DIST) * 0.35 * boost})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb},${0.18 * boost})`;
        ctx.fill();
      }

      if (this.running) this.animFrameId = requestAnimationFrame(draw);
    };

    // Only animate while the canvas is on screen. There are three of them on the home page.
    this.visibility = new IntersectionObserver(entries => {
      const visible = entries.some(e => e.isIntersecting);
      if (visible && !this.running) {
        this.running = true;
        this.animFrameId = requestAnimationFrame(draw);
      } else if (!visible) {
        this.running = false;
        cancelAnimationFrame(this.animFrameId);
      }
    });
    this.visibility.observe(canvas);
  }
}
