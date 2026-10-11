import { ChangeDetectionStrategy, Component, ElementRef, input, output, viewChildren } from '@angular/core';
import { Project, SECTOR_COLOR, SECTOR_NAME, SectorKind } from '../content/types';

@Component({
  selector: 'app-timing-tower',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <section class="flex h-full flex-col border border-line bg-panel" aria-labelledby="tower-h">
      <div class="flex items-center justify-between bg-red px-3.5 py-3 text-white">
        <h2 id="tower-h" class="disp text-[22px] font-extrabold">Projects</h2>
        <span class="disp text-lg font-bold">Lap {{ projects().length }} / {{ projects().length }}</span>
      </div>
      @for (p of projects(); track p.slug; let i = $index) {
        <button #row type="button"
          class="row tower-row grid min-h-[58px] w-full cursor-pointer grid-cols-[38px_5px_1fr_auto] items-center gap-2.5 border-b border-line pr-3.5 text-left"
          [class.sel]="p.slug === selected()" [class.flash]="p.slug === flash()"
          [attr.aria-pressed]="p.slug === selected()" [style.--i]="i"
          (click)="select.emit(p.slug)" (keydown)="onKey($event, i)">
          <span class="disp text-center text-2xl font-extrabold">{{ i + 1 }}</span>
          <span class="my-3 self-stretch" [style.background]="p.teamColor"></span>
          <span class="flex min-w-0 flex-col">
            <span class="disp text-[22px] leading-[1.05] font-extrabold tracking-[.03em]">{{ p.code }}</span>
            <span class="name truncate text-[13px] text-muted">{{ p.name }}</span>
          </span>
          <span class="disp text-base font-bold" [class.text-purple]="p.fastest">{{ p.tag }}</span>
        </button>
      }
      <div class="mt-auto flex flex-col gap-2 p-3.5 text-[13px]">
        <span class="text-muted">Sector colours on the track</span>
        @for (k of kinds; track k) {
          <span class="flex items-center gap-2"><span class="h-1 w-[18px]" [style.background]="color[k]"></span>{{ name[k] }}</span>
        }
      </div>
    </section>
  `,
  styles: `
    .row { background: transparent; color: var(--color-text); font: inherit; }
    .row:hover { background: #1f1f2b; }
    .row.sel { background: var(--color-chalk); color: var(--color-ground); }
    .row.sel .name { color: #4a4a57; }
    .row.flash { animation: row-flash .6s ease-out 1; }
    @keyframes row-flash { from { box-shadow: inset 0 0 0 3px var(--color-yellow); } to { box-shadow: inset 0 0 0 0 transparent; } }
  `,
})
export class TimingTower {
  readonly projects = input.required<readonly Project[]>();
  readonly selected = input.required<string>();
  readonly flash = input<string | null>(null);
  readonly select = output<string>();

  protected readonly kinds: SectorKind[] = ['architecture', 'data', 'delivery'];
  protected readonly color = SECTOR_COLOR;
  protected readonly name = SECTOR_NAME;
  private readonly rows = viewChildren<ElementRef<HTMLButtonElement>>('row');

  protected onKey(event: KeyboardEvent, index: number): void {
    const delta = event.key === 'ArrowDown' ? 1 : event.key === 'ArrowUp' ? -1 : 0;
    if (!delta) return;
    event.preventDefault();
    const count = this.projects().length;
    const next = (index + delta + count) % count;
    this.select.emit(this.projects()[next].slug);
    this.rows()[next]?.nativeElement.focus();
  }
}
