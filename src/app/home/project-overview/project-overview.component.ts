import { ChangeDetectorRef, Component, OnInit, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { ProjectService } from '../../project.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ParticleCanvasComponent } from '../../shared/particle-canvas/particle-canvas.component';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-project-overview',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ParticleCanvasComponent
  ],
  templateUrl: './project-overview.component.html',
  styleUrl: './project-overview.component.css'
})
export class ProjectOverviewComponent implements OnInit, AfterViewInit, OnDestroy {
  projectsArray: any[] = []
  isLoaded: boolean = false
  isSectionRevealed: boolean = false;
  private observer: IntersectionObserver | null = null;

  constructor(
    public projectService: ProjectService,
    private cdr: ChangeDetectorRef,
    private elRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.requestData()
  }

  ngAfterViewInit(): void {
    this.setupObserver();
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private setupObserver(): void {
    const section = this.elRef.nativeElement.querySelector('.projects-section');
    if (section) {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              this.isSectionRevealed = true;
              this.cdr.detectChanges();
              this.initGsapCards();
            }
          });
        },
        { threshold: 0.1 }
      );
      this.observer.observe(section);
    }
  }

  private initGsapCards(): void {
    // intentionally empty - CSS reveal handles project card animations
  }

  private async requestData() {
    while (true) {
      await new Promise(r => setTimeout(r, 100))
      const views = this.projectService.getProjectViews()
      if (views != null) {
        this.projectsArray = views
        this.isLoaded = true
        this.cdr.detectChanges()
        break
      }
    }
  }
}
