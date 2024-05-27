import { Component, ElementRef, AfterViewInit } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import { StartComponent } from './start/start.component';
import { AboutmeComponent } from './aboutme/aboutme.component';
import { ProjectService } from '../project.service';
import { ProjectOverviewComponent } from './project-overview/project-overview.component';

import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';


type projects = {
  title: string,
  description: string,
  link: string
  img: string
}


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NavbarComponent,
    StartComponent,
    AboutmeComponent,
    CommonModule,
    RouterModule,
    ProjectOverviewComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  elementToScrollTo: string | undefined

  projectsArray: any[] = []
  projects: projects[] = [] // edited

  constructor(
    private elRef: ElementRef,
    private project: ProjectService
  ) {
    this.elementToScrollTo = this.project.getScollContent()
  }

  public ngAfterViewInit(): void {
    if (this.elementToScrollTo != undefined) {
      this.scrollToTarget(this.elementToScrollTo)
    }
  }

  private scrollToTarget(target: string): void {
    const targetElement = this.elRef.nativeElement.querySelector(`#${target}`);
    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
