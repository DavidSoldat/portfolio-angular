import { ActivatedRouteSnapshot, ViewTransitionInfo } from '@angular/router';
import { PROJECTS } from './content/projects';

export type TransitionKind = 'open' | 'close' | 'next' | 'prev' | 'plain';

function indexOf(path: string): number {
  const match = /^projects\/([^/]+)$/.exec(path);
  return match ? PROJECTS.findIndex((p) => p.slug === match[1]) : -1;
}

export function transitionKind(fromPath: string, toPath: string): { kind: TransitionKind; slug?: string } {
  const from = indexOf(fromPath);
  const to = indexOf(toPath);
  if (fromPath === '' && to >= 0) return { kind: 'open', slug: PROJECTS[to].slug };
  if (toPath === '' && from >= 0) return { kind: 'close', slug: PROJECTS[from].slug };
  if (from >= 0 && to >= 0) {
    const n = PROJECTS.length;
    return { kind: (from + 1) % n === to ? 'next' : 'prev', slug: PROJECTS[to].slug };
  }
  return { kind: 'plain' };
}

function pathOf(snapshot: ActivatedRouteSnapshot): string {
  let s = snapshot;
  while (s.firstChild) s = s.firstChild;
  return s.pathFromRoot.flatMap((r) => r.url.map((u) => u.path)).join('/');
}

export function onViewTransition({ transition, from, to }: ViewTransitionInfo): void {
  const { kind, slug } = transitionKind(pathOf(from), pathOf(to));
  const root = document.documentElement;
  const color = PROJECTS.find((p) => p.slug === slug)?.teamColor ?? '#E10600';
  root.dataset['vt'] = kind;
  root.style.setProperty('--vt-color', color);
  transition.finished.finally(() => {
    delete root.dataset['vt'];
    root.style.removeProperty('--vt-color');
  });
}
