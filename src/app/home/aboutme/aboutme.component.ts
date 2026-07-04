import { Component, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { AboutmeService } from '../../aboutme.service';
import { CommonModule } from '@angular/common';
import { ParticleCanvasComponent } from '../../shared/particle-canvas/particle-canvas.component';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-aboutme',
  standalone: true,
  imports: [
    CommonModule,
    ParticleCanvasComponent
  ],
  templateUrl: './aboutme.component.html',
  styleUrl: './aboutme.component.css'
})
export class AboutmeComponent implements AfterViewInit, OnDestroy {

  aboutMeData: {}[] = [];
  toggledAboutMe: any;
  isRevealed: boolean = false;
  isTransitioning: boolean = false;
  private observer: IntersectionObserver | null = null;

  constructor(
    private aboutMe: AboutmeService,
    private elRef: ElementRef
  ) {
    this.aboutMeData = aboutMe.getAboutMe()
    this.toggledAboutMe = this.aboutMeData[0]
  }

  ngAfterViewInit(): void {
    const section = this.elRef.nativeElement.querySelector('.aboutme-section');
    if (section) {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              this.isRevealed = true;
            }
          });
        },
        { threshold: 0.15 }
      );
      this.observer.observe(section);
    }
    this.initGsap();
  }

  private initGsap(): void {
    // intentionally empty - CSS reveal handles aboutme animations
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  public changeText(text: string): void {
    this.isTransitioning = true;
    setTimeout(() => {
      this.toggledAboutMe = this.aboutMeData.find((element: any) => element.title === text);
      this.isTransitioning = false;
    }, 180);
  }
}
