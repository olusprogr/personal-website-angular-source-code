import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProjectService } from '../../project.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-project-overview',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CommonModule
  ],
  templateUrl: './project-overview.component.html',
  styleUrl: './project-overview.component.css'
})
export class ProjectOverviewComponent implements OnInit {
  projectsArray: any[] = []
  isLoaded: boolean = false

  constructor(
    public projectService: ProjectService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.requestData()
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
