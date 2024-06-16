import { Injectable } from '@angular/core';
import * as projectData from '../assets/json/project-template.json'
import { ApiService } from './api.service'
import { Observable } from 'rxjs';

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

  projectViewArray: projectView[] = [];
  projects: any[] = []
  public lastTimeUpdated: string = "16 JUNE 2024"
  resultForThisSpecificProjectDataMethod: any = {}
  resultForThisGetProjectName: string = ""
  projectString: string = ""
  scroolContent: string | undefined = undefined 
  projectsFromApi: any[] = []

  constructor(
    private ApiService: ApiService
  ) {
    this.getAllProjects()
    setTimeout(() => {
      for (let key of this.projects) {
        this.projectsFromApi.push(key.data)
      }
      this.createProjectViewArray()
    }, 1000)
  }

  private createProjectViewArray(): void {
    this.projectViewArray = []
    for (let i of this.projectsFromApi) {
      this.projectViewArray.push({
        title: i.view['project-title'],
        description: i.view['project-description'],
        link: i.view['project-link'],
        img: i.view['project-img']
      })
    }
    console.log(this.projectViewArray)
  }

  public getProjectViews(): projectView[] | null {
    if (this.projectViewArray.length != 0) {
      return this.projectViewArray
    } else {
      return null
    }
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

  private getAllProjects(): void {
    this.ApiService.getAllProjects().subscribe({
      next: (data) => {
        this.projects = data
      },
      error: (error) => {
        console.error('There was an error!', error)
    }
  })
  }
}
