import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProjectsComponent } from './projects/projects.component';
import { ImpressumComponent } from './impressum/impressum.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent, title: 'Olivier Chodura' },
    { path: 'home/project/:name', component: ProjectsComponent, title: 'Project · Olivier Chodura'},
    { path: 'impressum', component: ImpressumComponent, title: 'Impressum · Olivier Chodura' }
];
