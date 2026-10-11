import { TestBed } from '@angular/core/testing';
import { PROJECTS } from '../content/projects';
import { TimingTower } from './timing-tower';

async function setup(selected = 'bridgepay') {
  const fixture = TestBed.createComponent(TimingTower);
  fixture.componentRef.setInput('projects', PROJECTS);
  fixture.componentRef.setInput('selected', selected);
  const emitted: string[] = [];
  fixture.componentInstance.select.subscribe((s) => emitted.push(s));
  await fixture.whenStable();
  const rows = Array.from(fixture.nativeElement.querySelectorAll('button.row')) as HTMLButtonElement[];
  return { fixture, emitted, rows };
}

describe('TimingTower', () => {
  it('renders a row per project with positions and codes', async () => {
    const { rows } = await setup();
    expect(rows.length).toBe(5);
    expect(rows[0].textContent).toContain('1');
    expect(rows[0].textContent).toContain('BRP');
    expect(rows[4].textContent).toContain('HMQ');
  });

  it('marks only the selected row as pressed', async () => {
    const { rows } = await setup('sentra');
    expect(rows.map((r) => r.getAttribute('aria-pressed'))).toEqual(['false', 'true', 'false', 'false', 'false']);
  });

  it('emits the slug of a clicked row', async () => {
    const { rows, emitted } = await setup();
    rows[2].click();
    expect(emitted).toEqual(['trucknest']);
  });

  it('moves down with ArrowDown and wraps from the last row to the first', async () => {
    const { rows, emitted } = await setup('homequest');
    rows[4].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(emitted).toEqual(['bridgepay']);
    expect(document.activeElement === rows[0] || !document.body.contains(rows[0])).toBe(true);
  });

  it('moves up with ArrowUp and wraps from the first row to the last', async () => {
    const { rows, emitted } = await setup('bridgepay');
    rows[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    expect(emitted).toEqual(['homequest']);
  });

  it('ignores other keys', async () => {
    const { rows, emitted } = await setup();
    rows[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(emitted).toEqual([]);
  });
});
