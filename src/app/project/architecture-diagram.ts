import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Diagram, DiagramEdge, EdgeKind } from '../content/types';

const EDGE_COLOR: Record<EdgeKind, string> = {
  default: '#6B6B7B', event: 'var(--color-yellow)', model: 'var(--color-green)', auth: '#6B6B7B',
};

@Component({
  selector: 'app-architecture-diagram',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <figure>
      <div class="scroll">
        <svg [attr.viewBox]="'0 0 ' + diagram().width + ' ' + diagram().height"
             [attr.width]="diagram().width" [attr.height]="diagram().height"
             role="img" [attr.aria-label]="'Architecture of ' + title()">
          <defs>
            @for (k of kinds; track k) {
              <marker [attr.id]="'arrow-' + k" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
                <path d="M0 0 L8 4 L0 8 Z" [style.fill]="edgeColor[k]" />
              </marker>
            }
          </defs>
          @for (n of diagram().nodes; track n.id) {
            <g [class]="'node node-' + n.kind">
              <rect [attr.x]="n.x" [attr.y]="n.y" [attr.width]="n.w" [attr.height]="n.h" />
              <text [attr.x]="n.x + n.w / 2" [attr.y]="n.y + n.h / 2 + (n.detail ? -4 : 6)" class="t">{{ n.title }}</text>
              @if (n.detail) {
                <text [attr.x]="n.x + n.w / 2" [attr.y]="n.y + n.h / 2 + 15" class="d">{{ n.detail }}</text>
              }
            </g>
          }
          @for (e of diagram().edges; track $index) {
            <polyline [class]="'edge edge-' + (e.kind ?? 'default')" [attr.points]="points(e)"
                      [attr.marker-end]="e.arrow === false ? null : 'url(#arrow-' + (e.kind ?? 'default') + ')'" />
          }
          @for (e of labelled(); track $index) {
            <text [attr.x]="e.label!.x" [attr.y]="e.label!.y" class="lbl">{{ e.label!.text }}</text>
          }
        </svg>
      </div>
      <figcaption class="sr-only">
        <ul>
          @for (e of diagram().edges; track $index) {
            <li>{{ nameOf(e.from) }} to {{ nameOf(e.to) }}@if (e.label) {, {{ e.label.text }}}</li>
          }
        </ul>
      </figcaption>
    </figure>
  `,
  styles: `
    figure { margin: 0; }
    .scroll { overflow-x: auto; background: var(--color-panel); border: 1px solid var(--color-line); }
    svg { display: block; margin: 0 auto; }
    rect { fill: var(--color-panel-2); stroke-width: 2; }
    .node-app rect { stroke: var(--color-purple); }
    .node-service rect { stroke: var(--color-muted); }
    .node-model rect { stroke: var(--color-green); }
    .node-store rect { stroke: #6B6B7B; fill: var(--color-ground); }
    .node-external rect { stroke: #6B6B7B; stroke-dasharray: 6 5; fill: var(--color-ground); }
    .node-bus rect { stroke: var(--color-yellow); fill: #2A2410; }
    text { text-anchor: middle; font-family: var(--font-body); }
    .t { fill: var(--color-text); font-size: 15px; font-weight: 600; }
    .node-bus .t { fill: var(--color-yellow); font-family: var(--font-display); font-size: 19px; font-weight: 800; }
    .d { fill: var(--color-muted); font-size: 13px; }
    .edge { fill: none; stroke-width: 2; stroke-linejoin: round; }
    .edge-default { stroke: #6B6B7B; }
    .edge-event { stroke: var(--color-yellow); }
    .edge-model { stroke: var(--color-green); }
    .edge-auth { stroke: #6B6B7B; stroke-dasharray: 6 6; }
    .lbl { fill: var(--color-muted); font-size: 13px; }
  `,
})
export class ArchitectureDiagram {
  readonly diagram = input.required<Diagram>();
  readonly title = input.required<string>();

  protected readonly kinds: EdgeKind[] = ['default', 'event', 'model', 'auth'];
  protected readonly edgeColor = EDGE_COLOR;
  protected readonly labelled = computed(() => this.diagram().edges.filter((e) => !!e.label));
  private readonly names = computed(() => new Map(this.diagram().nodes.map((n) => [n.id, n.title])));

  protected points(e: DiagramEdge): string {
    return e.points.map(([x, y]) => `${x},${y}`).join(' ');
  }

  protected nameOf(id: string): string {
    return this.names().get(id) ?? id;
  }
}
