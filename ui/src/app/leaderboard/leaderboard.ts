import { DecimalPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { PmDataService } from '../pm-data.service';

export interface LeaderboardRow {
  name: string;
  distance: number;
  /** Bar width relative to the leader, 0-100. */
  share: number;
}

@Component({
  selector: 'app-leaderboard',
  imports: [DecimalPipe],
  templateUrl: './leaderboard.html',
  styleUrl: './leaderboard.css',
})
export class Leaderboard {
  private readonly rowers = inject(PmDataService).rowers;

  /** Rowers named by their station (backend order), sorted furthest first. */
  readonly rows = computed<LeaderboardRow[]>(() => {
    const named = this.rowers().map((r, i) => ({ name: `Rower ${i + 1}`, distance: r.distance }));
    const leader = Math.max(0, ...named.map((r) => r.distance));
    return named
      .sort((a, b) => b.distance - a.distance)
      .map((r) => ({ ...r, share: leader ? (r.distance / leader) * 100 : 0 }));
  });
}
