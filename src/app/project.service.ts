import { Injectable } from '@angular/core';
import * as projectData from '../assets/json/project-template.json'

type projectView = {
  title: string,
  description: string,
  link: string
  img: string
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  projectViewArray: any[] = [];
  projects: projectView[] = [
    {
      title: "",
      description: "",
      link: "",
      img: ""
    },
  ]
  public lastTimeUpdated: string = "09 JUNE 2024"
  resultForThisSpecificProjectDataMethod: any = {}
  resultForThisGetProjectName: string = ""
  project: any
  projectString: string = ""
  scroolContent: string | undefined = undefined 

  constructor(

  ) {
    this.projects.pop()
  
    for (let key of Object.keys(projectData)) {
      const value = projectData[key as keyof typeof projectData]
  
      if (value.view) {
        let projectData1: any = {}
  
        for (let viewElementKey in value.view) {
          projectData1[viewElementKey] = value.view[viewElementKey as keyof typeof value.view];
        }
        this.projects.push(projectData1)
      }
    }
    this.projectViewArray = Object.values(this.projects)
  }

  public getProjectViews(): projectView[] {
    return this.projectViewArray
  }

  public specificProjectData(projectString: string): {} {
    Object.keys(projectData).forEach((key) => {
      const project = projectData[key as keyof typeof projectData]
      if (project && project.view && project.view['project-title'] === projectString) {
        this.projectString = projectString
        this.resultForThisSpecificProjectDataMethod = project
      }
    })
    return this.resultForThisSpecificProjectDataMethod
  }

  public getProjectName(): string {
    Object.keys(projectData).forEach((key) => {
      const project = projectData[key as keyof typeof projectData]
      if (project && project.view && project.view['project-title'] === this.projectString) {
        this.resultForThisGetProjectName = project.view['project-title']
      }
    })
    return this.resultForThisGetProjectName
  }

  public getScollContent(): string | undefined {
    return this.scroolContent
  }

  public setScollContent(content: string): void {
    this.scroolContent = content
  }
}
