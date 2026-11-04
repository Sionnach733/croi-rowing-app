import { DecimalPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { PmDataService } from '../pm-data.service';
import { lengthsOfShannon } from '../shannon-route';

export const TARGET_METRES = 1_000_000;

@Component({
  selector: 'app-progress-panel',
  imports: [DecimalPipe],
  templateUrl: './progress-panel.html',
  styleUrl: './progress-panel.css',
})
export class ProgressPanel {
  private readonly pmData = inject(PmDataService);

  readonly target = TARGET_METRES;
  readonly total = this.pmData.totalDistance;

  /** Percent of target, rounded down to one decimal. Keeps counting past 100. */
  readonly percent = computed(() => Math.floor((this.total() / this.target) * 1000) / 10);
  readonly barPercent = computed(() => Math.min(100, this.percent()));
  readonly goalReached = computed(() => this.total() >= this.target);
  readonly remainingKm = computed(() => Math.max(0, this.target - this.total()) / 1000);
  readonly lengths = computed(() => lengthsOfShannon(this.total()));
}
