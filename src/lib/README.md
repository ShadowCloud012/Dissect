# Shared logic boundary

Shared training IDs, labels and ranks live in `training-level.ts`. The storage
adapter reads and writes only the training preference. `topic-registry.ts`
validates explicit registrations and exposes metadata and complete topics by
specialty/slug. It returns copies to preserve validated content. No search UI,
database or saved-topic state is included.

`shared-content.ts` composes explicit shared includes and shared sources into a
topic and checks their integrity. The registry also builds the condition ↔
procedure graph (`discoveryEntries`, `relationsFor`), exact normalised
title/alias resolution (`resolveTerm`) and deterministic search documents
(`search-documents.ts`: one per canonical URL, curated metadata and headings
only). There is still no search UI or fuzzy matching.
