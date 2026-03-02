import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TimelineEntry {
  year: string;
  title: string;
  description: string;
  tags: string[];
}

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.css'
})
export class TimelineComponent implements OnInit {
  isSectionRevealed: boolean = false;
  revealedItems: boolean[] = [];

  entries: TimelineEntry[] = [
    {
      year: '2021',
      title: 'Started My Coding Journey',
      description: 'Discovered programming and began learning the fundamentals of Python.',
      tags: ['Python', 'Programming Basics', 'Learning']
    },
    {
      year: '2022',
      title: 'First Real Projects',
      description: 'Built my first food ordering application and started improving my object-oriented programming skills. Learned backend development with Python.',
      tags: ['Python', 'OOP', 'Backend Development', 'Projects']
    },
    {
      year: '2023',
      title: 'Developing Discord Bot',
      description: 'Created Architect to manage server activities and enhance user engagement. Gained experience with APIs and asynchronous programming as well as frontend development and Database management.',
      tags: ['Discord Bot', 'APIs', 'Asynchronous Programming', 'Frontend Development', 'Database Management', 'Projects', 'Team']
    },
    {
      year: '2023',
      title: 'Building My Portfolio',
      description: 'Focused on creating polished projects to showcase my skills. Meanwhile, I was also learning about web development and full stack development to get more reach.',
      tags: ['Web Development', 'Full Stack Development', 'Projects', 'Portfolio']
    },
    {
      year: '2024',
      title: 'Building Full Stack Web Applications and exploring Server Management',
      description: 'Expanded my knowledge in full stack development and began exploring server management and deployment strategies.',
      tags: ['Full Stack Development', 'Server Management', 'Deployment', 'Projects']
    },
    {
      year: '2025',
      title: 'Exploring Cloud Technologies and DevOps',
      description: 'Started learning about cloud platforms like AWS and Azure, as well as DevOps practices to streamline development and deployment processes.',
      tags: ['Cloud Technologies', 'AWS', 'Azure', 'DevOps', 'Learning']
    },
    {
      year: '2026',
      title: 'Continuing to Learn and Grow',
      description: 'Continuing to expand my knowledge in full stack development, Machine Learning, and Server Management practices.',
      tags: ['Full Stack Development', 'Machine Learning', 'Server Management']
    }
  ];

  constructor() {
    this.revealedItems = new Array(this.entries.length).fill(false);
  }

  ngOnInit(): void {
    this.checkScroll();
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
