import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { DetailsProduits } from './pages/details-produits/details-produits';
import { Dashboard } from './pages/dashboard/dashboard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'details', component: DetailsProduits },
  { path: 'dashboard', component: Dashboard },
  { path: '**', redirectTo: '' }
];