import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CHANNELS } from '../content/stack';

@Component({
  selector: 'app-telemetry',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <section class="h-full border border-line bg-panel" aria-labelledby="tel-h">
      <div class="flex flex-wrap items-baseline justify-between gap-3 border-b border-line px-[18px] py-3.5">
        <h2 id="tel-h" class="disp text-2xl font-extrabold">Telemetry</h2>
        <span class="text-sm text-muted">Everything I run in production, by channel</span>
      </div>
      @for (c of channels; track c.name) {
        <div class="channel grid grid-cols-1 items-center gap-3.5 border-b border-[#22222c] px-[18px] py-3 sm:grid-cols-[150px_1fr]">
          <span class="disp flex items-center gap-2.5 text-lg font-bold">
            <svg width="34" height="14" viewBox="0 0 34 14" aria-hidden="true"><path class="fill-none stroke-2" [attr.d]="c.trace" [style.stroke]="c.color" /></svg>
            {{ c.name }}
          </span>
          <ul class="flex flex-wrap gap-1.5">
            @for (i of c.items; track i) {
              <li class="border-l-[3px] bg-panel-2 px-[9px] py-1 text-sm" [style.border-left-color]="c.color">{{ i }}</li>
            }
          </ul>
        </div>
      }
    </section>
  `,
})
export class Telemetry {
  protected readonly channels = CHANNELS;
}
