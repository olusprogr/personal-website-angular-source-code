import { Component } from '@angular/core';
import { AboutmeService } from '../../aboutme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-aboutme',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './aboutme.component.html',
  styleUrl: './aboutme.component.css'
})
export class AboutmeComponent {

  aboutMeData: {}[] = [];
  toggledAboutMe: any;

  constructor(
    aboutMe: AboutmeService
  ) {
    this.aboutMeData = aboutMe.getAboutMe()
    this.toggledAboutMe = this.aboutMeData[0]
  }

  public changeText(text: string): void {
    this.toggledAboutMe = this.aboutMeData.find((element: any) => element.title === text)
  }
}
