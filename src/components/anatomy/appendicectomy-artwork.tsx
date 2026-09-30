import type { ArtworkProps } from './artwork';
import { ContextLabel, Markers, Part } from './artwork-parts';

// Anterior anatomical schematic of the right iliac fossa: the patient's right
// is on the viewer's left. Simplified and not to scale. It draws only
// relationships stated in the sourced content:
// - the caecum as the beginning of the large bowel, continuing up as the
//   ascending colon (context, no haustra), with the terminal ileum joining its medial
//   wall near the ileocaecal junction;
// - the appendix arising from the posteromedial caecum where the taeniae
//   converge (the base), drawn in one illustrative position;
// - the mesoappendix as a fold between the terminal ileum and the appendix,
//   carrying the appendicular artery close to its free margin;
// - the appendicular artery arising from the ileocolic artery (the most
//   inferior branch of the superior mesenteric artery, context) and passing
//   posterior to the terminal ileum (dashed).
export const appendicectomyMarkers = {
  caecum: [64, 196],
  'taeniae-coli': [80, 72],
  'terminal-ileum': [282, 98],
  appendix: [150, 284],
  'appendix-base': [90, 252],
  mesoappendix: [166, 232],
  'appendicular-artery': [226, 196],
  'ileocolic-artery': [232, 66],
} as const;

export function AppendicectomyArtwork(props: ArtworkProps) {
  return (
    <>
      {/* Context, not selectable (sources in README.md):
          - the ascending colon, a plain continuation of the caecum upwards
            (no haustra: they are not in the sourced content);
          - the superior mesenteric artery, only as the vessel the ileocolic
            artery branches from; it runs out of the frame, with no other
            branches drawn. */}
      <g aria-hidden="true">
        <path
          className="anatomy-context"
          d="M32 0 H118 C122 40 124 90 122 130 H30 C28 90 30 40 32 0 Z"
        />
        <path
          className="anatomy-context-vessel"
          d="M302 0 C300 28 298 48 294 70 C296 86 304 98 320 104"
        />
      </g>
      <ContextLabel x={76} y={16}>
        Ascending colon
      </ContextLabel>
      <Part id="caecum" props={props}>
        <path
          className="anatomy-organ"
          d="M30 128 C22 160 20 196 32 218 C46 244 90 250 112 236 C128 224 134 192 132 162 L124 128 Z"
        />
      </Part>
      <Part id="mesoappendix" props={props}>
        <path
          className="anatomy-fold"
          d="M146 158 C176 178 210 210 228 252 C220 268 204 274 184 272 C152 268 124 252 112 230 C124 200 134 178 146 158 Z"
        />
      </Part>
      <Part id="terminal-ileum" props={props}>
        <path
          className="anatomy-tube-outline"
          d="M320 128 C268 118 200 122 134 148"
        />
        <path className="anatomy-tube" d="M320 128 C268 118 200 122 134 148" />
      </Part>
      <Part id="ileocolic-artery" props={props}>
        <path className="anatomy-vessel" d="M294 70 C250 86 200 100 160 108" />
      </Part>
      <Part id="appendicular-artery" props={props}>
        {/* Posterior to the terminal ileum. */}
        <path className="anatomy-vessel anatomy-hidden" d="M160 108 L162 156" />
        <path
          className="anatomy-vessel"
          d="M162 156 C186 182 208 212 220 246 M184 184 L168 262 M204 212 L194 268"
        />
      </Part>
      <Part id="taeniae-coli" props={props}>
        <path
          className="anatomy-band"
          d="M58 24 C58 120 78 196 110 226 M100 24 C102 120 106 190 111 224"
        />
      </Part>
      <Part id="appendix" props={props}>
        <path
          className="anatomy-tube-outline anatomy-tube-small"
          d="M112 230 C124 252 152 268 184 272 C204 274 220 268 230 256"
        />
        <path
          className="anatomy-tube anatomy-tube-small anatomy-tube-appendix"
          d="M112 230 C124 252 152 268 184 272 C204 274 220 268 230 256"
        />
      </Part>
      <Part id="appendix-base" props={props}>
        <circle className="anatomy-point" cx="112" cy="229" r="7" />
      </Part>
      <Markers markers={appendicectomyMarkers} props={props} />
    </>
  );
}
