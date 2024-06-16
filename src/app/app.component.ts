import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { ApiService } from './api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    FooterComponent,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'website';
  message: string = '';
  isLoading: boolean = false;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    // this.apiService.getMessages().subscribe(
    //   (data: string) => this.message = data,
    //   (error: any) => console.log(error)
    // );
  }
}
