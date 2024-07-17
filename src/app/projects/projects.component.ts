import { AfterViewInit, Component, Input, OnInit, ElementRef } from '@angular/core';
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
export class ProjectsComponent implements OnInit, AfterViewInit{
  @Input() name: string = ''
  currentProjectData: any = undefined
  notification: boolean = true
  lastTimeUpdated: string = "Error"

  constructor(
    private project: ProjectService,
    private elRef: ElementRef,
  ) {
    this.lastTimeUpdated = project.getLastTimeUpdated()
    this.checkIfProjectDataIsAvailable()
  }


  ngAfterViewInit(target: string = "header"): void {
    const targetElement = this.elRef.nativeElement.querySelector(`#${target}`);
    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  ngOnInit(): void {
    this.checkIfProjectDataIsAvailable()
  }

  private async checkIfProjectDataIsAvailable() {
    while (true) {
      await new Promise(r => setTimeout(r, 1000));
      this.currentProjectData = this.project.specificProjectData(this.name)

      if (this.currentProjectData !== undefined) {break}
    }
  }

  closeNot() {this.notification = false}
}
