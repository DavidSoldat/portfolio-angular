import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PROJECTS } from '../content/projects';
import { OnboardPanel } from './onboard-panel';

async function render(index: number) {
  TestBed.configureTestingModule({ providers: [provideRouter([])] });
  const fixture = TestBed.createComponent(OnboardPanel);
  fixture.componentRef.setInput('project', PROJECTS[index]);
  fixture.componentRef.setInput('position', index + 1);
  await fixture.whenStable();
  return fixture.nativeElement as HTMLElement;
}

describe('OnboardPanel', () => {
  it('shows the project title, position, three sectors and the setup sheet link', async () => {
    const el = await render(0);
    expect(el.querySelector('h1')?.textContent).toContain('BridgePay');
    expect(el.querySelector('.pos')?.textContent?.trim()).toBe('1');
    expect(el.querySelectorAll('.sectors li').length).toBe(3);
    expect(el.querySelector('a[href="/projects/bridgepay"]')).toBeTruthy();
  });

  it('shows the fastest lap badge only for the fastest project', async () => {
    expect((await render(0)).querySelector('.fastest')).toBeTruthy();
    TestBed.resetTestingModule();
    expect((await render(1)).querySelector('.fastest')).toBeNull();
  });

  it('links to the code on GitHub', async () => {
    const el = await render(1);
    expect(el.querySelector('a[href="https://github.com/DavidSoldat/Sentra"]')?.textContent).toContain('View code');
  });

  it('draws three sector strokes on the track', async () => {
    const el = await render(2);
    expect(el.querySelectorAll('app-track-map path.sector').length).toBe(3);
  });
});
