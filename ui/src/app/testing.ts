import { Component, computed, signal } from '@angular/core';
import { ConnectionStatus } from './pm-data.service';
import { RowerData } from './rower';

/** Stand-in for PmDataService whose rowers and status can be set directly from a test. */
export class FakePmDataService {
  readonly status = signal<ConnectionStatus>('connecting');
  readonly rowers = signal<RowerData[]>([]);
  readonly totalDistance = computed(() => this.rowers().reduce((s, r) => s + r.distance, 0));

  setDistances(...distances: number[]) {
    this.rowers.set(distances.map((distance, i) => ({ rower: i + 1, distance })));
  }
}

@Component({ selector: 'app-route-map', template: '' })
export class RouteMapStub {}
