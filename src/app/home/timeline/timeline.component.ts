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
      description: 'Watched way too many YouTube tutorials and slowly stopped feeling lost. Print statements everywhere. Built a number guessing game and a calculator that could barely divide, my first two real exercises. Copy-pasted a lot of code I didn\'t understand yet.',
      tags: ['Python', 'Tutorials', 'Beginner stuff']
    },
    {
      year: '2022',
      title: 'Got into Object Oriented Programming',
      description: 'Made a Tkinter app based on my school cafeteria menu. It worked. This is also where I got into object oriented programming. I took it further later with a small banking system in Python and SQL. Around the same time, I used C++ in school to build and automate small robots.',
      tags: ['Python', 'Tkinter', 'OOP', 'First real project']
    },
    {
      year: '2023',
      title: 'Architect and my first website',
      description: 'Kept adding features to Architect until it turned into a proper project. Learned about APIs, async, and how databases actually work when you break them. It was also my first real team and project based development, five of us learning Git and GitHub for version control. Around the same time I wanted a place to show my own stuff, so I started learning HTML/CSS and eventually Angular. This portfolio is basically the result. Getting it online meant learning about domains, routing, and network traffic through Cloudflare. I also did my first internship that year, at Atruvia in Münster, building with Angular on a real team.',
      tags: ['Discord bot', 'APIs', 'Async', 'SQLite', 'Angular', 'TypeScript', 'Web dev']
    },
    {
      year: '2024',
      title: 'Self hosting and my first game',
      description: 'Got a Raspberry Pi running Linux, put my bot on it, and figured out cron, SSH, and why not to run things as root. That Pi became my first home server, and Linux became something I kept building on. Around the same time I built Battleship with Phaser 3 and Vite, my first real dive into game dev, with a small Node and Python backend for multiplayer room codes.',
      tags: ['Linux', 'RaspiOS', 'Self hosting', 'Phaser', 'JavaScript', 'Game dev']
    },
    {
      year: '2025',
      title: 'Deeper into algorithms',
      description: 'Went deeper into algorithms with Java and SQL databases. Basically same as before, just harder problems.',
      tags: ['Java', 'SQL']
    },
    {
      year: '2026',
      title: 'Still at it',
      description: 'Still building on the neural network from my school thesis. Software is shifting hard toward AI, and I want to actually understand what that changes about how we build things, not just react to it.',
      tags: ['Machine Learning', 'AI']
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
        scrollTrigger: { trigger: '.timeline', start: 'top 70%', end: 'bottom 85%', scrub: 1 },
        scaleY: 1, ease: 'none'
      }
    );

    gsap.fromTo('.timeline-line-arrow',
      { top: '0%' },
      {
        scrollTrigger: { trigger: '.timeline', start: 'top 70%', end: 'bottom 85%', scrub: 1 },
        top: '100%', ease: 'none'
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
