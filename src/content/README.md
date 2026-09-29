# Content boundary

`registry.ts` explicitly imports and validates the non-clinical demo under `demo/`
and the draft acute appendicitis topic under `topics/acute-appendicitis/`. Invalid
content fails at import time, including during production builds. Registry
construction remains in `src/lib/topic-registry.ts`.

The clinical topic composes presentation, management, operative/recovery care,
questions/evidence and references. Stable block/reference IDs connect citations
without embedding topic copy in generic components. Only editorial `sourceNote`
blocks may omit citations in clinical topics; they must not be used to bypass
clinical sourcing. Structural validation does not validate medical truth.

The topic is awaiting clinical review: reviewer and clinical review date are null.
See `TASK_03_REPORT.md` for source verification limitations and review priorities.

## Shared content (one explicit layer)

`shared/references.ts` holds sources genuinely cited by more than one topic
(RCS, NICE perioperative/VTE/sepsis, laparoscopic access). Topic-specific
sources stay in each topic's `references.ts`. Cite either kind by ID; a topic's
Evidence page lists its local sources followed by only the shared sources it
cites. A local source may not reuse a shared ID.

`shared/blocks.ts` holds blocks whose meaning, wording and sources are the same
in every procedure. A section includes one explicitly with
`{ include: '<id>' }`; `composeTopic` (in each topic's `index.ts`) copies it
unchanged and marks it `shared`. Each shared block lists the walkthrough field
kinds it was reviewed for (for example abdominal-wall access: `danger` only);
mapping it to any other field fails validation. Shared blocks cite shared
sources only, cannot be shadowed by a local block ID, and the registry rejects
any altered copy. If a block needs procedure-specific nuance, keep it local.

## Conditions and procedures

A procedure record in its condition's `metadata.procedures` is the single
source of truth for the procedure's names, its canonical page, its anatomy,
complications and aftercare pages, and any further conditions it is relevant
to (`linkedConditionIds`). The registry derives condition ↔ procedure links,
related-page links and search documents from it; procedure pages do not repeat
the procedure's aliases.
