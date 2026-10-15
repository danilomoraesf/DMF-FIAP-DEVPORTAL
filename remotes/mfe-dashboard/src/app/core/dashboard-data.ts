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

  getMetrics(simulateError = false): Observable<DashboardMetric[]> {
    const file = simulateError ? 'metrics-404.json' : 'metrics.json';
    return this.http
      .get<DashboardMetric[]>(`${ASSETS_BASE_URL}/assets/mock/${file}`)
      .pipe(delay(SIMULATED_LATENCY_MS));
  }

  getDeploys(simulateError = false): Observable<DeployRecord[]> {
    const file = simulateError ? 'deploys-404.json' : 'deploys.json';
    return this.http
      .get<DeployRecord[]>(`${ASSETS_BASE_URL}/assets/mock/${file}`)
      .pipe(delay(SIMULATED_LATENCY_MS));
  }
}
