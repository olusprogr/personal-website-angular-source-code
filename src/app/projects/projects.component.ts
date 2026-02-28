import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ElementRef } from '@angular/core';
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
    private cdr: ChangeDetectorRef,
  ) {
    this.lastTimeUpdated = project.getLastTimeUpdated()
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
      await new Promise(r => setTimeout(r, 200));
      this.currentProjectData = this.project.specificProjectData(this.name)

      if (this.currentProjectData) {
        this.cdr.detectChanges()
        break
      }
    }
  }

  closeNot() {this.notification = false}
}
