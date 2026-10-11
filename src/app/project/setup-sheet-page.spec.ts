import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { SetupSheetPage } from './setup-sheet-page';
import { SelectionService } from '../selection';

async function render(slug: string) {
  TestBed.configureTestingModule({ providers: [provideRouter([])] });
  const fixture = TestBed.createComponent(SetupSheetPage);
  fixture.componentRef.setInput('slug', slug);
  await fixture.whenStable();
  return { fixture, el: fixture.nativeElement as HTMLElement };
}

describe('SetupSheetPage', () => {
  it('renders the project sheet for a known slug', async () => {
    const { el } = await render('sentra');
    expect(el.querySelector('h1')?.textContent).toContain('Sentra');
    expect(el.querySelectorAll('.spec > div').length).toBe(8);
    expect(el.querySelector('app-architecture-diagram')).toBeTruthy();
    expect(el.querySelectorAll('.sectors li').length).toBe(3);
    expect(TestBed.inject(Title).getTitle()).toBe('Sentra | David Soldat');
    expect(TestBed.inject(SelectionService).selected()).toBe('sentra');
  });

  it('renders the not-found page for an unknown slug', async () => {
    const { el } = await render('ferrari');
    expect(el.querySelector('app-not-found-page h1')?.textContent).toContain('Off track');
    expect(TestBed.inject(Title).getTitle()).toBe('Off track | David Soldat');
  });

  it('wraps previous and next around the ends', async () => {
    const { el } = await render('bridgepay');
    expect(el.querySelector('a.prev')?.getAttribute('href')).toBe('/projects/homequest');
    expect(el.querySelector('a.next')?.getAttribute('href')).toBe('/projects/sentra');
  });

  it('shows labelled placeholders for missing screenshots', async () => {
    const { el } = await render('trucknest');
    expect(el.querySelectorAll('.shot .placeholder').length).toBe(3);
  });

  it('remembers the project for the dashboard flash when leaving', async () => {
    const { fixture } = await render('datalytics');
    fixture.destroy();
    expect(TestBed.inject(SelectionService).returningFrom()).toBe('datalytics');
  });
});
