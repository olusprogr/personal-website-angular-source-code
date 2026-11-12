import { Component, ElementRef, HostListener, ViewChild, computed, effect, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PaletteService } from './palette.service';
import { ProjectService } from '../../project.service';
import { ScrollService } from '../../scroll.service';
import { ThemeService } from '../../theme.service';

interface Command {
  group: 'Go to' | 'Projects' | 'Actions';
  label: string;
  hint?: string;
  keywords?: string;
  run: () => void;
}

@Component({
  selector: 'app-command-palette',
  standalone: true,
  templateUrl: './command-palette.component.html',
  styleUrl: './command-palette.component.css'
})
export class CommandPaletteComponent {
  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;
  @ViewChild('list') list?: ElementRef<HTMLElement>;

  readonly query = signal('');
  readonly activeIndex = signal(0);
  readonly notice = signal('');
  private readonly commands = signal<Command[]>([]);

  readonly results = computed(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) return this.commands();
    return this.commands().filter(c =>
      `${c.label} ${c.group} ${c.keywords ?? ''}`.toLowerCase().includes(q)
    );
  });

  constructor(
    public palette: PaletteService,
    private router: Router,
    private projects: ProjectService,
    private scroll: ScrollService,
    private theme: ThemeService
  ) {
    effect(() => {
      if (this.palette.isOpen()) {
        this.commands.set(this.buildCommands());
        this.query.set('');
        this.activeIndex.set(0);
        this.notice.set('');
        setTimeout(() => this.searchInput?.nativeElement.focus());
      }
    });
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      this.palette.toggle();
      return;
    }
    if (!this.palette.isOpen()) return;

    const count = this.results().length;
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        this.palette.close();
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (count) this.setActive((this.activeIndex() + 1) % count, true);
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (count) this.setActive((this.activeIndex() - 1 + count) % count, true);
        break;
      case 'Enter':
        e.preventDefault();
        this.runAt(this.activeIndex());
        break;
    }
  }

  onInput(value: string): void {
    this.query.set(value);
    this.activeIndex.set(0);
  }

  setActive(index: number, scrollIntoView = false): void {
    this.activeIndex.set(index);
    if (scrollIntoView) {
      setTimeout(() => {
        this.list?.nativeElement
          .querySelector('.palette-item.active')
          ?.scrollIntoView({ block: 'nearest' });
      });
    }
  }

  runAt(index: number): void {
    const command = this.results()[index];
    if (command) command.run();
  }

  /** True when this row is the first of its group, so the template prints the group label. */
  startsGroup(index: number): boolean {
    const items = this.results();
    return index === 0 || items[index - 1].group !== items[index].group;
  }

  private buildCommands(): Command[] {
    const section = (label: string, target: string, keywords = ''): Command => ({
      group: 'Go to', label, keywords, run: () => this.goToSection(target)
    });

    const projectCommands: Command[] = (this.projects.getProjectViews() ?? []).map(p => ({
      group: 'Projects' as const,
      label: p.title,
      hint: p.subtitle,
      keywords: p.description,
      run: () => this.openProject(p.title)
    }));

    const dark = this.theme.theme() === 'dark';

    return [
      section('Home', 'home', 'start top'),
      section('About me', 'aboutme', 'skills experience beginning'),
      section('My journey', 'timeline', 'timeline history'),
      section('Projects', 'projects', 'work stuff'),
      section('Contact', 'footer', 'email message'),
      {
        group: 'Go to',
        label: 'Impressum',
        keywords: 'legal notice imprint address',
        run: () => { this.palette.close(); this.router.navigate(['/impressum']); }
      },
      ...projectCommands,
      {
        group: 'Actions',
        label: dark ? 'Switch to light mode' : 'Switch to dark mode',
        keywords: 'theme dark light color',
        run: () => { this.palette.close(); this.theme.toggle(); }
      },
      {
        group: 'Actions',
        label: 'Copy email address',
        hint: 'olusprogr@gmail.com',
        keywords: 'mail contact',
        run: () => this.copyEmail()
      },
      {
        group: 'Actions',
        label: 'Open GitHub profile',
        hint: 'github.com/olusprogr',
        keywords: 'code repo',
        run: () => { this.palette.close(); window.open('https://github.com/olusprogr', '_blank', 'noopener'); }
      }
    ];
  }

  private onHomePage(): boolean {
    return this.router.url.startsWith('/home') && !this.router.url.startsWith('/home/project');
  }

  private goToSection(target: string): void {
    this.palette.close();
    if (this.onHomePage()) {
      this.scroll.changeMessage(target);
    } else {
      // HomeComponent scrolls to these once it has rendered.
      this.projects.setScrollContent(target);
      this.scroll.changeMessage(target);
      this.router.navigate(['/home']);
    }
  }

  private openProject(title: string): void {
    this.palette.close();
    if (this.onHomePage()) {
      this.router.navigate(['/home/project', title]);
    } else {
      // The project page only reads its route param on init, so going from one project
      // to another needs a fresh component instance.
      this.router.navigateByUrl('/home', { skipLocationChange: true })
        .then(() => this.router.navigate(['/home/project', title]));
    }
  }

  private async copyEmail(): Promise<void> {
    try {
      await navigator.clipboard.writeText('olusprogr@gmail.com');
      this.notice.set('Email address copied');
    } catch {
      this.notice.set('Could not copy. The address is olusprogr@gmail.com');
    }
    setTimeout(() => this.palette.close(), 1100);
  }
}
