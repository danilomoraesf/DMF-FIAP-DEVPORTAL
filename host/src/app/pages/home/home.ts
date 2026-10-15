import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageHeader } from '../../shared-ui/page-header/page-header';
import { Card } from '../../shared-ui/card/card';
import { Badge } from '../../shared-ui/badge/badge';

interface ModuleStatus {
  id: string;
  name: string;
  squad: string;
  status: 'online' | 'planned' | 'building';
}

const STATUS_BADGE = {
  online: { variant: 'success', label: 'Online' },
  planned: { variant: 'neutral', label: 'Planejado' },
  building: { variant: 'warning', label: 'Em build' },
} as const;

@Component({
  selector: 'app-home',
  imports: [PageHeader, Card, Badge],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  protected readonly modules: ModuleStatus[] = [
    { id: 'mfe-dashboard', name: 'Dashboard', squad: 'Squad Dashboard', status: 'online' },
    { id: 'mfe-users', name: 'Usuários', squad: 'Squad Usuários', status: 'online' },
    { id: 'mfe-reports', name: 'Relatórios', squad: 'Squad Relatórios', status: 'planned' },
    { id: 'mfe-notifications', name: 'Notificações', squad: 'Squad Notificações', status: 'building' },
  ];

  protected badgeFor(status: ModuleStatus['status']) {
    return STATUS_BADGE[status];
  }
}
