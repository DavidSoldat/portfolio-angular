import { ChangeDetectionStrategy, Component, DestroyRef, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PROJECTS } from '../content/projects';
import { SECTOR_COLOR, SECTOR_NAME } from '../content/types';
import { NotFoundPage } from '../not-found-page';
import { Seo } from '../seo';
import { SelectionService } from '../selection';
import { ArchitectureDiagram } from './architecture-diagram';

@Component({
  selector: 'app-setup-sheet-page',
  imports: [RouterLink, ArchitectureDiagram, NotFoundPage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (project(); as p) {
      <div [style.--team]="p.teamColor">
        <div class="flex flex-wrap items-center justify-between gap-4 border-b border-line px-7 py-2.5">
          <a class="lnk" routerLink="/">
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path class="fill-none stroke-current stroke-2" d="M10 3 5 8l5 5" /></svg>
            Back to the pit wall
          </a>
          <nav class="flex items-center gap-1" aria-label="Other projects">
            <a class="lnk text-muted" [routerLink]="['/projects', prev().slug]">P{{ prevPos() }} {{ prev().title }}</a>
            <span class="text-muted" aria-hidden="true">/</span>
            <a class="lnk" [routerLink]="['/projects', next().slug]">P{{ nextPos() }} {{ next().title }}</a>
          </nav>
        </div>

        <section class="relative overflow-hidden bg-(--team) text-white" style="view-transition-name: project-band">
          <span class="disp absolute -top-[60px] right-[2%] text-[380px] leading-none font-black text-black/20 italic" aria-hidden="true">P{{ position() }}</span>
          <div class="relative mx-auto flex max-w-346 flex-col gap-4 px-7 pt-11 pb-10">
            <div class="flex flex-wrap items-center gap-2.5">
              <span class="disp bg-ground px-3 py-1 text-xl font-extrabold" style="view-transition-name: project-pos">{{ position() }}</span>
              <span class="disp bg-ground px-3 py-1 text-xl font-extrabold">{{ p.code }}</span>
              @if (p.fastest) { <span class="disp bg-purple px-3 py-1 text-lg font-extrabold text-ground">Fastest lap</span> }
            </div>
            <h1 class="disp text-[clamp(64px,10vw,120px)] leading-[.9] font-black italic [text-shadow:0_2px_0_rgb(0_0_0/.25)]"
                style="view-transition-name: project-title">{{ p.title }}</h1>
            <p class="max-w-160 text-xl leading-snug [text-shadow:0_1px_0_rgb(0_0_0/.3)]">{{ p.intro }}</p>
            <div class="mt-2 flex flex-wrap gap-2.5">
              @if (p.links.live) { <a class="btn btn-light" [href]="p.links.live">Try the live demo</a> }
              @if (p.links.github) { <a class="btn bg-ground text-chalk" [href]="p.links.github">View code on GitHub</a> }
            </div>
          </div>
        </section>

        <div class="mx-auto flex max-w-346 flex-col gap-12 px-7 py-10">
          <section aria-labelledby="setup-h">
            <div class="sec-head"><h2 id="setup-h" class="disp">Setup sheet</h2><span class="text-muted">How the car is built, part by part</span></div>
            <dl class="spec grid grid-cols-1 gap-x-7 lg:grid-cols-2">
              @for (s of p.setup; track s.part) {
                <div class="grid grid-cols-[120px_1fr] gap-3.5 border-b border-line py-3.5 lg:grid-cols-[150px_1fr]">
                  <dt class="disp text-[19px] font-bold text-muted">{{ s.part }}</dt>
                  <dd class="text-base">{{ s.value }}</dd>
                </div>
              }
            </dl>
          </section>

          <section aria-labelledby="arch-h">
            <div class="sec-head">
              <h2 id="arch-h" class="disp">Car layout</h2>
              <span class="flex flex-wrap gap-[18px] text-sm">
                <span class="flex items-center gap-2"><i class="size-3.5 border-2 border-purple"></i>Frontend app</span>
                <span class="flex items-center gap-2"><i class="size-3.5 border-2 border-muted"></i>Service</span>
                <span class="flex items-center gap-2"><i class="size-3.5 border-2 border-green"></i>ML or AI model</span>
                <span class="flex items-center gap-2"><i class="size-3.5 border-2 border-[#6b6b7b]"></i>Data store</span>
                <span class="flex items-center gap-2"><i class="size-3.5 border-2 border-dashed border-[#6b6b7b]"></i>External</span>
              </span>
            </div>
            <app-architecture-diagram [diagram]="p.diagram" [title]="p.title" />
          </section>

          <section aria-labelledby="lap-h">
            <div class="sec-head"><h2 id="lap-h" class="disp">Lap breakdown</h2></div>
            <ol class="sectors grid grid-cols-1 gap-3.5 lg:grid-cols-3">
              @for (s of p.sectors; track $index) {
                <li class="flex flex-col gap-2.5 border border-t-[5px] border-line bg-panel p-[18px]" [style.border-top-color]="color[s.kind]">
                  <span class="disp text-lg font-extrabold" [style.color]="color[s.kind]">Sector {{ $index + 1 }}, {{ kindName[s.kind] }}</span>
                  <h3 class="disp text-[26px] leading-tight font-extrabold">{{ s.heading }}</h3>
                  <p class="text-[15.5px] leading-normal text-soft">{{ s.body }}</p>
                </li>
              }
            </ol>
          </section>

          <section aria-labelledby="shots-h">
            <div class="sec-head"><h2 id="shots-h" class="disp">Onboard footage</h2><span class="text-muted">Screenshots from the app</span></div>
            <div class="grid grid-cols-1 gap-3.5 lg:grid-cols-[2fr_1fr_1fr]">
              @for (s of p.shots; track $index) {
                <figure class="shot flex flex-col gap-2">
                  @if (s.src) {
                    <img class="aspect-16/10 w-full object-cover" [src]="s.src" [alt]="s.alt" loading="lazy" />
                  } @else {
                    <div class="placeholder flex aspect-16/10 w-full items-center justify-center border-2 border-dashed border-line-2 bg-panel p-3 text-center text-muted">
                      Screenshot coming soon: {{ s.caption }}
                    </div>
                  }
                  <figcaption class="text-sm text-muted">{{ s.caption }}</figcaption>
                </figure>
              }
            </div>
          </section>

          <nav class="grid grid-cols-1 gap-3.5 lg:grid-cols-2" aria-label="More projects">
            <a class="navcard prev" [routerLink]="['/projects', prev().slug]">
              <span class="text-muted">Previous project</span>
              <span class="disp text-[32px] font-extrabold"><span [style.color]="prev().teamColor">P{{ prevPos() }}</span> {{ prev().title }}</span>
            </a>
            <a class="navcard next border-t-4 text-right" [routerLink]="['/projects', next().slug]" [style.border-top-color]="next().teamColor">
              <span class="text-muted">Next project</span>
              <span class="disp text-[32px] font-extrabold"><span [style.color]="next().teamColor">P{{ nextPos() }}</span> {{ next().title }}</span>
            </a>
          </nav>
        </div>
      </div>
    } @else {
      <app-not-found-page />
    }
  `,
  styles: `
    .sec-head { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 16px; margin-bottom: 14px; padding-bottom: 10px; border-bottom: 3px solid var(--team); }
    .sec-head h2 { font-size: 36px; font-weight: 800; }
    .navcard { display: flex; flex-direction: column; gap: 4px; padding: 20px 22px; background: var(--color-panel); border: 1px solid var(--color-line); text-decoration: none; color: var(--color-text); }
    .navcard.next { border-top-width: 4px; }
    .navcard:hover { background: #1f1f2b; color: var(--color-text); }
  `,
})
export class SetupSheetPage {
  readonly slug = input.required<string>();

  private readonly index = computed(() => PROJECTS.findIndex((p) => p.slug === this.slug()));
  protected readonly project = computed(() => PROJECTS[this.index()]);
  protected readonly position = computed(() => this.index() + 1);
  private readonly prevIndex = computed(() => (this.index() - 1 + PROJECTS.length) % PROJECTS.length);
  private readonly nextIndex = computed(() => (this.index() + 1) % PROJECTS.length);
  protected readonly prev = computed(() => PROJECTS[this.prevIndex()]);
  protected readonly next = computed(() => PROJECTS[this.nextIndex()]);
  protected readonly prevPos = computed(() => this.prevIndex() + 1);
  protected readonly nextPos = computed(() => this.nextIndex() + 1);
  protected readonly color = SECTOR_COLOR;
  protected readonly kindName = SECTOR_NAME;

  constructor() {
    const selection = inject(SelectionService);
    const seo = inject(Seo);
    effect(() => {
      const p = this.project();
      if (p) {
        selection.selected.set(p.slug);
        seo.set(`${p.title} | David Soldat`, p.intro);
      }
    });
    inject(DestroyRef).onDestroy(() => {
      const p = this.project();
      if (p) selection.returningFrom.set(p.slug);
    });
  }
}
