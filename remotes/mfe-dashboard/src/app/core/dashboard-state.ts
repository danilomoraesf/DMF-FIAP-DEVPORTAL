import { Injectable, inject, signal } from '@angular/core';
import { catchError, of } from 'rxjs';
import { DashboardData, DashboardMetric, DeployRecord } from './dashboard-data';

@Injectable({
  providedIn: 'root',
})
export class DashboardState {
  private readonly dataService = inject(DashboardData);

  readonly metrics = signal<DashboardMetric[]>([]);
  readonly metricsLoading = signal(false);
  readonly metricsError = signal<string | null>(null);

  readonly deploys = signal<DeployRecord[]>([]);
  readonly deploysLoading = signal(false);
  readonly deploysError = signal<string | null>(null);

  loadMetrics(simulateError = false): void {
    this.metricsLoading.set(true);
    this.metricsError.set(null);

    this.dataService
      .getMetrics(simulateError)
      .pipe(
        catchError(() => {
          this.metricsError.set('Não foi possível carregar as métricas. Tente novamente.');
          return of<DashboardMetric[]>([]);
        }),
      )
      .subscribe((metrics) => {
        this.metrics.set(metrics);
        this.metricsLoading.set(false);
      });
  }

  loadDeploys(simulateError = false): void {
    this.deploysLoading.set(true);
    this.deploysError.set(null);

    this.dataService
      .getDeploys(simulateError)
      .pipe(
        catchError(() => {
          this.deploysError.set('Não foi possível carregar o histórico de deploys.');
          return of<DeployRecord[]>([]);
        }),
      )
      .subscribe((deploys) => {
        this.deploys.set(deploys);
        this.deploysLoading.set(false);
      });
  }
}
