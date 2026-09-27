# Shared logic boundary

Shared training IDs, labels and ranks live in `training-level.ts`. The storage
adapter reads and writes only the training preference. `topic-registry.ts`
validates explicit registrations and exposes metadata and complete topics by
specialty/slug. It returns copies to preserve validated content. No search index,
database or saved-topic state is included.
