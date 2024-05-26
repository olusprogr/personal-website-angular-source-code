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
  public lastTimeUpdated: string = "11 MAY 2024"

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

  public specificProjectData(projectString: string): any {
    let result: any;
    Object.keys(projectData).forEach((key) => {
      const project = projectData[key as keyof typeof projectData]
      if (project && project.view && project.view['project-title'] === projectString) {
        result = project
      }
    })
    return result
  }
}
