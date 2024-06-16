import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../project.service';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{

  title: string = "Could not load title"

  constructor(
    public projectService: ProjectService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.checkIfProjectIsAvailable()
  }

  public navigateToHome(): void {
    this.projectService.setScrollContent("projects")
    this.router.navigate(['/home'])
  }

  private async checkIfProjectIsAvailable() {
    while (true) {
      await new Promise(r => setTimeout(r, 1000));
      this.title = this.projectService.getProjectName()!
      if (this.title != "Could not load title") {
        break;
      }
    }
  }
}
