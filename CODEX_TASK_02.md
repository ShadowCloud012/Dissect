# Codex Task 02 — Build the structured content engine

Read `AGENTS.md`, `README.md`, `DEVELOPMENT.md`, and this task fully before making changes.

## Goal
Build the reusable content architecture that will power Dissect topics before any real clinical content is introduced.

This task should prove that:
- structured topic content can be validated at build/development time;
- training level can control content depth;
- references can be attached to claims and rendered consistently;
- a topic can be navigated through real routes and reusable layout components;
- the system is reusable and does not hard-code appendicitis.

Do not add real appendicitis clinical content yet.

## Scope

### 1. Shared training-level model
Create a single shared training-level source of truth used by:
- schemas;
- UI selector;
- filtering logic;
- demo fixture.

Training levels:
- medical-student
- foundation
- cst
- registrar

Include:
- stable ID;
- display label;
- numeric rank/order.

Refactor the existing training-level selector to consume this shared model rather than duplicate option values.

### 2. Persistence
Persist the selected training level locally in the browser.

Requirements:
- localStorage is acceptable;
- default remains Medical Student;
- selection survives reload;
- no account/database;
- avoid hydration mismatch;
- persistence logic should be isolated and testable.

### 3. Zod schemas
Create validated schemas for at least:

#### Reference
Fields should support:
- id
- organisation optional
- authors optional
- title
- publication optional
- year
- url optional
- accessedAt optional
- evidenceType
- notes optional

Evidence types:
- guideline
- systematic-review
- primary-study
- expert-consensus
- textbook
- local-policy

#### ClinicalClaim
- id
- text
- minimumLevel
- referenceIds
- localPolicyMayVary optional

#### Topic metadata
At minimum:
- id
- slug
- title
- specialty
- category
- summary
- lastClinicallyReviewed
- keywords
- aliases optional

#### Content blocks
Implement a discriminated union for a small, useful initial set:
- prose
- keyPoints
- definition
- warning
- clinicalPearl
- checklist
- table
- claimGroup
- sourceNote

Each block must support a `minimumLevel`.

Do not over-engineer every future content type yet.

### 4. Runtime/build validation
Create a clean mechanism for validating topic content with Zod.

Requirements:
- invalid fixtures should fail clearly during development/tests;
- validation errors should include useful path/context;
- avoid silently accepting malformed content;
- validation should not require a database or network.

### 5. Topic registry
Create a small content registry abstraction that can:
- list available topics;
- retrieve a topic by slug;
- expose metadata;
- provide topic sections;
- expose references.

No CMS.
No filesystem magic unless clearly justified.
Prefer explicit imports/registration for now.

### 6. Reusable topic model
Create a reusable topic shape with:
- metadata;
- ordered sections;
- references.

Each section should have:
- stable id;
- title;
- optional summary;
- blocks.

Do not use appendicitis-specific field names.

### 7. Demo fixture
Create one clearly labelled NON-CLINICAL demo topic only to prove the engine.

Use a harmless fictional or meta educational topic such as:
"How Dissect content works"

It should demonstrate:
- multiple sections;
- different training-level minimums;
- at least two references;
- a referenced claim;
- a key-points block;
- a warning or source note;
- filtering between levels.

Do not use real clinical guidance, risk percentages or treatment recommendations.

### 8. Topic routes
Add a generic dynamic topic route under:

`/learn/[specialty]/[topic]`

Use the demo fixture at a real path, for example:

`/learn/demo/how-dissect-content-works`

Requirements:
- direct URL load works;
- refresh works;
- unknown topic returns a proper not-found state;
- metadata/title derives from topic data where practical.

### 9. Topic layout
Build a reusable desktop/mobile topic layout inspired by the old Dissect3 three-column case view.

Desktop:
- left section navigation;
- central content;
- right contextual rail.

Right rail should include:
- training level;
- last reviewed date;
- references/source access;
- contextual source list when appropriate.

Mobile:
- do not simply hide both rails;
- section navigation must remain usable;
- reference access must remain available;
- training-level control remains accessible.

Use semantic HTML and accessible navigation.

### 10. Section navigation
Implement reusable section navigation.

Requirements:
- links/controls correspond to section IDs;
- keyboard usable;
- active section should be understandable;
- support deep-linking to section anchors if practical;
- avoid client-side complexity unless needed.

### 11. Training-level filtering
Implement reusable logic so that:
- a block appears when selected level rank >= block minimum level;
- changing level updates visible content;
- higher-level content is not deleted from the underlying topic;
- users can intentionally reveal advanced content even if their selected level is lower.

A simple "Show advanced content" control is acceptable.

Important:
Training level changes depth, not factual truth.

### 12. Reference rendering
Create reusable components:
- SourceBadge
- ReferenceList
- ReferenceItem or equivalent

Requirements:
- claims with references visibly indicate source availability;
- references render title, organisation/authors, year, evidence type, and link when present;
- external links use safe attributes;
- unsupported/broken reference IDs should fail validation or tests.

### 13. Generic content renderer
Create a renderer for the implemented block types.

Requirements:
- component mapping is explicit;
- no `dangerouslySetInnerHTML`;
- semantic markup;
- generic renderer contains no topic-specific copy.

### 14. Testing
Add unit/component tests for:
- training-level rank/filtering;
- local persistence;
- schema validation success;
- schema validation failure;
- broken reference ID detection;
- demo fixture rendering at two different levels.

Expand Playwright to cover:
- direct loading the demo topic route;
- changing training level;
- persistence after reload;
- advanced content visibility;
- mobile topic navigation/reference access;
- no horizontal overflow;
- no browser console errors.

## Design requirements
Preserve Task 01 visual language.

The topic layout should feel like a refined descendant of Dissect3:
- calm;
- information-dense;
- thin borders;
- off-white background;
- restrained green;
- clear hierarchy;
- minimal animation.

Do not redesign the brand.

## Do not do yet
- real appendicitis content;
- operative rehearsal engine;
- simulation engine;
- real search index;
- authentication;
- database;
- CMS;
- saved topics;
- case log;
- AI features;
- anatomy/imaging visualisation.

## Acceptance criteria
- shared training-level model has no duplicated option definitions;
- selector persists locally across reloads;
- topic schemas validate successfully;
- malformed topics fail with useful errors;
- broken reference IDs are detected;
- demo topic is rendered entirely from structured content;
- reusable dynamic topic route works directly and on refresh;
- unknown topic shows a proper 404/not-found state;
- desktop topic layout includes section nav, main content and contextual source rail;
- mobile retains section/source access;
- content changes appropriately by training level;
- advanced content can still be intentionally revealed;
- references are accessible from relevant claims/sections;
- no clinical content has been invented;
- lint, typecheck, tests, build and Playwright all pass;
- no browser console errors.

## Completion report
At completion provide:
1. architecture summary;
2. schema/model summary;
3. files changed;
4. test/validation commands and final results;
5. screenshots inspected;
6. any deviations and why;
7. anything that should be decided before Task 03.
