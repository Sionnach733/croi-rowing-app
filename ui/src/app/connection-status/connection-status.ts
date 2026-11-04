import { Component, computed, inject } from '@angular/core';
import { PmDataService } from '../pm-data.service';

const LABELS = {
  connecting: 'Connecting…',
  live: 'Live',
  offline: 'Reconnecting · showing last totals',
} as const;

@Component({
  selector: 'app-connection-status',
  template: `
    <p class="status" [class]="'status status--' + status()" role="status">
      <span class="dot" aria-hidden="true"></span>{{ label() }}
    </p>
  `,
  styles: `
    .status {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-2) var(--space-3);
      border: 1px solid var(--border);
      border-radius: 999px;
      background: var(--surface);
      font-size: 0.85rem;
      font-weight: 600;
      white-space: nowrap;
    }
    .dot {
      width: 0.6rem;
      height: 0.6rem;
      border-radius: 50%;
      background: var(--text-muted);
    }
    .status--live .dot {
      background: var(--success);
      animation: pulse 2s ease-in-out infinite;
    }
    .status--offline {
      color: var(--warning);
      border-color: color-mix(in srgb, var(--warning) 40%, transparent);
    }
    .status--offline .dot {
      background: var(--warning);
    }
    @keyframes pulse {
      0%, 100% { box-shadow: 0 0 0 0 rgb(61 220 132 / 0.6); }
      50% { box-shadow: 0 0 0 0.4rem rgb(61 220 132 / 0); }
    }
  `,
})
export class ConnectionStatus {
  readonly status = inject(PmDataService).status;
  readonly label = computed(() => LABELS[this.status()]);
}
