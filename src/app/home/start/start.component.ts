import { Component, AfterViewInit, ChangeDetectorRef, OnDestroy } from '@angular/core';

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

  constructor(private cdr: ChangeDetectorRef) {
    this.cdr.detach();
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
    this.timeout = setTimeout(() => this.typeLoop(), 500);
  }

  ngOnDestroy(): void {
    clearTimeout(this.timeout);
  }

  private typeLoop(): void {
    const typeDelay = 2000 / this.fullName.length;
    const deleteDelay = 2000 / this.fullName.length;
    let i = 0;

    // Phase 1: Type (2s)
    const typeInterval = setInterval(() => {
      i++;
      this.displayName = this.fullName.slice(0, i);
      this.cdr.detectChanges();
      if (i >= this.fullName.length) {
        clearInterval(typeInterval);
        // Phase 2: Hold (6s)
        this.timeout = setTimeout(() => {
          // Phase 3: Delete (2s)
          const deleteInterval = setInterval(() => {
            i--;
            this.displayName = this.fullName.slice(0, i);
            this.cdr.detectChanges();
            if (i <= 0) {
              clearInterval(deleteInterval);
              // Phase 4: Restart typing (2s type -> 6s hold -> 2s delete -> ...)
              this.timeout = setTimeout(() => this.typeLoop(), 500);
            }
          }, deleteDelay);
        }, 8000);
      }
    }, typeDelay);
  }
}
