import { Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  // index.html sets data-theme before first paint, so we only read it here.
  readonly theme = signal<Theme>(
    document.documentElement.dataset['theme'] === 'dark' ? 'dark' : 'light'
  );

  /** Switches the theme. With an origin point the new theme grows out of it as a circle. */
  toggle(origin?: { x: number; y: number }): void {
    const next: Theme = this.theme() === 'dark' ? 'light' : 'dark';
    const apply = () => {
      document.documentElement.dataset['theme'] = next;
      this.theme.set(next);
      try { localStorage.setItem('theme', next); } catch { /* private mode */ }
    };

    const doc = document as any;
    if (!origin || typeof doc.startViewTransition !== 'function') {
      apply();
      return;
    }

    const radius = Math.hypot(
      Math.max(origin.x, window.innerWidth - origin.x),
      Math.max(origin.y, window.innerHeight - origin.y)
    );
    const transition = doc.startViewTransition(apply);
    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${origin.x}px ${origin.y}px)`,
            `circle(${radius}px at ${origin.x}px ${origin.y}px)`
          ]
        },
        { duration: 550, easing: 'ease-in-out', pseudoElement: '::view-transition-new(root)' }
      );
    }).catch(() => { /* transition skipped, theme is applied anyway */ });
  }
}
