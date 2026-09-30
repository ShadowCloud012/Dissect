# Operative anatomy

`operative-anatomy.tsx` is the one generic viewer. Each procedure supplies an
artwork (`<procedure>-artwork.tsx`) registered in `artwork.ts` with its
structure IDs, marker positions, viewBox, legend and **declared orientation**.
Structure names, roles, statements, step links and sources come from the
topic's `anatomyViews` content, never from the artwork.

## Orientation

Every production artwork declares its viewpoint. The current schematics are
`anterior-anatomical`: the patient's right is on the viewer's left, and the
viewer shows "Anterior view · Patient's right is on your left" with
"Patient R" / "Patient L" markers. A true laparoscopic camera view would be a
different viewpoint and must declare and display it; do not mirror an artwork
without re-auditing every spatial relationship.

## Levels of detail

- **Interactive** — operative structures with sourced metadata, roles and
  step links; one numbered marker each.
- **Context** — unselectable anatomy that orients the reader (for example the
  ascending colon or the liver); drawn fainter, named only where it helps.
- **Omitted** — anything that adds clutter without improving operative
  understanding, or whose relationship is not sourced.

## Context anatomy must be sourced too

**Context anatomy must also be source-supported when it conveys an anatomical
relationship, even if it is not interactive.** Interactive structures are
governed by the structured content model; context anatomy is governed by
artwork review and the documented support below. Unsupported morphology (for
example haustra) is left out rather than drawn as decoration.

| Artwork          | Context element                                             | Supporting block (source)                                                                                                                  | Meaning and limits                                                                                                                                                         |
| ---------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Appendicectomy   | Ascending colon, continuing up from the caecum             | `appendix-origin` ("The caecum is the beginning of the large bowel"; StatPearls appendix) and `difficult-position` ("the caecum and ascending colon"; StatPearls appendectomy) | Orientation only; a plain tube, no haustra. Its superior position is the conventional anatomical layout, not a sourced statement.                                        |
| Appendicectomy   | Superior mesenteric artery, with the ileocolic artery as a branch | `appendicular-artery` ("The ileocolic artery is the most inferior branch of the superior mesenteric artery"; StatPearls ileocolic artery) | Orientation only; minimal, running out of frame with no other branches. Its superomedial placement is schematic, not a sourced position.                                   |
| Cholecystectomy  | Liver and its inferior edge                                 | `gallbladder-structure` ("The gallbladder lies on the underside of the liver"; StatPearls lap chole) and `hepatocystic-triangle` ("the edge of the liver"; StatPearls lap chole and gallbladder anatomy) | The triangle's superior boundary and the gallbladder's attachment. Drawn as if its edge were lifted, a stated schematic convention, not anatomical depth. |

## What validation can and cannot prove

**Content validation (automated)** enforces sourced, verbatim wording; role
semantics (`controlled` never with `at-risk`; `bleeding-risk` only on a
controlled structure; a risk role only with a quoted risk); step links backed
by what each walkthrough step quotes; unique view IDs, roles and steps; and
that every view has an artwork with exactly matching structures and markers.
Tests also pin basic laterality for the declared orientation using the marker
positions.

**Artwork review (human)** must still verify, for every drawing:

- laterality and the declared viewpoint;
- superior/inferior and medial/lateral relationships;
- anterior/posterior relationships where drawn (and their legend);
- connections and continuity between structures;
- that every drawn relationship matches the sourced text, and nothing
  unsourced is implied (for example a vessel's origin or course).

Automated tests cannot prove anatomical correctness.
