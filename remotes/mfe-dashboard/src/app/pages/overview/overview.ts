import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeader } from '../../shared-ui/page-header/page-header';
import { Card } from '../../shared-ui/card/card';
import { Button } from '../../shared-ui/button/button';
import { Badge } from '../../shared-ui/badge/badge';
import { DashboardState } from '../../core/dashboard-state';

@Component({
  selector: 'app-overview',
  imports: [RouterLink, PageHeader, Card, Button, Badge],
  templateUrl: './overview.html',
  styleUrl: './overview.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Overview implements OnInit {
  protected readonly state = inject(DashboardState);

  ngOnInit(): void {
    this.state.loadMetrics();
  }

  protected reload(): void {
    this.state.loadMetrics();
  }

  protected simulateError(): void {
    this.state.loadMetrics(true);
  }
}
