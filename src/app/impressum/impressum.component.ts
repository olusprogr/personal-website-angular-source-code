import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-impressum',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './impressum.component.html',
  styleUrl: './impressum.component.css'
})
export class ImpressumComponent implements OnInit {
  readonly owner = {
    name: 'Olivier Chodura',
    street: 'Legdenweg 114',
    city: '48161 Münster',
    country: 'Deutschland',
    email: 'olusprogr@gmail.com'
  };

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
}
