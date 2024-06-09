import { Component } from '@angular/core';
import { ProjectService } from '../project.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  lastTimeUpdatet: string = ""

  constructor(
    private projectService: ProjectService,
  ) {
    this.lastTimeUpdatet = this.projectService.lastTimeUpdated
  }
}
