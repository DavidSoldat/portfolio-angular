import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PROFILE } from '../content/profile';
import { ClockService } from './clock';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="hdr relative flex flex-wrap items-start justify-between gap-5 bg-deep px-7 py-3.5 md:items-center max-md:flex-col">
      <div class="flex items-center gap-[18px]">
        <a class="disp flex items-center text-[40px] leading-none font-black text-text no-underline" routerLink="/" aria-label="David Soldat, home">
          <span>Dav</span>
          <svg width="26" height="40" viewBox="0 0 26 40" aria-hidden="true"><path class="fill-yellow" d="M16 1 2 23h9l-3 16 16-24h-9l4-14z" /></svg>
          <span>d</span>
        </a>
        <div class="flex flex-col gap-0.5 border-l border-line-2 pl-[18px]">
          <span class="disp text-[22px] leading-none font-bold">{{ profile.name }} <span class="text-red">#00</span></span>
          <span class="text-[13px] text-muted">{{ profile.role }}</span>
        </div>
      </div>
      <p class="flex max-w-full items-center gap-2.5 border border-[#1f6b3a] bg-[#0f2a1a] px-3.5 py-2 text-[15px] font-semibold text-[#b8f5cb]">
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          <path d="M3 2v15" class="fill-none stroke-green stroke-2" /><path d="M4 3h11l-3 4 3 4H4z" class="fill-green" />
        </svg>
        {{ profile.status }}
      </p>
      <nav class="flex flex-wrap items-center gap-[18px]" aria-label="Profile links">
        <div class="flex flex-col md:items-end">
          <span class="disp text-2xl leading-none font-bold">{{ clock.time() }}</span>
          <span class="text-[13px] text-muted">Local time in Banja Luka</span>
        </div>
        <a class="lnk" [href]="profile.links.github">GitHub</a>
        <a class="lnk" [href]="profile.links.linkedin">LinkedIn</a>
      </nav>
    </header>
  `,
  styles: `
    /* The red rule is a pseudo-element so the launch beat can draw it in (scaleX). */
    .hdr::after { content: ''; position: absolute; inset: auto 0 0 0; height: 4px; background: var(--color-red); transform-origin: left; }
    :host-context(.launch) .hdr::after { animation: rule-draw .6s cubic-bezier(.7, 0, .2, 1) .15s backwards; }
    @keyframes rule-draw { from { transform: scaleX(0); } }
  `,
})
export class Header {
  protected readonly profile = PROFILE;
  protected readonly clock = inject(ClockService);
}
