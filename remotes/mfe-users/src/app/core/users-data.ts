import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ASSETS_BASE_URL } from './runtime-config';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
}

const SIMULATED_LATENCY_MS = 400;

@Injectable({
  providedIn: 'root',
})
export class UsersData {
  private readonly http = inject(HttpClient);

  getUsers(simulateError = false): Observable<AppUser[]> {
    const file = simulateError ? 'users-404.json' : 'users.json';
    return this.http
      .get<AppUser[]>(`${ASSETS_BASE_URL}/assets/mock/${file}`)
      .pipe(delay(SIMULATED_LATENCY_MS));
  }
}
