import { DestroyRef, Injectable, afterNextRender, inject, signal } from '@angular/core';

const FORMAT = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/Sarajevo', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
});

export function formatClock(date: Date): string {
  return FORMAT.format(date);
}

@Injectable({ providedIn: 'root' })
export class ClockService {
  readonly time = signal('--:--:--');

  constructor() {
    const destroyRef = inject(DestroyRef);
    // Browser only: prerendered HTML keeps the placeholder, so hydration never mismatches.
    afterNextRender(() => {
      this.time.set(formatClock(new Date()));
      const id = setInterval(() => this.time.set(formatClock(new Date())), 1000);
      destroyRef.onDestroy(() => clearInterval(id));
    });
  }
}
