import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SECTOR_COLOR, Sector } from '../content/types';

const TRACK =
  'M80 240 L420 240 C470 240 485 212 505 190 L568 122 C590 98 575 56 540 56 L470 56 C440 56 428 88 398 94 L300 112 C262 120 248 82 218 70 L150 48 C100 34 56 68 56 120 L56 208 C56 228 66 240 80 240 Z';

@Component({
  selector: 'app-track-map',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <svg class="block h-auto w-full" viewBox="0 0 640 300" role="img"
         [attr.aria-label]="'Track map for ' + title() + '. Each sector is one highlight of the project.'">
      <path [attr.d]="track" class="base" />
      @for (s of sectors(); track $index) {
        <path [attr.d]="track" pathLength="300" class="sector" [style.stroke]="color[s.kind]" [style.stroke-dashoffset]="-100 * $index" />
      }
      <rect x="96" y="228" width="6" height="24" class="fill-chalk" />
      <rect x="96" y="228" width="3" height="6" class="fill-ground" />
      <rect x="99" y="234" width="3" height="6" class="fill-ground" />
      <rect x="96" y="240" width="3" height="6" class="fill-ground" />
      <rect x="99" y="246" width="3" height="6" class="fill-ground" />
      <text x="300" y="272" class="lbl">S1</text>
      <text x="590" y="96" class="lbl">S2</text>
      <text x="22" y="140" class="lbl">S3</text>
      <g class="car">
        <circle r="11" [style.fill]="teamColor()" opacity=".25" />
        <circle r="6.5" [style.fill]="teamColor()" class="stroke-ground stroke-2" />
        <animateMotion dur="7s" repeatCount="indefinite" [attr.path]="track" />
      </g>
    </svg>
  `,
  styles: `
    .base { fill: none; stroke: #23232f; stroke-width: 22; stroke-linejoin: round; }
    .sector { fill: none; stroke-width: 6; stroke-linecap: round; stroke-dasharray: 98 202; }
    .lbl { fill: var(--color-muted); font-family: var(--font-display); font-size: 15px; font-weight: 700; }
    @media (prefers-reduced-motion: reduce) { .car { display: none; } }
  `,
})
export class TrackMap {
  readonly sectors = input.required<readonly Sector[]>();
  readonly teamColor = input.required<string>();
  readonly title = input.required<string>();
  protected readonly track = TRACK;
  protected readonly color = SECTOR_COLOR;
}
