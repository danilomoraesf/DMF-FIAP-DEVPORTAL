import { ChangeDetectionStrategy, Component, OnInit, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { PageHeader } from '../../shared-ui/page-header/page-header';
import { Card } from '../../shared-ui/card/card';
import { Badge } from '../../shared-ui/badge/badge';
import { Button } from '../../shared-ui/button/button';
import { UsersState } from '../../core/users-state';

@Component({
  selector: 'app-detalhe',
  imports: [RouterLink, PageHeader, Card, Badge, Button],
  templateUrl: './detalhe.html',
  styleUrl: './detalhe.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Detalhe implements OnInit {
  protected readonly state = inject(UsersState);
  private readonly route = inject(ActivatedRoute);

  private readonly userId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id'))),
    { initialValue: this.route.snapshot.paramMap.get('id') },
  );

  protected readonly user = computed(() => {
    const id = this.userId();
    return this.state.users().find((u) => u.id === id) ?? null;
  });

  ngOnInit(): void {
    if (this.state.users().length === 0) {
      this.state.loadUsers();
    }
  }
}
