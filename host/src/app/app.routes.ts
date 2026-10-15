import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';
import { Home } from './pages/home/home';
import { NotFound } from './pages/not-found/not-found';

export const routes: Routes = [
  { path: '', component: Home },
  {
    path: 'dashboard',
    loadChildren: () =>
      loadRemoteModule({
        remoteName: 'mfe-dashboard',
        exposedModule: './routes',
      }).then((m) => m.routes),
  },
  {
    path: 'usuarios',
    loadChildren: () =>
      loadRemoteModule({
        remoteName: 'mfe-users',
        exposedModule: './routes',
      }).then((m) => m.routes),
  },
  { path: '**', component: NotFound },
];
