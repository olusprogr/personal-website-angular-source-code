import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProjectService } from '../../project.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{

  title: string = "Could not load title"

  constructor(
    public projectService: ProjectService,
    private router: Router,
    private cdr: ChangeDetectorRef
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
      await new Promise(r => setTimeout(r, 200));
      const name = this.projectService.getProjectName();
      if (name) {
        this.title = name;
        this.cdr.detectChanges();
        break;
      }
    }
  }
}
