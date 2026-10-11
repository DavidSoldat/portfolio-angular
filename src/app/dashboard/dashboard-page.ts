import { ChangeDetectionStrategy, Component, afterNextRender, computed, inject } from '@angular/core';
import { PROFILE } from '../content/profile';
import { PROJECTS } from '../content/projects';
import { Seo } from '../seo';
import { SelectionService } from '../selection';
import { DriverProfile } from './driver-profile';
import { OnboardPanel } from './onboard-panel';
import { TeamRadio } from './team-radio';
import { Telemetry } from './telemetry';
import { TimingTower } from './timing-tower';

@Component({
  selector: 'app-dashboard-page',
  imports: [TimingTower, OnboardPanel, DriverProfile, Telemetry, TeamRadio],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto flex max-w-360 flex-col gap-3.5 p-4 md:px-7 md:pt-5 md:pb-7">
      <div class="grid grid-cols-1 gap-3.5 md:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[330px_minmax(0,1fr)_330px]">
        <app-timing-tower [projects]="projects" [selected]="selection.selected()" [flash]="selection.returningFrom()"
                          (select)="selection.selected.set($event)" />
        <app-onboard-panel [project]="project()" [position]="position()" />
        <app-driver-profile class="md:col-span-2 xl:col-span-1" />
      </div>
      <div class="grid grid-cols-1 gap-3.5 xl:grid-cols-[minmax(0,1fr)_400px]">
        <app-telemetry />
        <app-team-radio />
      </div>
    </div>
  `,
})
export class DashboardPage {
  protected readonly projects = PROJECTS;
  protected readonly selection = inject(SelectionService);
  private readonly index = computed(() => Math.max(0, PROJECTS.findIndex((p) => p.slug === this.selection.selected())));
  protected readonly project = computed(() => PROJECTS[this.index()]);
  protected readonly position = computed(() => this.index() + 1);

  constructor() {
    inject(Seo).set('David Soldat | Software engineer', PROFILE.summary);
    // The tower flashes the row you came back from once, then forgets it.
    afterNextRender(() => setTimeout(() => this.selection.returningFrom.set(null), 1200));
  }
}
