import { Component, AfterViewInit } from '@angular/core';
import { ParticleCanvasComponent } from '../shared/particle-canvas/particle-canvas.component';
import { ProjectService } from '../project.service';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [ParticleCanvasComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements AfterViewInit {
  lastTimeUpdatet: string = ""

  constructor(private projectService: ProjectService) {
    this.lastTimeUpdatet = this.projectService.getLastTimeUpdated()
  }

  ngAfterViewInit(): void {
    // intentionally empty - CSS handles footer animations
  }
}
