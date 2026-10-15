import { Injectable, signal } from '@angular/core';

export interface MockUser {
  name: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class AppShellState {
  readonly user = signal<MockUser>({
    name: 'Mariana Ribeiro',
    role: 'Head de Plataforma',
  });

  readonly sidebarCollapsed = signal(false);

  toggleSidebar(): void {
    this.sidebarCollapsed.update((collapsed) => !collapsed);
  }
}
