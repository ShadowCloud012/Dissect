import type { ReactNode } from 'react';
import type { ArtworkProps } from './artwork';

// Schematic right iliac fossa for laparoscopic appendicectomy: simplified and
// not to scale. It draws only relationships stated in the sourced content:
// the appendix arising from the caecum where the taeniae converge, the
// terminal ileum joining the caecum, the mesoappendix carrying the
// appendicular artery close to its free margin, and that artery arising from
// the ileocolic artery and passing posterior to the terminal ileum (dashed).
const markers: Record<string, [number, number]> = {
  caecum: [284, 196],
  'taeniae-coli': [262, 72],
  'terminal-ileum': [56, 128],
  appendix: [96, 282],
  'appendix-base': [256, 252],
  mesoappendix: [196, 222],
  'appendicular-artery': [120, 206],
  'ileocolic-artery': [58, 38],
};

export function AppendicectomyArtwork({
  stateOf,
  numberOf,
  riskShown,
  onSelect,
}: ArtworkProps) {
  // Pointer targets only; keyboard and screen-reader users select the same
  // structures from the labelled list beside the drawing.
  const part = (id: string, children: ReactNode) => (
    <g
      className="anatomy-part"
      data-structure={id}
      data-state={stateOf(id)}
      data-risk={riskShown(id) ? '' : undefined}
      onClick={() => onSelect(id)}
    >
      {children}
      <g className="anatomy-marker" transform={`translate(${markers[id]})`}>
        <circle r="13" />
        <text textAnchor="middle" dy="4">
          {numberOf(id)}
        </text>
      </g>
    </g>
  );
  return (
    <>
      {/* Ascending colon: context only, not a selectable structure. */}
      <path
        className="anatomy-context"
        d="M222 6 H306 V122 H222 Z"
        aria-hidden="true"
      />
      {part(
        'caecum',
        <path
          className="anatomy-organ"
          d="M222 120 H306 C312 160 314 200 298 222 C282 244 248 248 234 238 C218 228 214 198 216 160 Z"
        />,
      )}
      {part(
        'mesoappendix',
        <path
          className="anatomy-fold"
          d="M150 168 L214 190 L230 234 C220 260 196 278 166 283 C144 286 130 279 122 266 Z"
        />,
      )}
      {part(
        'terminal-ileum',
        <>
          <path
            className="anatomy-tube-outline"
            d="M10 150 C90 138 160 150 220 178"
          />
          <path className="anatomy-tube" d="M10 150 C90 138 160 150 220 178" />
        </>,
      )}
      {part(
        'ileocolic-artery',
        <path className="anatomy-vessel" d="M44 30 C94 62 142 94 180 118" />,
      )}
      {part(
        'appendicular-artery',
        <>
          {/* Posterior to the terminal ileum. */}
          <path
            className="anatomy-vessel anatomy-hidden"
            d="M180 118 L172 170"
          />
          <path
            className="anatomy-vessel"
            d="M172 170 C160 204 146 234 134 262 M152 222 L172 250 M142 246 L152 268"
          />
        </>,
      )}
      {part(
        'taeniae-coli',
        <path
          className="anatomy-band"
          d="M246 8 C244 110 238 190 233 234 M286 8 C288 120 278 200 235 236"
        />,
      )}
      {part(
        'appendix',
        <>
          <path
            className="anatomy-tube-outline anatomy-tube-small"
            d="M233 236 C224 264 198 282 166 286 C142 289 126 282 118 268"
          />
          <path
            className="anatomy-tube anatomy-tube-small"
            d="M233 236 C224 264 198 282 166 286 C142 289 126 282 118 268"
          />
        </>,
      )}
      {part(
        'appendix-base',
        <circle className="anatomy-point" cx="233" cy="236" r="7" />,
      )}
    </>
  );
}
