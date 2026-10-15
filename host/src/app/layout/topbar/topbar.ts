import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Button } from '../../shared-ui/button/button';
import { AppShellState } from '../../core/app-shell-state';

@Component({
  selector: 'app-topbar',
  imports: [Button],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Topbar {
  protected readonly shellState = inject(AppShellState);
}
