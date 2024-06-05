import { Component, ElementRef, AfterViewInit } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import { StartComponent } from './start/start.component';
import { AboutmeComponent } from './aboutme/aboutme.component';
import { ProjectService } from '../project.service';
import { ProjectOverviewComponent } from './project-overview/project-overview.component';
import { ScrollService } from '../scroll.service';

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
export class HomeComponent implements AfterViewInit {
  elementToScrollTo: string | undefined

  projectsArray: any[] = []
  projects: projects[] = [] // edited
  message: string = ''

  constructor(
    private elRef: ElementRef,
    private project: ProjectService,
    private scrollService: ScrollService
  ) {
    this.elementToScrollTo = this.project.getScollContent()
  }

  public scrollToTarget(target: string): void {
    if (target === 'home') {window.scrollTo({ top: 0, behavior: 'smooth' }); return} 
    if (target === 'footer') {window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); return}
    else {
      const targetElement = this.elRef.nativeElement.querySelector(`#${target}`);
      if (targetElement) {targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });}
    }
  }

  public ngAfterViewInit(): void {
    if (this.elementToScrollTo != undefined) {
      this.scrollToTarget(this.elementToScrollTo)
    }

    this.scrollService.currentMessage.subscribe(message => {
      this.message = message
      this.scrollToTarget(this.message)
    })
  }
}
