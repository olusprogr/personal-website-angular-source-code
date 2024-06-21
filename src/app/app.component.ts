import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { CommonModule } from '@angular/common';
import { ProjectService } from './project.service';

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
  isLoading: boolean = true;

  constructor(private project: ProjectService) {}

  ngOnInit() {
    this.checkIfProjectDataIsAvailable()
  }

  private async checkIfProjectDataIsAvailable() {
    while (true) {
      await new Promise(r => setTimeout(r, 1000));
      const asw = this.project.checkIfDataIsAvailable()
      console.log(asw)
      if (asw === true) {
        this.isLoading = false;
        break
      }
    }
  }
}
