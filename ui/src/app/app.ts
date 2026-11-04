import { Component } from '@angular/core';
import { ConnectionStatus } from './connection-status/connection-status';
import { Leaderboard } from './leaderboard/leaderboard';
import { ProgressPanel } from './progress-panel/progress-panel';
import { RouteMap } from './route-map/route-map';

@Component({
  selector: 'app-root',
  imports: [ConnectionStatus, ProgressPanel, Leaderboard, RouteMap],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
