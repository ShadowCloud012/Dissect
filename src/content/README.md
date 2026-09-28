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
