import { Component, HostListener, ChangeDetectionStrategy } from '@angular/core'
import { ScrollService } from '../../scroll.service';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../theme.service';
import { PaletteService } from '../../shared/command-palette/palette.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  menuOpen: boolean = false;
  scrollProgress: number = 0;
  activeSection: string = 'home';

  constructor(
    private scrollService: ScrollService,
    public theme: ThemeService,
    public palette: PaletteService
  ) {}

  public toggleTheme(event: MouseEvent): void {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    this.theme.toggle({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
  }

  @HostListener('window:scroll')
  onScroll(): void {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    this.scrollProgress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    const sections = ['footer', 'projects', 'timeline', 'home'];
    // 'home' is the fixed navbar itself, so it always matches as the fallback.
    for (const id of sections) {
      const el = document.getElementById(id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 150) {
          this.activeSection = id;
          break;
        }
      }
    }
  }

  public scrollToTarget(target: string): void {
    this.menuOpen = false;
    this.scrollService.changeMessage(target)
  }

  public toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }
}
