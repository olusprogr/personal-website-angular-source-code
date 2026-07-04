import { Component, AfterViewInit, ChangeDetectorRef, OnDestroy, ElementRef } from '@angular/core';

declare const VANTA: any;

@Component({
  selector: 'app-start',
  standalone: true,
  imports: [],
  templateUrl: './start.component.html',
  styleUrl: './start.component.css'
})
export class StartComponent implements AfterViewInit, OnDestroy {
  displayName: string = '';
  private fullName: string = 'Olivier Chodura';
  private timeout: any;
  private vantaEffect: any = null;
  private blockScroll = (e: Event) => e.preventDefault();
  private blockMouse = (e: Event) => e.stopImmediatePropagation();

  constructor(private cdr: ChangeDetectorRef, private elRef: ElementRef) {
    this.cdr.detach();
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
    this.initVanta();
    this.lockIntro();
    this.timeout = setTimeout(() => this.typeLoop(), 500);
  }

  ngOnDestroy(): void {
    clearTimeout(this.timeout);
    if (this.vantaEffect) this.vantaEffect.destroy();
    this.unlockIntro();
  }

  private lockIntro(): void {
    window.addEventListener('wheel', this.blockScroll, { passive: false });
    window.addEventListener('touchmove', this.blockScroll, { passive: false });
    window.addEventListener('mousemove', this.blockMouse, true);
  }

  private unlockIntro(): void {
    window.removeEventListener('wheel', this.blockScroll);
    window.removeEventListener('touchmove', this.blockScroll);
    window.removeEventListener('mousemove', this.blockMouse, true);
    if (this.vantaEffect) {
      this.vantaEffect.setOptions({ mouseControls: true, touchControls: true });
    }
  }

  private initVanta(): void {
    if (typeof VANTA !== 'undefined' && VANTA.NET) {
      const el = this.elRef.nativeElement.querySelector('.hero-section');
      this.vantaEffect = VANTA.NET({
        el,
        mouseControls: false,
        touchControls: false,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200,
        scale: 1.0,
        scaleMobile: 1.0,
        color: 0xd0d2f8,
        backgroundColor: 0xf8f7ff,
        points: 9,
        maxDistance: 22,
        spacing: 18,
        showDots: true
      });
    }
  }

  private typeLoop(): void {
    const typeDelay = 2000 / this.fullName.length;
    const deleteDelay = 2000 / this.fullName.length;
    let i = 0;

    const typeInterval = setInterval(() => {
      i++;
      this.displayName = this.fullName.slice(0, i);
      this.cdr.detectChanges();
      if (i >= this.fullName.length) {
        clearInterval(typeInterval);
        this.unlockIntro();
        this.timeout = setTimeout(() => {
          const deleteInterval = setInterval(() => {
            i--;
            this.displayName = this.fullName.slice(0, i);
            this.cdr.detectChanges();
            if (i <= 0) {
              clearInterval(deleteInterval);
              this.timeout = setTimeout(() => this.typeLoop(), 500);
            }
          }, deleteDelay);
        }, 8000);
      }
    }, typeDelay);
  }
}
