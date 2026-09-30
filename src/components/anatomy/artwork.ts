import type { ComponentType } from 'react';
import {
  AppendicectomyArtwork,
  appendicectomyMarkers,
} from './appendicectomy-artwork';
import {
  CholecystectomyArtwork,
  cholecystectomyMarkers,
} from './cholecystectomy-artwork';

// How the viewer asks a procedure-specific artwork to draw each structure.
// Artwork draws shapes only: structure names and every statement come from
// content. Spatial accuracy cannot be proven by tests; see README.md.
export type StructureState = 'selected' | 'emphasised' | 'dimmed' | 'normal';
export type ArtworkProps = {
  stateOf: (id: string) => StructureState;
  numberOf: (id: string) => number;
  // Structures drawn with a dashed outline while their risk is shown.
  riskShown: (id: string) => boolean;
  onSelect: (id: string) => void;
};
// Every production artwork declares its viewpoint. A true laparoscopic
// camera view would need its own orientation and cue.
export type AnatomyOrientation = 'anterior-anatomical';
export const orientationCues: Record<
  AnatomyOrientation,
  { summary: string; viewerLeft: string; viewerRight: string }
> = {
  'anterior-anatomical': {
    summary: 'Anterior view · Patient’s right is on your left',
    viewerLeft: 'Patient R',
    viewerRight: 'Patient L',
  },
};
export type Artwork = {
  // Every structure the artwork draws; must match the view's structures.
  structureIds: readonly string[];
  Component: ComponentType<ArtworkProps>;
  orientation: AnatomyOrientation;
  // SVG viewBox, so each drawing can crop to its own content.
  viewBox: string;
  // Where each structure's numbered marker sits, in viewBox units. Also the
  // basis of the machine-testable laterality checks.
  markers: Record<string, readonly [number, number]>;
  // How to read this drawing (line conventions), not clinical content.
  legend?: string;
};
export const anatomyArtwork: Record<string, Artwork> = {
  'appendicectomy-anatomy': {
    structureIds: [
      'caecum',
      'taeniae-coli',
      'terminal-ileum',
      'appendix',
      'appendix-base',
      'mesoappendix',
      'appendicular-artery',
      'ileocolic-artery',
    ],
    Component: AppendicectomyArtwork,
    orientation: 'anterior-anatomical',
    viewBox: '0 0 320 300',
    markers: appendicectomyMarkers,
    legend:
      'Dashed vessel: posterior to the terminal ileum. Thin vessel at top right: the superior mesenteric artery (context; only its ileocolic branch is drawn). The appendix is drawn in one illustrative position; the position of its tip varies.',
  },
  'cholecystectomy-anatomy': {
    structureIds: [
      'gallbladder',
      'hepatocystic-triangle',
      'cystic-duct',
      'cystic-artery',
      'common-hepatic-duct',
      'common-bile-duct',
    ],
    Component: CholecystectomyArtwork,
    orientation: 'anterior-anatomical',
    viewBox: '0 0 320 300',
    markers: cholecystectomyMarkers,
    legend:
      'The liver is drawn as context, as if its edge were lifted to show the gallbladder and ducts on its underside. The cystic artery is drawn without its origin.',
  },
};
