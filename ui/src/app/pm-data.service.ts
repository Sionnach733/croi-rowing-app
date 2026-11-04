import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, switchMap, timer } from 'rxjs';
import { RowerData } from './rower';

const ROWERS_URL = 'http://127.0.0.1:5000/rowers';
const POLL_INTERVAL_MS = 10_000;

@Injectable({ providedIn: 'root' })
export class PmDataService {
  private readonly http = inject(HttpClient);

  /** Latest rower distances, polled from the backend. A failed poll keeps the previous values. */
  readonly rowers = toSignal(
    timer(0, POLL_INTERVAL_MS).pipe(
      switchMap(() =>
        this.http.get<RowerData[]>(ROWERS_URL).pipe(
          catchError((err) => {
            console.error('Failed to fetch rowers', err);
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
