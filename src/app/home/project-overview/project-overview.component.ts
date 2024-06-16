import { Component } from '@angular/core';
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
export class ProjectOverviewComponent {
  projectsArray: any[] = [];
  constructor(
    public projectService: ProjectService
  ) {
    this.projectsArray = projectService.getProjectViews()!
    this.requestData()
  }

  private async requestData() {
    while (true) {
      await new Promise(r => setTimeout(r, 500));
      this.projectsArray = this.projectService.getProjectViews()!
      if (this.projectsArray != null) {
        break;
      }
    }
  }
}
