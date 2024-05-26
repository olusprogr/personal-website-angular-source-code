import { Component, Input, OnInit } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { ProjectService } from '../project.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    HeaderComponent,
    CommonModule
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent implements OnInit{
  @Input() name: string = ''
  currentProjectData: any = {}
  notification: boolean = true
  lastTimeUpdated: string = "Error"

  constructor(
    private project: ProjectService
  ) {
    this.lastTimeUpdated = project.lastTimeUpdated
  }

  ngOnInit(): void {
    this.currentProjectData = this.project.specificProjectData(this.name)
    console.log(this.currentProjectData['view']['project-title'])
  }

  closeNot() {this.notification = false}
}
