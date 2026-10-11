import { TestBed } from '@angular/core/testing';
import { DriverProfile } from './driver-profile';
import { Telemetry } from './telemetry';

describe('DriverProfile', () => {
  it('shows the bio and four facts, and no photo', async () => {
    const fixture = TestBed.createComponent(DriverProfile);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain("I'm David");
    expect(el.querySelectorAll('dt').length).toBe(4);
    expect(el.querySelector('img')).toBeNull();
  });
});

describe('Telemetry', () => {
  it('shows each channel with its items', async () => {
    const fixture = TestBed.createComponent(Telemetry);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelectorAll('.channel').length).toBe(4);
    expect(el.textContent).toContain('Spring Modulith');
  });
});
