import { Component } from '@angular/core'
import { ScrollService } from '../../scroll.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  menuOpen: boolean = false;

  constructor(
    private scrollService: ScrollService
  ) {}

  public scrollToTarget(target: string): void {
    this.menuOpen = false;
    this.scrollService.changeMessage(target)
  }

  public toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }
}
