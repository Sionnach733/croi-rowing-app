import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, switchMap, tap, timer } from 'rxjs';
import { RowerData } from './rower';

const ROWERS_URL = 'http://127.0.0.1:5000/rowers';
const POLL_INTERVAL_MS = 10_000;

export type ConnectionStatus = 'connecting' | 'live' | 'offline';

@Injectable({ providedIn: 'root' })
export class PmDataService {
  private readonly http = inject(HttpClient);

  /** Whether the last poll reached the backend. */
  readonly status = signal<ConnectionStatus>('connecting');

  /** Latest rower distances, polled from the backend. A failed poll keeps the previous values. */
  readonly rowers = toSignal(
    timer(0, POLL_INTERVAL_MS).pipe(
      switchMap(() =>
        this.http.get<RowerData[]>(ROWERS_URL).pipe(
          tap(() => this.status.set('live')),
          catchError((err) => {
            console.error('Failed to fetch rowers', err);
            this.status.set('offline');
            return EMPTY;
          }),
        ),
      ),
    ),
    { initialValue: [] as RowerData[] },
  );

  /** Total metres rowed by everyone. */
  readonly totalDistance = computed(() =>
    this.rowers().reduce((sum, r) => sum + r.distance, 0),
  );
}
