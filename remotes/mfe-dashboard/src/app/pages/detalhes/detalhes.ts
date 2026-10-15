import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { PageHeader } from '../../shared-ui/page-header/page-header';
import { Button } from '../../shared-ui/button/button';
import { Badge } from '../../shared-ui/badge/badge';
import { DashboardState } from '../../core/dashboard-state';
import { DeployRecord } from '../../core/dashboard-data';

const STATUS_BADGE = {
  success: { variant: 'success', label: 'Sucesso' },
  failed: { variant: 'danger', label: 'Falhou' },
  running: { variant: 'warning', label: 'Em andamento' },
} as const;

@Component({
  selector: 'app-detalhes',
  imports: [RouterLink, DatePipe, PageHeader, Button, Badge],
  templateUrl: './detalhes.html',
  styleUrl: './detalhes.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Detalhes implements OnInit {
  protected readonly state = inject(DashboardState);

  ngOnInit(): void {
    this.state.loadDeploys();
  }

  protected reload(): void {
    this.state.loadDeploys();
  }

  protected badgeFor(status: DeployRecord['status']) {
    return STATUS_BADGE[status];
  }
}
