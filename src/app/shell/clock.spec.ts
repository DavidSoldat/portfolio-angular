import { formatClock } from './clock';

describe('formatClock', () => {
  it('shows Banja Luka winter time (UTC+1)', () => {
    expect(formatClock(new Date('2026-01-15T12:00:05Z'))).toBe('13:00:05');
  });
  it('shows Banja Luka summer time (UTC+2)', () => {
    expect(formatClock(new Date('2026-07-15T23:30:00Z'))).toBe('01:30:00');
  });
});
