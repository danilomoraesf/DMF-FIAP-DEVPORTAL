import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'neutral';

@Component({
  selector: 'app-badge',
  imports: [],
  templateUrl: './badge.html',
  styleUrl: './badge.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Badge {
  @Input() variant: BadgeVariant = 'neutral';
}
