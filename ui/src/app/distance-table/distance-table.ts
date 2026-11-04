import { DecimalPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MyMap } from '../my-map/my-map';
import { PmDataService } from '../pm-data.service';

@Component({
  selector: 'app-distance-table',
  imports: [DecimalPipe, MatTableModule, MatProgressBarModule, MyMap],
  templateUrl: './distance-table.html',
  styleUrl: './distance-table.css',
})
export class DistanceTable {
  private readonly pmData = inject(PmDataService);

  readonly target = 1_000_000;
  readonly displayedColumns = ['rower', 'distance'];
  readonly rowers = this.pmData.rowers;
  readonly totalDistance = this.pmData.totalDistance;
  readonly percentage = computed(() =>
    Math.min(100, Math.floor((this.totalDistance() / this.target) * 100)),
  );
}
