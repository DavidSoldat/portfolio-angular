import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { DashboardPage } from './dashboard-page';
import { SelectionService } from '../selection';

describe('DashboardPage', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()] }));

  it('shows the selected project and switches when a tower row is clicked', async () => {
    const fixture = TestBed.createComponent(DashboardPage);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('app-onboard-panel h1')?.textContent).toContain('BridgePay');
    (el.querySelectorAll('button.row')[3] as HTMLButtonElement).click();
    await fixture.whenStable();
    expect(el.querySelector('app-onboard-panel h1')?.textContent).toContain('Datalytics');
    expect(TestBed.inject(SelectionService).selected()).toBe('datalytics');
  });

  it('sets the page title', async () => {
    const fixture = TestBed.createComponent(DashboardPage);
    await fixture.whenStable();
    expect(TestBed.inject(Title).getTitle()).toBe('David Soldat | Software engineer');
  });
});
