import { Directive, ElementRef, HostListener, Input } from '@angular/core';

/**
 * Tilts the host towards the cursor and exposes the cursor position as CSS variables:
 * --rx / --ry (rotation) and --spot-x / --spot-y (for a spotlight gradient).
 * The host's stylesheet decides what to do with them via the `.tilting` class.
 */
@Directive({
  selector: '[appTilt]',
  standalone: true
})
export class TiltDirective {
  @Input() tiltMax = 5;
  private frame = 0;
  private readonly enabled = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  constructor(private el: ElementRef<HTMLElement>) {}

  @HostListener('pointermove', ['$event'])
  onMove(e: PointerEvent): void {
    if (!this.enabled) return;
    cancelAnimationFrame(this.frame);
    this.frame = requestAnimationFrame(() => {
      const host = this.el.nativeElement;
      const rect = host.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      host.style.setProperty('--ry', `${(px - 0.5) * 2 * this.tiltMax}deg`);
      host.style.setProperty('--rx', `${(0.5 - py) * 2 * this.tiltMax}deg`);
      host.style.setProperty('--spot-x', `${px * 100}%`);
      host.style.setProperty('--spot-y', `${py * 100}%`);
      host.classList.add('tilting');
    });
  }

  @HostListener('pointerleave')
  onLeave(): void {
    cancelAnimationFrame(this.frame);
    this.el.nativeElement.classList.remove('tilting');
  }
}
