import { ChangeDetectorRef, Component, OnInit, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { ProjectService } from '../../project.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-project-overview',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
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
            }
          });
        },
        { threshold: 0.1 }
      );
      this.observer.observe(section);
    }
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
