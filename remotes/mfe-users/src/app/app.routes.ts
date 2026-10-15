import { Routes } from '@angular/router';
import { Lista } from './pages/lista/lista';
import { Detalhe } from './pages/detalhe/detalhe';

export const routes: Routes = [
  { path: '', component: Lista },
  { path: ':id', component: Detalhe },
];
