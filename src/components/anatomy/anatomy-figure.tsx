'use client';
import type { ResolvedAnatomyView } from '@/lib/topic-pages';
import { anatomyArtwork, orientationCues, type ArtworkProps } from './artwork';

// The drawing itself, shared by the full viewer and compact summaries so
// both show the same artwork, orientation cue and schematic disclaimer.
export function AnatomyFigure({
  view,
  ...props
}: ArtworkProps & { view: ResolvedAnatomyView }) {
  const artwork = anatomyArtwork[view.id];
  const orientation = orientationCues[artwork.orientation];
  const Artwork = artwork.Component;
  return (
    <figure className="anatomy-figure">
      {/* Laterality cannot be misread: every artwork declares its view. */}
      <p className="anatomy-orientation-summary">{orientation.summary}</p>
      <p className="anatomy-orientation" aria-hidden="true">
        <span>← {orientation.viewerLeft}</span>
        <span>{orientation.viewerRight} →</span>
      </p>
      <svg
        viewBox={artwork.viewBox}
        role="img"
        aria-label={`Schematic: ${view.title}`}
        aria-describedby={`${view.id}-svg-desc`}
      >
        <desc id={`${view.id}-svg-desc`}>
          {`${orientation.summary}. Numbered structures: ${view.structures
            .map((item, index) => `${index + 1} ${item.label}`)
            .join(', ')}. Select them from the list of structures.`}
        </desc>
        <Artwork {...props} />
      </svg>
      <figcaption>
        Schematic, not to scale: it shows relationships described in the sourced
        anatomy text.
        {artwork.legend && ` ${artwork.legend}`}
      </figcaption>
    </figure>
  );
}
