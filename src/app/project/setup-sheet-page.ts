import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-setup-sheet-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p>{{ slug() }}</p>`,
})
export class SetupSheetPage {
  readonly slug = input.required<string>();
}
