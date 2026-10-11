import { transitionKind } from './transitions';

describe('transitionKind', () => {
  it('opens a project from the dashboard', () => {
    expect(transitionKind('', 'projects/sentra')).toEqual({ kind: 'open', slug: 'sentra' });
  });
  it('closes back to the dashboard', () => {
    expect(transitionKind('projects/sentra', '')).toEqual({ kind: 'close', slug: 'sentra' });
  });
  it('detects next and previous', () => {
    expect(transitionKind('projects/sentra', 'projects/trucknest')).toEqual({ kind: 'next', slug: 'trucknest' });
    expect(transitionKind('projects/trucknest', 'projects/sentra')).toEqual({ kind: 'prev', slug: 'sentra' });
  });
  it('wraps: previous from P1 is P5, next from P5 is P1', () => {
    expect(transitionKind('projects/bridgepay', 'projects/homequest')).toEqual({ kind: 'prev', slug: 'homequest' });
    expect(transitionKind('projects/homequest', 'projects/bridgepay')).toEqual({ kind: 'next', slug: 'bridgepay' });
  });
  it('falls back to plain for anything else', () => {
    expect(transitionKind('', 'nowhere')).toEqual({ kind: 'plain' });
    expect(transitionKind('projects/ferrari', '')).toEqual({ kind: 'plain' });
  });
});
