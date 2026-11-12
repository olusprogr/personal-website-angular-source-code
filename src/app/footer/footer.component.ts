import { Component, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { ParticleCanvasComponent } from '../shared/particle-canvas/particle-canvas.component';
import { ProjectService } from '../project.service';
import { RouterLink } from '@angular/router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ParticleCanvasComponent, RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements AfterViewInit {
  lastTimeUpdatet: string = ""
  year: number = new Date().getFullYear()

  constructor(private projectService: ProjectService) {
    this.lastTimeUpdatet = this.projectService.getLastTimeUpdated()
  }

  ngAfterViewInit(): void {
    // intentionally empty - CSS handles footer animations
  }
}
