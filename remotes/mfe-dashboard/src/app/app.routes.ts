import { Routes } from '@angular/router';
import { Overview } from './pages/overview/overview';
import { Detalhes } from './pages/detalhes/detalhes';

export const routes: Routes = [
  { path: '', component: Overview },
  { path: 'detalhes', component: Detalhes },
];
