import { Component } from '@angular/core';

@Component({
  selector: 'app-tech-marquee',
  standalone: true,
  template: `
    <div class="marquee" aria-label="Technologies I use">
      <div class="marquee-track">
        @for (copy of [0, 1]; track copy) {
          <ul class="marquee-group" [attr.aria-hidden]="copy === 1 ? 'true' : null">
            @for (tech of techs; track tech) {
              <li class="marquee-item">{{ tech }}</li>
            }
          </ul>
        }
      </div>
    </div>
  `,
  styleUrl: './tech-marquee.component.css'
})
export class TechMarqueeComponent {
  readonly techs = [
    'Python', 'TypeScript', 'Angular', 'Node.js', 'Java', 'Linux', 'MongoDB', 'SQL',
    'Express', 'Tailwind', 'Phaser 3', 'NumPy', 'Bash', 'Git', 'AWS', 'Cloudflare', 'Raspberry Pi'
  ];
}
