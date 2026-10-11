import { Injectable, signal } from '@angular/core';
import { PROJECTS } from './content/projects';

@Injectable({ providedIn: 'root' })
export class SelectionService {
  /** Project shown in the dashboard's onboard panel. */
  readonly selected = signal(PROJECTS[0].slug);
  /** Set when leaving a setup sheet, so the tower can flash that row once. */
  readonly returningFrom = signal<string | null>(null);
}
