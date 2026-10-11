import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Project, SECTOR_COLOR } from '../content/types';
import { TrackMap } from './track-map';

@Component({
  selector: 'app-onboard-panel',
  imports: [RouterLink, TrackMap],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block min-w-0' },
  template: `
    <section class="relative h-full min-w-0 overflow-hidden border border-line bg-panel" aria-label="Selected project">
      <!-- One-item loop keyed by slug: switching project recreates this block, replaying the wipe and restarting the car. -->
      @for (p of current(); track p.slug) {
        <div class="swap flex h-full flex-col" [style.--team]="p.teamColor">
          <div class="flex items-stretch border-b border-line" style="view-transition-name: project-band">
            <div class="pos disp flex w-16 flex-none items-center justify-center bg-(--team) text-[40px] font-black text-ground md:w-[86px] md:text-[54px]"
                 style="view-transition-name: project-pos">{{ position() }}</div>
            <div class="flex min-w-0 flex-col gap-1 px-[22px] py-3.5">
              <h1 class="disp text-[44px] leading-[.95] font-black italic md:text-[58px]" style="view-transition-name: project-title">{{ p.title }}</h1>
              <p class="text-[17px] text-soft">{{ p.blurb }}</p>
            </div>
            @if (p.fastest) {
              <div class="fastest disp ml-auto flex items-center gap-2 self-start bg-purple px-3.5 py-2 text-[17px] font-extrabold text-ground">
                <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" class="fill-none stroke-ground stroke-2">
                  <circle cx="9" cy="10" r="7" /><path d="M9 10V6M7 1h4" />
                </svg>
                Fastest lap
              </div>
            }
          </div>
          <app-track-map class="px-[22px] pt-2" [sectors]="p.sectors" [teamColor]="p.teamColor" [title]="p.title" />
          <ol class="sectors grid grid-cols-1 gap-3 px-[22px] md:grid-cols-3">
            @for (s of p.sectors; track $index) {
              <li class="flex flex-col gap-1.5 border-t-4 pt-3 text-[15px] leading-snug" [style.border-top-color]="color[s.kind]">
                <span class="disp text-base font-extrabold" [style.color]="color[s.kind]">Sector {{ $index + 1 }}</span>
                <span>{{ s.short }}</span>
              </li>
            }
          </ol>
          <div class="mt-auto flex flex-wrap items-center justify-between gap-3.5 px-[22px] pt-[18px] pb-5">
            <ul class="flex flex-wrap gap-1.5" aria-label="Stack">
              @for (t of p.stack; track t) { <li class="chip">{{ t }}</li> }
            </ul>
            <div class="flex flex-wrap gap-2.5">
              <a class="btn btn-light" [routerLink]="['/projects', p.slug]">Open setup sheet</a>
              @if (p.links.github) {
                <a class="btn btn-dark" [href]="p.links.github">View code</a>
              } @else if (p.links.live) {
                <a class="btn btn-dark" [href]="p.links.live">Open live site</a>
              }
            </div>
          </div>
        </div>
      }
    </section>
  `,
  styles: `
    .swap { animation: swap-in .32s cubic-bezier(.7, 0, .2, 1) both; }
    .swap::before {
      content: ''; position: absolute; inset: 0; z-index: 2; pointer-events: none;
      background: repeating-linear-gradient(115deg, var(--team) 0 22px, transparent 22px 34px);
      animation: swap-stripes .32s cubic-bezier(.7, 0, .2, 1) forwards;
    }
    @keyframes swap-in { from { clip-path: polygon(0 0, 0 0, -10% 100%, 0 100%); } to { clip-path: polygon(0 0, 120% 0, 110% 100%, 0 100%); } }
    @keyframes swap-stripes { from { transform: translateX(-30%); opacity: 1; } to { transform: translateX(110%); opacity: 0; } }
  `,
})
export class OnboardPanel {
  readonly project = input.required<Project>();
  readonly position = input.required<number>();
  protected readonly current = computed(() => [this.project()]);
  protected readonly color = SECTOR_COLOR;
}
