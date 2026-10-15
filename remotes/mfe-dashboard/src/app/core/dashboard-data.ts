import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ASSETS_BASE_URL } from './runtime-config';

export interface DashboardMetric {
  id: string;
  label: string;
  value: number;
  delta: number;
}

export interface DeployRecord {
  id: string;
  timestamp: string;
  module: string;
  status: 'success' | 'failed' | 'running';
}

const SIMULATED_LATENCY_MS = 400;

@Injectable({
  providedIn: 'root',
})
export class DashboardData {
  private readonly http = inject(HttpClient);

  getMetrics(): Observable<DashboardMetric[]> {
    return this.http
      .get<DashboardMetric[]>(`${ASSETS_BASE_URL}/assets/mock/metrics.json`)
      .pipe(delay(SIMULATED_LATENCY_MS));
  }

  getDeploys(): Observable<DeployRecord[]> {
    return this.http
      .get<DeployRecord[]>(`${ASSETS_BASE_URL}/assets/mock/deploys.json`)
      .pipe(delay(SIMULATED_LATENCY_MS));
  }
}
