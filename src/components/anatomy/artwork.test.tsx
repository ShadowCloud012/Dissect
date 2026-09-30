import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { topicRegistry } from '@/content/registry';
import { resolveAnatomyViews } from '@/lib/topic-pages';
import { anatomyArtwork } from './artwork';
import { OperativeAnatomy } from './operative-anatomy';

const views = topicRegistry
  .listTopics()
  .flatMap((metadata) =>
    (
      topicRegistry.getTopic(metadata.specialty, metadata.slug)!.experience
        ?.anatomyViews ?? []
    ).map((view) => ({ topic: metadata, view })),
  );

describe('artwork integrity', () => {
  it('gives every registered anatomy view an artwork with matching structures', () => {
    expect(views.map(({ view }) => view.id)).toEqual([
      'appendicectomy-anatomy',
      'cholecystectomy-anatomy',
    ]);
    for (const { view } of views) {
      const artwork = anatomyArtwork[view.id];
      expect(artwork, view.id).toBeDefined();
      const ids = view.structures.map((structure) => structure.id);
      expect(artwork.structureIds).toEqual(ids);
      // Every structure has exactly one marker, and nothing else does.
      expect(Object.keys(artwork.markers).sort()).toEqual([...ids].sort());
    }
    // No artwork is registered without content.
    expect(Object.keys(anatomyArtwork).sort()).toEqual(
      views.map(({ view }) => view.id).sort(),
    );
  });
  it('declares an explicit viewpoint for every production artwork', () => {
    for (const artwork of Object.values(anatomyArtwork))
      expect(artwork.orientation).toBe('anterior-anatomical');
  });
});

// Tests cannot prove anatomical accuracy (that needs human review; see
// README.md), but they can pin laterality for the declared viewpoint. In an
// anterior view the patient's right is on the viewer's left, so smaller x is
// more lateral on the patient's right.
function geometry(id: string) {
  const artwork = anatomyArtwork[id];
  const [minX, , width] = artwork.viewBox.split(' ').map(Number);
  const midX = minX + width / 2;
  const at = (structure: string) => {
    const [x, y] = artwork.markers[structure];
    return { x, y };
  };
  return { midX, at };
}

describe('anterior laterality invariants', () => {
  it('appendicectomy: the right iliac fossa is on the viewer’s left', () => {
    const { midX, at } = geometry('appendicectomy-anatomy');
    for (const structure of ['caecum', 'appendix-base', 'taeniae-coli'])
      expect(at(structure).x, structure).toBeLessThan(midX);
    // The terminal ileum and ileocolic artery approach from the medial side.
    expect(at('terminal-ileum').x).toBeGreaterThan(at('caecum').x);
    expect(at('ileocolic-artery').x).toBeGreaterThan(at('caecum').x);
    // The appendix base lies inferomedial to the body of the caecum.
    expect(at('appendix-base').x).toBeGreaterThan(at('caecum').x);
    expect(at('appendix-base').y).toBeGreaterThan(at('caecum').y);
  });
  it('cholecystectomy: the gallbladder is on the viewer’s left, lateral to the ducts', () => {
    const { midX, at } = geometry('cholecystectomy-anatomy');
    expect(at('gallbladder').x).toBeLessThan(midX);
    const lateralToMedial = [
      'gallbladder',
      'cystic-duct',
      'common-hepatic-duct',
    ];
    const xs = lateralToMedial.map((structure) => at(structure).x);
    expect(xs).toEqual([...xs].sort((a, b) => a - b));
    // The triangle lies between the gallbladder and the common hepatic duct.
    expect(at('hepatocystic-triangle').x).toBeGreaterThan(at('gallbladder').x);
    expect(at('hepatocystic-triangle').x).toBeLessThan(
      at('common-hepatic-duct').x,
    );
    // The common hepatic duct is above the common bile duct.
    expect(at('common-hepatic-duct').y).toBeLessThan(at('common-bile-duct').y);
  });
});

describe('orientation cue', () => {
  it('states the viewpoint in text and marks the patient’s sides', () => {
    const topic = topicRegistry.getTopic(
      'general-surgery',
      'gallstone-disease',
    )!;
    const [view] = resolveAnatomyViews(topic, 'anatomy');
    render(<OperativeAnatomy view={view} sources={{}} />);
    expect(
      screen.getByText('Anterior view · Patient’s right is on your left'),
    ).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAccessibleDescription(
      /^Anterior view · Patient’s right is on your left\./,
    );
    expect(screen.getByText('← Patient R')).toBeInTheDocument();
    expect(screen.getByText('Patient L →')).toBeInTheDocument();
  });
});
