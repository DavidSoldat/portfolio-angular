import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { LightsOut, introMode } from './lights-out';

describe('introMode', () => {
  it.each([
    [false, false, 'full'],
    [true, false, 'short'],
    [false, true, 'none'],
    [true, true, 'none'],
  ] as const)('seen=%s reduced=%s → %s', (seen, reduced, mode) => {
    expect(introMode(seen, reduced)).toBe(mode);
  });
});

describe('LightsOut', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    sessionStorage.clear();
    document.documentElement.classList.add('intro-pending');
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    document.documentElement.classList.remove('intro-pending', 'launch');
  });

  function create() {
    const fixture = TestBed.createComponent(LightsOut);
    fixture.detectChanges();
    TestBed.tick(); // runs afterNextRender hooks in zoneless tests
    return fixture.componentInstance;
  }

  it('plays the full sequence on the first visit and reveals the page', async () => {
    const c = create();
    expect(c.phase()).toBe('ignition');
    await vi.advanceTimersByTimeAsync(1200);
    expect(c.phase()).toBe('lights');
    await vi.advanceTimersByTimeAsync(2000);
    expect(c.lit()).toBe(5);
    await vi.advanceTimersByTimeAsync(200);
    expect(c.phase()).toBe('out');
    await vi.advanceTimersByTimeAsync(200);
    expect(c.phase()).toBe('launch');
    expect(document.documentElement.classList.contains('intro-pending')).toBe(false);
    await vi.advanceTimersByTimeAsync(900);
    expect(c.phase()).toBe('done');
    expect(sessionStorage.getItem('pw-intro-seen')).toBe('1');
  });

  it('plays only the launch beat when already seen this session', async () => {
    sessionStorage.setItem('pw-intro-seen', '1');
    const c = create();
    expect(c.phase()).toBe('launch');
    await vi.advanceTimersByTimeAsync(900);
    expect(c.phase()).toBe('done');
  });

  it('jumps to launch when skipped', async () => {
    const c = create();
    await vi.advanceTimersByTimeAsync(1600);
    c.skip();
    expect(c.phase()).toBe('launch');
    await vi.advanceTimersByTimeAsync(900);
    expect(c.phase()).toBe('done');
  });

  it('still plays and ends when sessionStorage throws', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
    const c = create();
    expect(c.phase()).toBe('ignition');
    await vi.advanceTimersByTimeAsync(5000);
    expect(c.phase()).toBe('done');
  });

  it('shows nothing and reveals the page under reduced motion', () => {
    vi.stubGlobal('matchMedia', (q: string) => ({ matches: q.includes('reduce') }) as MediaQueryList);
    const c = create();
    expect(c.phase()).toBe('done');
    expect(document.documentElement.classList.contains('intro-pending')).toBe(false);
    vi.unstubAllGlobals();
  });
});
