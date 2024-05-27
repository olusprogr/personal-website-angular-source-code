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
    this.title = this.projectService.getProjectName()
  }

  navigateToHome(): void {
    this.projectService.setScollContent("projects")
    this.router.navigate(['/home'])
  }
}
