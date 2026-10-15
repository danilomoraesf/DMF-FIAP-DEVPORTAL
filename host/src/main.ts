import { initFederation } from '@angular-architects/native-federation';

// Workaround for a known Native Federation issue: the shared/singleton
// @angular/core chunk can be loaded without Angular's own dev-mode globals
// set up, which crashes any signal() usage with "ngDevMode is not defined".
(globalThis as Record<string, unknown>)['ngDevMode'] ??= false;

initFederation({
  'mfe-dashboard': 'http://localhost:4201/remoteEntry.json',
  'mfe-users': 'http://localhost:4202/remoteEntry.json',
})
  .catch((err) => console.error(err))
  .then((_) => import('./bootstrap'))
  .catch((err) => console.error(err));
