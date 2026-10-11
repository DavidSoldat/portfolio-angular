import { TestBed } from '@angular/core/testing';
import { PROJECTS } from '../content/projects';
import { ArchitectureDiagram } from './architecture-diagram';

async function render(index = 0) {
  const fixture = TestBed.createComponent(ArchitectureDiagram);
  fixture.componentRef.setInput('diagram', PROJECTS[index].diagram);
  fixture.componentRef.setInput('title', PROJECTS[index].title);
  await fixture.whenStable();
  return fixture.nativeElement as HTMLElement;
}

describe('ArchitectureDiagram', () => {
  it('draws a box per node and a line per edge', async () => {
    const el = await render(0);
    const d = PROJECTS[0].diagram;
    expect(el.querySelectorAll('g.node').length).toBe(d.nodes.length);
    expect(el.querySelectorAll('polyline.edge').length).toBe(d.edges.length);
  });

  it('leaves arrowheads off edges marked arrow: false', async () => {
    const el = await render(0);
    const lines = Array.from(el.querySelectorAll('polyline.edge'));
    const withoutArrow = PROJECTS[0].diagram.edges.filter((e) => e.arrow === false).length;
    expect(lines.filter((l) => !l.getAttribute('marker-end')).length).toBe(withoutArrow);
  });

  it('labels the figure and lists every connection for screen readers', async () => {
    const el = await render(1);
    expect(el.querySelector('svg')?.getAttribute('aria-label')).toContain('Sentra');
    const items = el.querySelectorAll('figcaption li');
    expect(items.length).toBe(PROJECTS[1].diagram.edges.length);
    expect(items[0].textContent).toContain('Next.js app to Spring Boot API');
  });
});
