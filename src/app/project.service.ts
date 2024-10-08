import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projectsFromApi: any[] = [];
  private projectViewArray: any[] = [];
  private currentProjectName: string = "No Project Selected";
  private scroolContent: string | undefined = undefined;

  constructor(private apiService: ApiService) {
    this.runGetAllProjectsMethodEveryXMilliseconds();
  }

  private async runGetAllProjectsMethodEveryXMilliseconds(): Promise<void> {
    while (true) {
      await new Promise(r => setTimeout(r, 500))
      this.getAllProjects()
      if (this.projectsFromApi.length > 0) {break}
    }
  }

  private getAllProjects(): void {
    this.apiService.getAllProjects().subscribe({
      next: (data) => {
        this.projectsFromApi = data.map((project: any) => project.data);
        this.createProjectViewArray();
      },
      error: (error) => {
        console.error('Error fetching projects!', error);
      }
    });
  }

  private createProjectViewArray(): void {
    this.projectViewArray = this.projectViewArray.filter(item => item !== undefined);

    this.projectViewArray = this.projectsFromApi.map((project: any) => ({
      title: project.view['project-title'],
      description: project.view['project-description'],
      link: project.view['project-link'],
      img: project.view['project-img']
    }));
  }

  public getProjectViews(): any[] | null {
    return this.projectViewArray.length > 0 ? this.projectViewArray : null;
  }

  public specificProjectData(projectString: string): any | null {
    const project = this.projectsFromApi.find((p: any) => p.view['project-title'] === projectString);
    if (project) {
      this.currentProjectName = project.view['project-title']
      return project
    }
    return null
  }

  public getProjectName(): string | null {
    const project = this.projectsFromApi.find((p: any) => p.view['project-title'] === this.currentProjectName);
    return project ? project.view['project-title'] : null
  }

  public getScrollContent(): string | undefined {
    return this.scroolContent
  }

  public setScrollContent(content: string): void {
    this.scroolContent = content
  }

  public getLastTimeUpdated(): string {
    return "08. September 2024"
  }

  public checkIfDataIsAvailable(): boolean {
    if (this.projectsFromApi != undefined || this.projectsFromApi != null) {
      return true
    } else {
      return false
    }
  }
}
