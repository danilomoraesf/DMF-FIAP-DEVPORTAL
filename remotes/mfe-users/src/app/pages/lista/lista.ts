import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeader } from '../../shared-ui/page-header/page-header';
import { Button } from '../../shared-ui/button/button';
import { Badge } from '../../shared-ui/badge/badge';
import { UsersState } from '../../core/users-state';

@Component({
  selector: 'app-lista',
  imports: [RouterLink, PageHeader, Button, Badge],
  templateUrl: './lista.html',
  styleUrl: './lista.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Lista implements OnInit {
  protected readonly state = inject(UsersState);

  ngOnInit(): void {
    this.state.loadUsers();
  }

  protected reload(): void {
    this.state.loadUsers();
  }

  protected simulateError(): void {
    this.state.loadUsers(true);
  }
}
