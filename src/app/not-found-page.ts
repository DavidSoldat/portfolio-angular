import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Seo } from './seo';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="mx-auto flex max-w-[640px] flex-col items-start gap-[18px] px-7 py-24">
      <span class="disp bg-yellow px-3 py-1 text-xl font-extrabold text-ground" aria-hidden="true">DNF</span>
      <h1 class="disp text-8xl leading-[.9] font-black italic">Off track</h1>
      <p class="text-lg text-soft">This page isn't on the circuit. Head back to the pit wall to see the projects.</p>
      <a class="btn btn-light" routerLink="/">Back to the pit wall</a>
    </section>
  `,
})
export class NotFoundPage {
  constructor() {
    inject(Seo).set('Off track | David Soldat', "This page isn't on the circuit.", { noindex: true });
  }
}
