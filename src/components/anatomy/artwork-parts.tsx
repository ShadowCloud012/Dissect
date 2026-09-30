import type { ReactNode } from 'react';
import type { ArtworkProps } from './artwork';

// Shared drawing helpers for procedure artworks: a selectable structure
// shape, a top layer of numbered markers (so later shapes never hide them),
// and small context labels. Pointer targets only; keyboard and screen-reader
// users select the same structures from the viewer's labelled buttons.
export function Part({
  id,
  props,
  children,
}: {
  id: string;
  props: ArtworkProps;
  children: ReactNode;
}) {
  return (
    <g
      className="anatomy-part"
      data-structure={id}
      data-state={props.stateOf(id)}
      data-risk={props.riskShown(id) ? '' : undefined}
      onClick={() => props.onSelect(id)}
    >
      {children}
    </g>
  );
}
export function Markers({
  markers,
  props,
}: {
  markers: Record<string, readonly [number, number]>;
  props: ArtworkProps;
}) {
  return (
    <>
      {Object.entries(markers).map(([id, [x, y]]) => (
        <g
          key={id}
          className="anatomy-part"
          data-marker={id}
          data-state={props.stateOf(id)}
          data-risk={props.riskShown(id) ? '' : undefined}
          onClick={() => props.onSelect(id)}
        >
          <g className="anatomy-marker" transform={`translate(${x} ${y})`}>
            <circle r="13" />
            <text textAnchor="middle" dy="4">
              {props.numberOf(id)}
            </text>
          </g>
        </g>
      ))}
    </>
  );
}
// Unselectable context anatomy is named only where it orients the reader.
export function ContextLabel({
  x,
  y,
  children,
}: {
  x: number;
  y: number;
  children: string;
}) {
  return (
    <text
      className="anatomy-context-label"
      x={x}
      y={y}
      textAnchor="middle"
      aria-hidden="true"
    >
      {children}
    </text>
  );
}
