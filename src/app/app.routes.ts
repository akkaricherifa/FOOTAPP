import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DetailsComponent } from './details/details.component';
import { AccueilComponent } from './accueil/accueil.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'team/:id', component: DetailsComponent },
    { path: 'accueil', component: AccueilComponent },
    { path: '', redirectTo: '/accueil', pathMatch: 'full' } // Redirection vers 'accueil' par défaut
];
