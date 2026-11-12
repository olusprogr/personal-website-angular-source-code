import { AfterViewInit, Directive, ElementRef, Input, OnDestroy } from '@angular/core';

/** Counts from 0 to the given number once. Writes to the DOM directly, so it works in detached views. */
@Directive({
  selector: '[appCountUp]',
  standalone: true
})
export class CountUpDirective implements AfterViewInit, OnDestroy {
  @Input('appCountUp') target = 0;
  @Input() suffix = '';
  @Input() countDelay = 0;
  private frame = 0;
  private timer: any;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    const node = this.el.nativeElement;
    node.textContent = `0${this.suffix}`;
    this.timer = setTimeout(() => {
      const duration = 1200;
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        node.textContent = `${Math.round(eased * this.target)}${this.suffix}`;
        if (t < 1) this.frame = requestAnimationFrame(step);
      };
      this.frame = requestAnimationFrame(step);
    }, this.countDelay);
  }

  ngOnDestroy(): void {
    clearTimeout(this.timer);
    cancelAnimationFrame(this.frame);
  }
}
