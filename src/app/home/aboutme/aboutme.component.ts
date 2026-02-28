import { Component, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
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
export class AboutmeComponent implements AfterViewInit, OnDestroy {

  aboutMeData: {}[] = [];
  toggledAboutMe: any;
  isRevealed: boolean = false;
  private observer: IntersectionObserver | null = null;

  constructor(
    private aboutMe: AboutmeService,
    private elRef: ElementRef
  ) {
    this.aboutMeData = aboutMe.getAboutMe()
    this.toggledAboutMe = this.aboutMeData[0]
  }

  ngAfterViewInit(): void {
    const section = this.elRef.nativeElement.querySelector('.aboutme-section');
    if (section) {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              this.isRevealed = true;
            }
          });
        },
        { threshold: 0.15 }
      );
      this.observer.observe(section);
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  public changeText(text: string): void {
    this.toggledAboutMe = this.aboutMeData.find((element: any) => element.title === text)
  }
}
