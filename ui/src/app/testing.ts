import { Component, computed, signal } from '@angular/core';
import { RowerData } from './rower';

/** Stand-in for PmDataService whose rowers can be set directly from a test. */
export class FakePmDataService {
  readonly rowers = signal<RowerData[]>([]);
  readonly totalDistance = computed(() => this.rowers().reduce((s, r) => s + r.distance, 0));
}

@Component({ selector: 'app-my-map', template: '' })
export class MyMapStub {}

@Component({ selector: 'app-distance-table', template: '' })
export class DistanceTableStub {}
