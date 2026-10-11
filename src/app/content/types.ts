export type SectorKind = 'architecture' | 'data' | 'delivery';

export interface Sector {
  kind: SectorKind;
  /** One line for the dashboard. */
  short: string;
  /** Heading and paragraph for the setup sheet. */
  heading: string;
  body: string;
}

export type NodeKind = 'app' | 'service' | 'model' | 'store' | 'external' | 'bus';
export interface DiagramNode {
  id: string; x: number; y: number; w: number; h: number;
  kind: NodeKind; title: string; detail?: string;
}
export type EdgeKind = 'default' | 'event' | 'model' | 'auth';
export interface DiagramEdge {
  from: string; to: string;
  points: [number, number][];
  kind?: EdgeKind;
  /** Defaults to true. */
  arrow?: boolean;
  label?: { text: string; x: number; y: number };
}
export interface Diagram { width: number; height: number; nodes: DiagramNode[]; edges: DiagramEdge[]; }

/** A screenshot. Without `src` it renders as a labelled placeholder. */
export interface Shot { src?: string; alt: string; caption: string; }

export interface Project {
  slug: string;
  code: string;
  title: string;
  name: string;
  blurb: string;
  intro: string;
  teamColor: string;
  tag: string;
  fastest?: boolean;
  sectors: [Sector, Sector, Sector];
  setup: { part: string; value: string }[];
  stack: string[];
  links: { github?: string; live?: string };
  diagram: Diagram;
  shots: Shot[];
}

export const SECTOR_COLOR: Record<SectorKind, string> = {
  architecture: 'var(--purple)',
  data: 'var(--green)',
  delivery: 'var(--yellow)',
};

export const SECTOR_NAME: Record<SectorKind, string> = {
  architecture: 'Architecture',
  data: 'Data and AI',
  delivery: 'Delivery and integrations',
};
