import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AppShellState } from '../../core/app-shell-state';

interface NavItem {
  label: string;
  path: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar {
  protected readonly shellState = inject(AppShellState);

  protected readonly navItems: NavItem[] = [
    { label: 'Início', path: '/' },
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Usuários', path: '/usuarios' },
  ];
}
