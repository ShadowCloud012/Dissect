import type { ArtworkProps } from './artwork';
import { ContextLabel, Markers, Part } from './artwork-parts';

// Anterior anatomical schematic of the gallbladder and hepatocystic triangle:
// the patient's right is on the viewer's left. Simplified and not to scale;
// not a laparoscopic camera view. It draws only relationships stated in the
// sourced content:
// - the gallbladder on the underside of the liver (context), with fundus,
//   body, infundibulum and neck;
// - the cystic duct joining the common bile duct, with the common hepatic
//   duct above that junction;
// - the hepatocystic triangle bounded by the cystic duct, the common hepatic
//   duct and the edge of the liver, containing the cystic artery, which
//   enters the gallbladder beside the cystic duct. The artery is drawn
//   without its origin because its origin and course vary.
export const cholecystectomyMarkers = {
  gallbladder: [78, 188],
  'hepatocystic-triangle': [198, 150],
  'cystic-duct': [170, 192],
  'cystic-artery': [176, 104],
  'common-hepatic-duct': [250, 146],
  'common-bile-duct': [256, 262],
} as const;

export function CholecystectomyArtwork(props: ArtworkProps) {
  return (
    <>
      {/* Context: the liver and its inferior edge. Not selectable. */}
      <path
        className="anatomy-context"
        aria-hidden="true"
        d="M0 0 H320 V72 C300 82 278 92 250 97 C226 101 200 102 180 104 C150 106 124 110 100 116 C66 124 34 138 0 152 Z"
      />
      <ContextLabel x={56} y={44}>
        Liver
      </ContextLabel>
      <Part id="hepatocystic-triangle" props={props}>
        <path
          className="anatomy-fold"
          d="M148 108 C170 106 196 103 219 102 L221 206 C196 180 170 150 150 126 C152 120 152 112 148 108 Z"
        />
      </Part>
      <Part id="gallbladder" props={props}>
        {/* Fundus inferolateral, tapering through body and infundibulum to
            the neck beneath the liver edge. */}
        <path
          className="anatomy-organ"
          d="M150 120 C146 104 128 98 110 100 C86 104 62 126 48 156 C36 184 34 216 52 228 C70 238 92 222 108 200 C120 184 128 168 136 156 C142 146 152 134 150 120 Z"
        />
      </Part>
      <Part id="common-hepatic-duct" props={props}>
        <path className="anatomy-duct-outline" d="M220 100 L222 206" />
        <path className="anatomy-duct" d="M220 100 L222 206" />
      </Part>
      <Part id="common-bile-duct" props={props}>
        <path
          className="anatomy-duct-outline"
          d="M222 206 C224 240 226 270 230 300"
        />
        <path className="anatomy-duct" d="M222 206 C224 240 226 270 230 300" />
      </Part>
      <Part id="cystic-duct" props={props}>
        <path
          className="anatomy-duct-outline anatomy-duct-small"
          d="M150 126 C170 150 196 180 220 206"
        />
        <path
          className="anatomy-duct anatomy-duct-small"
          d="M150 126 C170 150 196 180 220 206"
        />
      </Part>
      <Part id="cystic-artery" props={props}>
        <path
          className="anatomy-vessel"
          d="M208 132 C190 128 170 124 152 118"
        />
      </Part>
      <Markers markers={cholecystectomyMarkers} props={props} />
    </>
  );
}
