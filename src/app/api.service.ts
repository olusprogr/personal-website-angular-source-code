import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService implements OnInit{
  private baseUrl = 'https://my-project-api-cgm7.onrender.com/api/portfolio/'

  constructor(
    private http: HttpClient
  ) {
  }
  notes: any = [];

  public getAllProjects(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + 'getProjects');
  }

  ngOnInit() {
    this.getAllProjects();
  }
}
