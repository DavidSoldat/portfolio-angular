import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PROFILE } from '../content/profile';

@Component({
  selector: 'app-driver-profile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <section class="flex h-full flex-col border border-line bg-panel" aria-labelledby="profile-h">
      <div class="relative h-[150px] overflow-hidden bg-red">
        <span class="disp absolute -right-2.5 -bottom-[46px] text-[210px] leading-none font-black text-ground italic opacity-90" aria-hidden="true">00</span>
        <svg class="absolute top-4 left-[18px]" width="120" height="120" viewBox="0 0 120 120" aria-hidden="true">
          <path d="M14 70C14 38 38 16 66 16c26 0 44 18 44 44v18H62l-8 18H22C17 96 14 86 14 70z" class="fill-ground" />
          <path d="M58 46h50v18H52z" class="fill-yellow" />
          <path d="M20 86h36" class="stroke-chalk stroke-4" />
        </svg>
      </div>
      <div class="flex flex-col gap-4 p-[18px]">
        <h2 id="profile-h" class="sr-only">About David</h2>
        <p class="text-[15.5px] leading-relaxed">{{ profile.bio }}</p>
        <dl class="grid grid-cols-[auto_1fr] gap-x-3.5 gap-y-2.5 text-[14.5px]">
          @for (f of profile.facts; track f.label) {
            <dt class="text-muted">{{ f.label }}</dt><dd>{{ f.value }}</dd>
          }
        </dl>
      </div>
    </section>
  `,
})
export class DriverProfile {
  protected readonly profile = PROFILE;
}
