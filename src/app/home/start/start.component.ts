import { Component, AfterViewInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ParticleCanvasComponent } from '../../shared/particle-canvas/particle-canvas.component';

@Component({
  selector: 'app-start',
  standalone: true,
  imports: [ParticleCanvasComponent],
  templateUrl: './start.component.html',
  styleUrl: './start.component.css'
})
export class StartComponent implements AfterViewInit, OnDestroy {
  displayName: string = '';
  private fullName: string = 'Olivier Chodura';
  private timeout: any;
  private blockScroll = (e: Event) => e.preventDefault();

  constructor(private cdr: ChangeDetectorRef) {
    this.cdr.detach();
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
    this.lockIntro();
    this.timeout = setTimeout(() => this.typeLoop(), 500);
  }

  ngOnDestroy(): void {
    clearTimeout(this.timeout);
    this.unlockIntro();
  }

  private lockIntro(): void {
    window.addEventListener('wheel', this.blockScroll, { passive: false });
    window.addEventListener('touchmove', this.blockScroll, { passive: false });
  }

  private unlockIntro(): void {
    window.removeEventListener('wheel', this.blockScroll);
    window.removeEventListener('touchmove', this.blockScroll);
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
