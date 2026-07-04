import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParticleCanvasComponent } from '../../shared/particle-canvas/particle-canvas.component';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface TimelineEntry {
  year: string;
  title: string;
  description: string;
  tags: string[];
}

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule, ParticleCanvasComponent],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.css'
})
export class TimelineComponent implements OnInit, AfterViewInit {
  isSectionRevealed: boolean = false;
  revealedItems: boolean[] = [];

  entries: TimelineEntry[] = [
    {
      year: '2021',
      title: 'Wrote my first line of Python',
      description: 'Watched way too many YouTube tutorials and slowly stopped feeling lost. Print statements everywhere.',
      tags: ['Python', 'Tutorials', 'Beginner stuff']
    },
    {
      year: '2022',
      title: 'Built the food ordering thing',
      description: 'Made a Tkinter app based on my school cafeteria menu. It was clunky, but it worked, and that was the moment I got hooked.',
      tags: ['Python', 'Tkinter', 'OOP', 'First real project']
    },
    {
      year: '2023',
      title: 'Started building Architect (Discord bot)',
      description: 'Kept adding features until it turned into a proper project. Learned about APIs, async, and how databases actually work when you break them.',
      tags: ['Discord bot', 'APIs', 'Async', 'SQLite']
    },
    {
      year: '2023',
      title: 'Jumped into web dev',
      description: 'Wanted a place to show my stuff, so I started learning HTML/CSS and eventually Angular. This portfolio is basically the result.',
      tags: ['Angular', 'TypeScript', 'Web dev']
    },
    {
      year: '2024',
      title: 'Started hosting my own stuff',
      description: 'Got a Raspberry Pi running Linux, put my bot on it, and figured out cron, SSH, and why not to run things as root.',
      tags: ['Linux', 'RaspiOS', 'Self hosting']
    },
    {
      year: '2026',
      title: 'Still at it',
      description: 'Digging into APIs with Express, some ML on the side, and messing around with AWS. Basically same as before, just harder problems.',
      tags: ['ExpressJS', 'AWS', 'Machine Learning']
    }
  ];

  constructor() {
    this.revealedItems = new Array(this.entries.length).fill(false);
  }

  ngOnInit(): void {
    this.checkScroll();
  }

  ngAfterViewInit(): void {
    this.initGsap();
  }

  private initGsap(): void {
    gsap.fromTo('.timeline-line',
      { scaleY: 0, transformOrigin: 'top center' },
      {
        scrollTrigger: { trigger: '.timeline', start: 'top 75%', end: 'bottom 20%', scrub: 1 },
        scaleY: 1, ease: 'none'
      }
    );
  }

  @HostListener('window:scroll')
  checkScroll(): void {
    const section = document.getElementById('timeline');
    if (section) {
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.75) {
        this.isSectionRevealed = true;
      }
    }

    const items = document.querySelectorAll('.timeline-item');
    items.forEach((item, index) => {
      const rect = item.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.85) {
        this.revealedItems[index] = true;
      }
    });
  }
}
