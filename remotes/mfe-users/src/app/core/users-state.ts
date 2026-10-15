import { Injectable, inject, signal } from '@angular/core';
import { catchError, of } from 'rxjs';
import { UsersData, AppUser } from './users-data';

@Injectable({
  providedIn: 'root',
})
export class UsersState {
  private readonly dataService = inject(UsersData);

  readonly users = signal<AppUser[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  loadUsers(simulateError = false): void {
    this.loading.set(true);
    this.error.set(null);

    this.dataService
      .getUsers(simulateError)
      .pipe(
        catchError(() => {
          this.error.set('Não foi possível carregar os usuários. Tente novamente.');
          return of<AppUser[]>([]);
        }),
      )
      .subscribe((users) => {
        this.users.set(users);
        this.loading.set(false);
      });
  }
}
