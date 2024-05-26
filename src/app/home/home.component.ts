import { Component, ElementRef, AfterViewInit } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import { StartComponent } from './start/start.component';
import { AboutmeComponent } from './aboutme/aboutme.component';

import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ProjectService } from '../project.service';
import * as data from '../../assets/json/project-template.json'
import { ProjectOverviewComponent } from './project-overview/project-overview.component';


type projects = {
  title: string,
  description: string,
  link: string
  img: string
}

type aboutMe = {
  title: string,
  description: string
  subTitle: string
  subDescription: string
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

  projectsArray: any[] = [];
  projects: projects[] = [
    {
      title: "",
      description: "",
      link: "",
      img: ""
    },
  ]

  aboutMe: aboutMe[] = [
    {
      title: "My Journey",
      description: "In the beginning, it was a challenge – the code looked like a complicated mix of letters and symbols. " +
      "I remember spending hours watching programming tutorials to learn the basics. " +
      "One day, I stumbled upon the fascinating of GUI programming with the Tkinter library. " +
      "It was a breakthrough! Suddenly, I could create my own user interfaces and bring my creative ideas to life. " +
      "One of my early projects was crafting a food ordering menu like that one at my school. " + 
      "With Tkinter, I could design interactive menus and implement ordering processes. Since then, I've steadily expanded my knowledge and worked on various projects. " +
      "Programming, for me, is a constant journey of discovery, and I look forward to realizing many exciting projects ahead.",
      subTitle: "Currently diving deep into Web Development and API's.",
      subDescription: "Now, let me take you through some of these projects..."
    },
    {
      title: "My Experience",
      description: "I bring 3 years of experience to the table, particularly in the realm of Python for the back-end and JavaScript for the front-end. " +
      "My expertise lies in GUI development and Object-Oriented Programming (OOP). " +
      "While I am still in the early stages of my web development journey, I am already proficient in coding entire pages using Angular. " +
      "Additionally, I have a foundational understanding of C++ from my school days, where I learned it at a basic level. " +
      "I approach my work with dedication and a commitment to continuous learning, always striving to enhance my skills and explore new horizons in programming.",
      subTitle: "Writing code since i was 13 years old.",
      subDescription: ""
    },
    {
      title: "Skills I have Learned",
      description: "Over the last three years, I've learned Python, diving into object-oriented programming, Tkinter, Pycord, and Sqlite. I've also spent a year getting familiar with JavaScript and Angular, covering basics and Angular materials. Plus, I've been using RaspiOS (Linux) for over a year, hosting my Discord bot and managing tasks with Crontab. Recently, I've been exploring Fast API, dedicating a month to grasp its basics.",
      subTitle: "Continuous learning with tools, frameworks and technologies...",
      subDescription: ""
    }
  ]

  toggledAboutMe: aboutMe = this.aboutMe[0]

  constructor(
    private elRef: ElementRef,
    private project: ProjectService
  ) {
    // this.elementToScrollTo = project.getScollContent()
  }

  ngAfterViewInit(): void {
    if (this.elementToScrollTo != undefined) {
      this.scrollToTarget(this.elementToScrollTo)
    }
  }

  changeText(sectionTitle: string): void {
    for (let element of this.aboutMe) {
      if (element.title === sectionTitle) {
        this.toggledAboutMe = element;
      }
    }
  }

  // onClick(project: string): void {
  //   this.project.setCurrentProject(project);
  // }

  scrollToTarget(target: string): void {
    const targetElement = this.elRef.nativeElement.querySelector(`#${target}`);
    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
