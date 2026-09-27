# Schema boundary

Zod strict objects validate references, claims, metadata, ordered sections and
nine block types. `validateTopic` adds file context to errors; `topicSchema` checks
duplicate IDs and source linkage. Types are inferred from schemas. Training levels
come from `src/lib/training-level.ts`. These checks establish structural validity,
not clinical correctness or evidence quality.
