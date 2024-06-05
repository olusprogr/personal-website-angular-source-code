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
  constructor(
    private scrollService: ScrollService
  ) {}

  public scrollToTarget(target: string): void {
    this.scrollService.changeMessage(target)
  }
}
