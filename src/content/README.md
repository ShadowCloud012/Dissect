# Content boundary

`registry.ts` explicitly imports and validates the sole non-clinical demo under
`demo/`. Invalid content fails at import time, including during production builds.
Registry construction is in `src/lib/topic-registry.ts`. No clinical modules have
been added. Future approved content belongs here, separate from presentation.
