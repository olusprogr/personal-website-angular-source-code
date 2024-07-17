import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable , race } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://my-project-api-cgm7.onrender.com/api/portfolio/'
  private secondUrl = 'https://my-project-api-2.onrender.com/api/portfolio/'

  constructor(
    private http: HttpClient
  ) {
  }

  public getAllProjects(): Observable<any[]> {
    const asw = this.http.get<any[]>(this.baseUrl + 'getProjects');
    const asw2 = this.http.get<any[]>(this.secondUrl + 'getProjects');

    return race(asw, asw2);
  }
}
