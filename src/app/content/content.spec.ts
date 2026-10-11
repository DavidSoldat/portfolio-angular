import { PROJECTS } from './projects';
import { CHANNELS } from './stack';
import { PROFILE } from './profile';

describe('content', () => {
  it('has five projects in the agreed order', () => {
    expect(PROJECTS.map((p) => p.slug)).toEqual(['bridgepay', 'sentra', 'trucknest', 'datalytics', 'homequest']);
  });

  it('uses unique slugs and three-letter codes', () => {
    expect(new Set(PROJECTS.map((p) => p.slug)).size).toBe(PROJECTS.length);
    expect(new Set(PROJECTS.map((p) => p.code)).size).toBe(PROJECTS.length);
    PROJECTS.forEach((p) => expect(p.code).toMatch(/^[A-Z]{3}$/));
  });

  it('marks only BridgePay as fastest', () => {
    expect(PROJECTS.filter((p) => p.fastest).map((p) => p.slug)).toEqual(['bridgepay']);
  });

  it('gives every project exactly three sectors and at least one link', () => {
    PROJECTS.forEach((p) => {
      expect(p.sectors.length).toBe(3);
      expect(p.links.github ?? p.links.live).toBeTruthy();
    });
  });

  it('keeps every diagram edge inside its diagram and between known nodes', () => {
    PROJECTS.forEach(({ slug, diagram }) => {
      const ids = new Set(diagram.nodes.map((n) => n.id));
      expect(ids.size, `${slug} duplicate node ids`).toBe(diagram.nodes.length);
      diagram.nodes.forEach((n) => {
        expect(n.x + n.w, `${slug}/${n.id}`).toBeLessThanOrEqual(diagram.width);
        expect(n.y + n.h, `${slug}/${n.id}`).toBeLessThanOrEqual(diagram.height);
      });
      diagram.edges.forEach((e, i) => {
        expect(ids.has(e.from), `${slug} edge ${i} from`).toBe(true);
        expect(ids.has(e.to), `${slug} edge ${i} to`).toBe(true);
        expect(e.points.length).toBeGreaterThanOrEqual(2);
        e.points.forEach(([x, y]) => {
          expect(x).toBeGreaterThanOrEqual(0);
          expect(x).toBeLessThanOrEqual(diagram.width);
          expect(y).toBeGreaterThanOrEqual(0);
          expect(y).toBeLessThanOrEqual(diagram.height);
        });
      });
    });
  });

  it('has the stack channels and profile links', () => {
    expect(CHANNELS.map((c) => c.name)).toEqual(['Backend', 'Frontend', 'AI and ML', 'Delivery']);
    expect(PROFILE.links.linkedin).toBe('https://www.linkedin.com/in/david-soldat-tsx/');
    expect(JSON.stringify(PROFILE)).not.toMatch(/twitter|x\.com/i);
  });
});
