import { Component, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';

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

  constructor(private elRef: ElementRef) {}

  ngAfterViewInit(): void {
    this.initCanvas();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animFrameId);
  }

  private initCanvas(): void {
    const canvas = this.elRef.nativeElement.querySelector('.particle-canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d')!;
    const DIST = 100;
    const COUNT = 110;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    type Particle = { x: number; y: number; vx: number; vy: number; r: number };

    const particles: Particle[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 2 + 1.5
    }));

    const dist = (a: Particle, b: Particle) => Math.hypot(a.x - b.x, a.y - b.y);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
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
            ctx.fillStyle = 'rgba(99,102,241,0.03)';
            ctx.fill();
            ctx.strokeStyle = 'rgba(99,102,241,0.1)';
            ctx.lineWidth = 1;
            ctx.stroke();
            formedTriangle = true;
            break;
          }
        }
      }

      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(99,102,241,0.18)';
        ctx.fill();
      }

      this.animFrameId = requestAnimationFrame(draw);
    };

    draw();
  }
}
