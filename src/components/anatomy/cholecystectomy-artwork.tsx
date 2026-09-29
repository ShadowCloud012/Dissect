import type { ReactNode } from 'react';
import type { ArtworkProps } from './artwork';

// Schematic laparoscopic view for cholecystectomy: simplified and not to
// scale, fundus retracted towards the right shoulder. It draws only
// relationships stated in the sourced content: the gallbladder on the
// underside of the liver; the cystic duct joining the common bile duct, with
// the common hepatic duct above that junction; the hepatocystic triangle
// bounded by the cystic duct, common hepatic duct and liver edge, and
// containing the cystic artery, which enters the gallbladder with the cystic
// duct. The artery's origin is off the drawing because its course varies.
const markers: Record<string, [number, number]> = {
  gallbladder: [262, 104],
  'hepatocystic-triangle': [148, 166],
  'cystic-duct': [172, 200],
  'cystic-artery': [160, 116],
  'common-hepatic-duct': [86, 150],
  'common-bile-duct': [96, 262],
};

export function CholecystectomyArtwork({
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
      {/* Liver: context only; its inferior edge bounds the triangle. */}
      <path
        className="anatomy-context"
        d="M0 0 H320 V66 C270 80 220 84 180 90 C150 94 124 98 100 100 C60 104 30 104 0 102 Z"
        aria-hidden="true"
      />
      {part(
        'hepatocystic-triangle',
        <path
          className="anatomy-fold"
          d="M110 100 C136 97 158 94 184 91 L184 156 C166 172 146 190 122 205 Z"
        />,
      )}
      {part(
        'gallbladder',
        <path
          className="anatomy-organ"
          d="M300 40 C320 70 300 118 256 140 C228 154 200 160 184 158 C170 156 170 142 182 132 C206 110 238 76 268 46 C280 34 294 32 300 40 Z"
        />,
      )}
      {part(
        'common-hepatic-duct',
        <>
          <path className="anatomy-duct-outline" d="M110 98 L120 206" />
          <path className="anatomy-duct" d="M110 98 L120 206" />
        </>,
      )}
      {part(
        'common-bile-duct',
        <>
          <path className="anatomy-duct-outline" d="M120 206 L128 296" />
          <path className="anatomy-duct" d="M120 206 L128 296" />
        </>,
      )}
      {part(
        'cystic-duct',
        <>
          <path
            className="anatomy-duct-outline anatomy-duct-small"
            d="M184 156 C166 172 146 190 122 205"
          />
          <path
            className="anatomy-duct anatomy-duct-small"
            d="M184 156 C166 172 146 190 122 205"
          />
        </>,
      )}
      {part(
        'cystic-artery',
        <path
          className="anatomy-vessel"
          d="M134 128 C152 126 168 128 190 134"
        />,
      )}
    </>
  );
}
