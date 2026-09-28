# Schema boundary

Zod strict objects validate references, claims, metadata, ordered sections and
ten block types. `validateTopic` adds file context to errors; `topicSchema` checks
duplicate IDs and source linkage. Types are inferred from schemas. Training levels
come from `src/lib/training-level.ts`. These checks establish structural validity,
not clinical correctness or evidence quality.

Clinical metadata requires explicit status (`draft`, `awaiting-review` or
`clinically-reviewed`). Only the last status permits and requires a named reviewer
and a clinical review date. Demo metadata uses `demoReviewedAt` instead.

Clinical topics require references, and factual blocks require reference IDs.
`sourceNote` is the editorial exception; claims retain their own required IDs.
Questions have a question, model answer, minimum level and required source IDs.
Blocks can mark local-policy variation. One optional `showReferences` section
places the full bibliography in the reading column. Reference records support a
compact source title and a patient-information evidence type.
