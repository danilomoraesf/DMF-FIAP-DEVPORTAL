import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Card } from '../../shared-ui/card/card';
import { Button } from '../../shared-ui/button/button';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, Card, Button],
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFound {}
