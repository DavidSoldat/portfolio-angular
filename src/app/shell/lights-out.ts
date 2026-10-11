import { ChangeDetectionStrategy, Component, DOCUMENT, DestroyRef, afterNextRender, computed, inject, signal } from '@angular/core';

export type IntroMode = 'full' | 'short' | 'none';
export type Phase = 'ignition' | 'lights' | 'out' | 'launch' | 'done';

const KEY = 'pw-intro-seen';
const SEGMENTS = 16;

export function introMode(seen: boolean, reducedMotion: boolean): IntroMode {
  if (reducedMotion) return 'none';
  return seen ? 'short' : 'full';
}

function readSeen(): boolean {
  try { return sessionStorage.getItem(KEY) === '1'; } catch { return false; }
}
function writeSeen(): void {
  try { sessionStorage.setItem(KEY, '1'); } catch { /* storage blocked: intro plays again next load */ }
}
function prefersReducedMotion(): boolean {
  return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}

@Component({
  selector: 'app-lights-out',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown.escape)': 'skip()' },
  template: `
    @if (phase() !== 'done') {
      <div [class]="'overlay phase-' + phase()" [style.--glow]="lit() / 5" (click)="skip()">
        @if (phase() === 'ignition') {
          <div class="rev" aria-hidden="true">
            @for (i of segments; track i) {
              <span class="seg" [class.lit]="i < revs()" [class.hot]="i >= 10" [class.limit]="i >= 14"></span>
            }
          </div>
          <div class="gear disp" aria-hidden="true">{{ gear() }}</div>
        }
        @if (phase() === 'lights' || phase() === 'out') {
          <div class="pods" aria-hidden="true">
            @for (i of pods; track i) {
              <div class="pod" [style.--d]="i">
                <span class="lamp"></span><span class="lamp"></span>
                <span class="lamp" [class.on]="phase() === 'lights' && i < lit()"></span>
                <span class="lamp" [class.on]="phase() === 'lights' && i < lit()"></span>
              </div>
            }
          </div>
        }
        @if (phase() === 'out') { <p class="go disp">Lights out and away we go</p> }
        @if (phase() === 'launch') { <div class="stripes" aria-hidden="true"></div> }
        @if (phase() !== 'launch') {
          <button type="button" class="skip" (click)="$event.stopPropagation(); skip()">Skip intro</button>
        }
      </div>
    }
  `,
  styles: `
    .overlay { position: fixed; inset: 0; z-index: 500; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 48px; overflow: hidden;
      background: radial-gradient(ellipse at center, rgba(225, 6, 0, calc(var(--glow, 0) * .45)) 0%, transparent 70%), #07070B; cursor: pointer; }
    .phase-launch { background: transparent; pointer-events: none; }
    .rev { display: flex; gap: 6px; width: min(900px, 86vw); }
    .seg { flex: 1; height: 26px; background: #1C1C26; transform: skewX(-18deg); transition: background .05s; }
    .seg.lit { background: var(--color-green); }
    .seg.lit.hot { background: var(--color-red); }
    .seg.lit.limit { background: var(--color-purple); box-shadow: 0 0 18px var(--color-purple); }
    .gear { font-size: 180px; font-weight: 900; font-style: italic; line-height: 1; color: var(--color-chalk); }
    .pods { display: flex; gap: clamp(10px, 2vw, 26px); }
    .pod { display: flex; flex-direction: column; gap: 12px; padding: 16px 14px; background: #050508; border-radius: 12px;
      animation: pod-drop .45s cubic-bezier(.2,.9,.3,1.2) backwards; animation-delay: calc(var(--d) * 70ms); }
    .lamp { width: clamp(40px, 7vw, 78px); aspect-ratio: 1; border-radius: 50%; background: #2A0A0A; border: 3px solid #0A0A0F; }
    .lamp.on { background: var(--color-red); box-shadow: 0 0 36px 8px rgba(225, 6, 0, .6); }
    .phase-out { animation: flash .2s ease-out; }
    .go { font-size: clamp(36px, 6vw, 72px); font-weight: 900; font-style: italic; color: var(--color-chalk); transform: skewX(-8deg); animation: slam .25s cubic-bezier(.2,.9,.3,1.3) both; }
    .stripes { position: absolute; inset: 0 -40%;
      background: repeating-linear-gradient(115deg, var(--color-red) 0 70px, #07070B 70px 100px, var(--color-chalk) 100px 112px, #07070B 112px 170px);
      animation: launch .8s cubic-bezier(.7,0,.2,1) forwards; }
    .skip { position: absolute; right: 32px; bottom: 28px; min-height: 44px; padding: 0 18px; background: transparent; color: var(--color-soft); border: 1px solid var(--color-line-2); font: inherit; font-size: 15px; cursor: pointer; }
    @keyframes pod-drop { from { transform: translateY(-120vh); } }
    @keyframes flash { from { background: #fff; } }
    @keyframes slam { from { transform: skewX(-8deg) scale(2.4); opacity: 0; } }
    @keyframes launch {
      from { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); transform: translateX(0); }
      to { clip-path: polygon(100% 0, 100% 0, 100% 100%, 100% 100%); transform: translateX(20%); }
    }
  `,
})
export class LightsOut {
  /** 'done' by default, so prerendered HTML contains no overlay. */
  readonly phase = signal<Phase>('done');
  readonly lit = signal(0);
  readonly revs = signal(0);
  protected readonly gear = computed(() => (this.revs() === 0 ? 'N' : String(Math.min(8, Math.ceil(this.revs() / 2)))));
  protected readonly segments = Array.from({ length: SEGMENTS }, (_, i) => i);
  protected readonly pods = [0, 1, 2, 3, 4];

  private readonly doc = inject(DOCUMENT);
  private timers: ReturnType<typeof setTimeout>[] = [];
  private shown = false;

  constructor() {
    afterNextRender(() => this.start());
    inject(DestroyRef).onDestroy(() => this.clear());
  }

  skip(): void {
    const p = this.phase();
    if (p === 'ignition' || p === 'lights' || p === 'out') this.launch();
  }

  private start(): void {
    const mode = introMode(readSeen(), prefersReducedMotion());
    writeSeen();
    if (mode === 'none') return this.finish();
    this.shown = true;
    if (mode === 'short') return this.launch();
    this.phase.set('ignition');
    for (let i = 1; i <= SEGMENTS; i++) this.at(i * 70, () => this.revs.set(i));
    const fonts = this.doc.fonts?.ready ?? Promise.resolve();
    const minimum = new Promise<void>((resolve) => this.at(1200, resolve));
    Promise.all([fonts, minimum]).then(() => {
      if (this.phase() === 'ignition') this.lights();
    });
  }

  private lights(): void {
    this.phase.set('lights');
    for (let i = 1; i <= 5; i++) this.at(i * 400, () => this.lit.set(i));
    this.at(2200, () => {
      this.phase.set('out');
      this.at(200, () => this.launch());
    });
  }

  private launch(): void {
    this.clear();
    this.phase.set('launch');
    const root = this.doc.documentElement;
    root.classList.remove('intro-pending');
    root.classList.add('launch');
    this.at(900, () => this.finish());
  }

  private finish(): void {
    this.clear();
    this.phase.set('done');
    const root = this.doc.documentElement;
    root.classList.remove('intro-pending');
    if (this.shown) {
      setTimeout(() => root.classList.remove('launch'), 1500);
      this.doc.getElementById('main')?.focus({ preventScroll: true });
    }
  }

  private at(ms: number, fn: () => void): void {
    this.timers.push(setTimeout(fn, ms));
  }

  private clear(): void {
    this.timers.forEach(clearTimeout);
    this.timers = [];
  }
}
