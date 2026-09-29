import type { ComponentType } from 'react';
import { AppendicectomyArtwork } from './appendicectomy-artwork';

// How the viewer asks a procedure-specific artwork to draw each structure.
// Artwork draws shapes only: names and every statement come from content.
export type StructureState = 'selected' | 'emphasised' | 'dimmed' | 'normal';
export type ArtworkProps = {
  stateOf: (id: string) => StructureState;
  numberOf: (id: string) => number;
  // Structures drawn with a dashed outline while their risk is shown.
  riskShown: (id: string) => boolean;
  onSelect: (id: string) => void;
};
export type Artwork = {
  // Every structure the artwork draws; must match the view's structures.
  structureIds: readonly string[];
  Component: ComponentType<ArtworkProps>;
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
  },
};
