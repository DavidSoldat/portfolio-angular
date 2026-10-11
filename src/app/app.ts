import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './shell/header';
import { LightsOut } from './shell/lights-out';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, LightsOut],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="skip-link" href="#main">Skip to content</a>
    <div class="stage">
      <app-header />
      <main id="main" tabindex="-1"><router-outlet /></main>
    </div>
    <app-lights-out />
  `,
})
export class App {}
