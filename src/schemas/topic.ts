import { z } from 'zod';
import { contentBlockSchema } from './content-block';
import { referenceSchema } from './reference';
import { dateSchema, stableIdSchema, textSchema } from './shared';
import { trainingLevelRank } from '@/lib/training-level';
import {
  anatomyRiskRoles,
  isExtractSelection,
  theatrePrepSectionIds,
  topicExperienceSchema,
  type TopicLink,
} from './topic-experience';

// All authored wording in a block, for verbatim-extract checks.
const structuralKeys = new Set([
  'id',
  'type',
  'minimumLevel',
  'referenceIds',
  'shared',
]);
function strings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === 'object')
    return Object.entries(value)
      .filter(([key]) => !structuralKeys.has(key))
      .flatMap(([, entry]) => strings(entry));
  return [];
}
export function blockText(block: unknown) {
  return strings(block).join('\n');
}
const normalise = (text: string) => text.toLowerCase().replace(/\s+/g, ' ');

const metadataFields = {
  id: stableIdSchema,
  slug: stableIdSchema,
  title: textSchema,
  specialty: stableIdSchema,
  categories: z
    .array(stableIdSchema)
    .min(1)
    .refine((ids) => new Set(ids).size === ids.length, 'Duplicate category ID'),
  summary: textSchema,
  keywords: z.array(textSchema).min(1),
  aliases: z.array(textSchema).optional(),
};
// A clinical topic is a Condition. A Procedure is a first-class record owned
// by the condition that most often leads to it: it has its own title,
// aliases and keywords, and its canonical page is a subpage of that topic,
// so there is one URL and no duplicated content. The record is the single
// source of truth for its relationships: further conditions it is relevant
// to, and the owning topic's pages for its anatomy, complications and
// aftercare (Condition → Procedure → Anatomy → Step → Danger → Complication
// → Aftercare).
export const procedureSchema = z.strictObject({
  id: stableIdSchema,
  title: textSchema,
  page: stableIdSchema,
  summary: textSchema,
  aliases: z.array(textSchema).min(1),
  keywords: z.array(textSchema).min(1),
  // Conditions besides the owner; resolved and checked by the registry.
  linkedConditionIds: z.array(stableIdSchema).default([]),
  anatomyPage: stableIdSchema.optional(),
  complicationsPage: stableIdSchema.optional(),
  aftercarePage: stableIdSchema.optional(),
  consentPage: stableIdSchema.optional(),
});
export type Procedure = z.infer<typeof procedureSchema>;
export const topicMetadataSchema = z.discriminatedUnion('contentKind', [
  z.strictObject({
    ...metadataFields,
    contentKind: z.literal('non-clinical-demo'),
    demoReviewedAt: dateSchema,
  }),
  z
    .strictObject({
      ...metadataFields,
      contentKind: z.literal('clinical'),
      procedures: z.array(procedureSchema).default([]),
      status: z.enum(['draft', 'awaiting-review', 'clinically-reviewed']),
      clinicalReviewer: textSchema.nullable(),
      lastClinicallyReviewed: dateSchema.nullable(),
    })
    .superRefine((metadata, context) => {
      if (metadata.status === 'clinically-reviewed') {
        if (!metadata.clinicalReviewer)
          context.addIssue({
            code: 'custom',
            path: ['clinicalReviewer'],
            message: 'Clinically reviewed content requires a named reviewer',
          });
        if (!metadata.lastClinicallyReviewed)
          context.addIssue({
            code: 'custom',
            path: ['lastClinicallyReviewed'],
            message: 'Clinically reviewed content requires a review date',
          });
      } else if (
        metadata.clinicalReviewer !== null ||
        metadata.lastClinicallyReviewed !== null
      ) {
        context.addIssue({
          code: 'custom',
          path: ['status'],
          message: 'Unreviewed content must not imply clinical sign-off',
        });
      }
    }),
]);
export const topicSectionSchema = z.strictObject({
  id: stableIdSchema,
  title: textSchema,
  summary: textSchema.optional(),
  showReferences: z.boolean().optional(),
  blocks: z.array(contentBlockSchema).min(1),
});
export const topicSchema = z
  .strictObject({
    metadata: topicMetadataSchema,
    sections: z.array(topicSectionSchema).min(1),
    references: z.array(referenceSchema),
    experience: topicExperienceSchema.optional(),
  })
  .superRefine((topic, context) => {
    if (topic.experience) {
      const experience = topic.experience;
      const pageIds = new Set(experience.pages.map((page) => page.slug));
      const blocks = topic.sections.flatMap((section) => section.blocks);
      const fail = (message: string) =>
        context.addIssue({ code: 'custom', path: ['experience'], message });
      if (pageIds.size !== experience.pages.length) fail('Duplicate page slug');
      if (!pageIds.has('evidence'))
        fail('Topic experience requires an evidence page');
      if (!topic.sections.some((section) => section.id === 'overview'))
        fail('Topic experience requires an overview section');
      const assigned = experience.pages.flatMap((page) => page.sectionIds);
      if (new Set(assigned).size !== assigned.length)
        fail('Sections must have one subpage owner');
      for (const id of assigned)
        if (!topic.sections.some((section) => section.id === id))
          fail(`Unknown section: ${id}`);
      for (const section of topic.sections)
        if (section.id !== 'overview' && !assigned.includes(section.id))
          fail(`Unassigned section: ${section.id}`);
      // Each procedure's canonical page is a real subpage of this condition.
      if (topic.metadata.contentKind === 'clinical') {
        const procedurePages = topic.metadata.procedures.map((p) => p.page);
        if (new Set(procedurePages).size !== procedurePages.length)
          fail('A page can represent only one procedure');
        for (const procedure of topic.metadata.procedures) {
          for (const page of [
            procedure.page,
            procedure.anatomyPage,
            procedure.complicationsPage,
            procedure.aftercarePage,
            procedure.consentPage,
          ])
            if (page && !pageIds.has(page))
              fail(`Unknown procedure page: ${page}`);
          // The procedure record owns its names; its page does not repeat them.
          if (
            experience.pages.find((page) => page.slug === procedure.page)
              ?.aliases.length
          )
            fail(
              `Procedure page aliases belong on the procedure: ${procedure.id}`,
            );
          if (procedure.linkedConditionIds.includes(topic.metadata.id))
            fail(
              `A procedure already belongs to its own condition: ${procedure.id}`,
            );
        }
      }
      const pageOwns = (pageSlug: string, blockId: string) => {
        const page = experience.pages.find((entry) => entry.slug === pageSlug);
        return topic.sections.some(
          (section) =>
            page?.sectionIds.includes(section.id) &&
            section.blocks.some((block) => block.id === blockId),
        );
      };
      // Extracts must be verbatim; Hot Seat answers are sourced content and
      // may explain an operative step, but not the hub overview.
      function checkExtract(
        extract: { text: string; blockId: string },
        allowQuestions: boolean,
      ) {
        const source = blocks.find((block) => block.id === extract.blockId);
        if (!source || (!allowQuestions && source.type === 'question'))
          fail(`Unknown extract block: ${extract.blockId}`);
        else if (
          !normalise(blockText(source)).includes(normalise(extract.text))
        )
          fail(
            `Extract is not verbatim in ${extract.blockId}: "${extract.text}"`,
          );
      }
      function checkLink(link: TopicLink) {
        if (!pageIds.has(link.page))
          return fail(`Unknown link page: ${link.page}`);
        if (link.blockId && !pageOwns(link.page, link.blockId))
          fail(`Link block not on its page: ${link.blockId}`);
        if (
          link.step &&
          !experience.walkthroughs.some(
            (walkthrough) =>
              walkthrough.page === link.page &&
              link.step! <= walkthrough.steps.length,
          )
        )
          fail(`Unknown walkthrough step: ${link.page} ${link.step}`);
      }
      for (const walkthrough of experience.walkthroughs) {
        const block = blocks.find((entry) => entry.id === walkthrough.blockId);
        if (block?.type !== 'checklist')
          fail(`Walkthrough needs a checklist block: ${walkthrough.blockId}`);
        else if (!pageOwns(walkthrough.page, walkthrough.blockId))
          fail(`Walkthrough block not on its page: ${walkthrough.blockId}`);
        else if (
          walkthrough.steps.map((step) => step.itemIndex).join() !==
          block.items.map((_, index) => index).join()
        )
          fail('Walkthrough steps must cover each authored step in order');
        const quoted = new Set(
          walkthrough.steps.flatMap((step) =>
            step.fields.flatMap((field) =>
              field.extracts.map((extract) => extract.blockId),
            ),
          ),
        );
        for (const id of walkthrough.absorbsBlockIds)
          if (!pageOwns(walkthrough.page, id) || !quoted.has(id))
            fail(`Walkthrough must quote the block it represents: ${id}`);
        for (const step of walkthrough.steps) {
          for (const field of step.fields)
            for (const extract of field.extracts) {
              checkExtract(extract, true);
              // A shared block may fill only the field kinds it was reviewed
              // for; being valid in one role does not carry over to another.
              const source = blocks.find(
                (block) => block.id === extract.blockId,
              );
              if (
                source?.shared &&
                !source.shared.walkthroughFields.includes(field.kind)
              )
                fail(
                  `Shared block ${source.id} is not approved for ${field.kind} fields`,
                );
            }
          for (const gap of step.gaps)
            if (step.fields.some((field) => field.kind === gap))
              fail(`Walkthrough gap is also populated: ${gap}`);
          for (const link of step.links) checkLink(link);
        }
      }
      for (const briefing of experience.briefings) {
        if (!pageIds.has(briefing.page))
          fail(`Unknown briefing page: ${briefing.page}`);
        const represented = [
          ...(briefing.replacesBlockId ? [briefing.replacesBlockId] : []),
          ...briefing.absorbsBlockIds,
        ];
        const extracted = new Set(
          briefing.rows.flatMap((row) =>
            row.extracts.map((extract) => extract.blockId),
          ),
        );
        // A block may only be replaced by a panel that quotes it, so its
        // wording and sources remain visible.
        for (const id of represented)
          if (!pageOwns(briefing.page, id) || !extracted.has(id))
            fail(`Briefing must quote the block it represents: ${id}`);
        for (const row of briefing.rows) {
          for (const extract of row.extracts) checkExtract(extract, false);
          if (row.link) checkLink(row.link);
        }
      }
      const viewIds = experience.anatomyViews.map((view) => view.id);
      if (new Set(viewIds).size !== viewIds.length)
        fail('Duplicate anatomy view ID');
      for (const view of experience.anatomyViews) {
        if (!pageIds.has(view.page))
          fail(`Unknown anatomy view page: ${view.page}`);
        const walkthrough = experience.walkthroughs.find(
          (entry) => entry.id === view.walkthroughId,
        );
        if (!walkthrough) {
          fail(`Unknown anatomy walkthrough: ${view.walkthroughId}`);
          continue;
        }
        const sequence = blocks.find(
          (block) => block.id === walkthrough.blockId,
        );
        const ids = view.structures.map((structure) => structure.id);
        if (new Set(ids).size !== ids.length)
          fail(`Duplicate anatomy structure in ${view.id}`);
        for (const extract of view.notes) checkExtract(extract, false);
        for (const link of view.links) checkLink(link);
        for (const structure of view.structures) {
          const extracts = structure.fields.flatMap((field) => field.extracts);
          for (const link of structure.links) checkLink(link);
          for (const extract of extracts) checkExtract(extract, false);
          // A risk role must be explained by a quoted risk, and vice versa.
          if (
            structure.roles.some((role) =>
              (anatomyRiskRoles as readonly string[]).includes(role),
            ) !== structure.fields.some((field) => field.kind === 'risk')
          )
            fail(`Risk role and risk field must agree: ${structure.id}`);
          // Roles keep one meaning: a structure intentionally divided is not
          // one the operator is trying not to injure, and a bleeding risk is
          // the risk of controlling a structure.
          const roles = structure.roles;
          if (new Set(roles).size !== roles.length)
            fail(`Duplicate anatomy role: ${structure.id}`);
          if (roles.includes('controlled') && roles.includes('at-risk'))
            fail(`A controlled structure cannot be at risk: ${structure.id}`);
          if (roles.includes('bleeding-risk') && !roles.includes('controlled'))
            fail(
              `Bleeding risk requires a controlled structure: ${structure.id}`,
            );
          if (new Set(structure.steps).size !== structure.steps.length)
            fail(`Duplicate anatomy step: ${structure.id}`);
          const sources = new Set(extracts.map((extract) => extract.blockId));
          for (const number of structure.steps) {
            const step = walkthrough.steps[number - 1];
            if (!step) {
              fail(`Unknown anatomy step: ${structure.id} ${number}`);
              continue;
            }
            // The step must itself quote one of the structure's sources, or
            // the structure must quote the step's own authored text.
            const quotesSource = step.fields.some((field) =>
              field.extracts.some((extract) => sources.has(extract.blockId)),
            );
            const item =
              sequence?.type === 'checklist'
                ? normalise(sequence.items[step.itemIndex] ?? '')
                : '';
            const quotesStep = extracts.some((extract) =>
              item.includes(normalise(extract.text)),
            );
            if (!quotesSource && !quotesStep)
              fail(
                `Anatomy step not supported by the walkthrough: ${structure.id} ${number}`,
              );
          }
        }
      }
      const prepProcedures = experience.theatrePreps.map(
        (prep) => prep.procedureId,
      );
      if (new Set(prepProcedures).size !== prepProcedures.length)
        fail('One Theatre Prep per procedure');
      for (const prep of experience.theatrePreps) {
        const procedure =
          topic.metadata.contentKind === 'clinical'
            ? topic.metadata.procedures.find(
                (entry) => entry.id === prep.procedureId,
              )
            : undefined;
        if (!procedure) {
          fail(`Theatre Prep for an unknown procedure: ${prep.procedureId}`);
          continue;
        }
        const walkthrough = experience.walkthroughs.find(
          (entry) => entry.id === prep.walkthroughId,
        );
        if (walkthrough?.page !== procedure.page)
          fail(
            `Theatre Prep walkthrough is not the procedure's: ${prep.walkthroughId}`,
          );
        const view = experience.anatomyViews.find(
          (entry) => entry.id === prep.anatomyViewId,
        );
        if (view?.walkthroughId !== prep.walkthroughId)
          fail(
            `Theatre Prep anatomy view does not match its walkthrough: ${prep.anatomyViewId}`,
          );
        const plan = experience.briefings.find(
          (entry) => entry.id === prep.planBriefingId,
        );
        if (plan?.variant !== 'plan' || plan.page !== procedure.page)
          fail(
            `Theatre Prep needs the procedure's plan panel: ${prep.planBriefingId}`,
          );
        for (const gap of prep.gaps)
          if (
            blocks.find((block) => block.id === gap.blockId)?.type !==
            'sourceNote'
          )
            fail(`Theatre Prep gap must be an editorial note: ${gap.blockId}`);
        for (const section of theatrePrepSectionIds) {
          const labels = prep[section].map((row) => row.label);
          if (new Set(labels).size !== labels.length)
            fail(`Duplicate Theatre Prep row in ${section}`);
          for (const row of prep[section]) {
            for (const extract of row.extracts) checkExtract(extract, false);
            if (row.link) checkLink(row.link);
            // A row is never shown at a shallower depth than its sources.
            const deepest = Math.max(
              ...row.extracts.map((extract) =>
                trainingLevelRank(
                  blocks.find((block) => block.id === extract.blockId)
                    ?.minimumLevel ?? 'medical-student',
                ),
              ),
            );
            if (
              trainingLevelRank(row.minimumLevel ?? 'medical-student') < deepest
            )
              fail(
                `Theatre Prep row is shallower than its source: ${row.label}`,
              );
          }
        }
      }
      for (const entry of experience.blockLinks) {
        if (!blocks.some((block) => block.id === entry.blockId))
          fail(`Unknown linked block: ${entry.blockId}`);
        for (const link of entry.links) checkLink(link);
      }
      for (const selection of experience.quickReference) {
        if (
          !experience.quickReferenceGroups.some(
            (group) => group.id === selection.group,
          )
        )
          fail(`Unknown quick-reference group: ${selection.group}`);
        if (!pageIds.has(selection.page))
          fail(`Unknown quick-reference page: ${selection.page}`);
        if (isExtractSelection(selection)) {
          for (const row of selection.rows) {
            for (const extract of row.extracts) checkExtract(extract, false);
            if (row.link) checkLink(row.link);
          }
          continue;
        }
        const block = blocks.find((block) => block.id === selection.blockId);
        const page = experience.pages.find(
          (page) => page.slug === selection.page,
        );
        if (!block || !page) {
          fail('Unknown quick-reference block/page');
          continue;
        }
        if (block.type === 'question' || block.type === 'claimGroup')
          fail('Quick reference requires a concise factual block');
        // Overview blocks belong to the hub itself; anything else must link
        // to the subpage that owns it.
        if (
          !topic.sections.some(
            (section) =>
              (section.id === 'overview' ||
                page.sectionIds.includes(section.id)) &&
              section.blocks.includes(block),
          )
        )
          fail('Quick reference must link to its owning page');
        const itemCount =
          'items' in block
            ? block.items.length
            : block.type === 'table'
              ? block.rows.length
              : 0;
        if (
          selection.itemIndex !== undefined &&
          selection.itemIndex >= itemCount
        )
          fail('Invalid quick-reference item index');
      }
      for (const step of experience.journey) {
        if (!step.page === !step.group)
          fail(`Journey step needs a page or a group: ${step.label}`);
        if (step.page && !pageIds.has(step.page))
          fail(`Unknown journey page: ${step.page}`);
        if (
          step.group &&
          !experience.quickReferenceGroups.some(
            (group) => group.id === step.group,
          )
        )
          fail(`Unknown journey group: ${step.group}`);
      }
      for (const group of experience.quickReferenceGroups) {
        if (
          !experience.quickReference.some(
            (selection) => selection.group === group.id,
          )
        )
          fail(`Empty quick-reference group: ${group.id}`);
        if (
          group.contextId &&
          !experience.contexts.some((context) => context.id === group.contextId)
        )
          fail(`Unknown quick-reference context: ${group.contextId}`);
      }
      for (const contextPanel of experience.contexts)
        for (const link of contextPanel.links)
          if (!pageIds.has(link.page))
            fail(`Unknown related page: ${link.page}`);
      const styled = experience.presentation.map((item) => item.blockId);
      if (new Set(styled).size !== styled.length)
        fail('Duplicate presentation block');
      for (const item of experience.presentation) {
        const block = blocks.find((block) => block.id === item.blockId);
        if (!block) fail(`Unknown presentation block: ${item.blockId}`);
        if (
          item.itemLabels &&
          (!block ||
            !('items' in block) ||
            item.itemLabels.length !== block.items.length)
        )
          fail('Item labels must match authored items');
        if (
          (item.variant === 'steps' || item.variant === 'consent') &&
          block?.type !== 'checklist'
        )
          fail('Steps/consent require a checklist');
        if (item.variant === 'complications' && block?.type !== 'table')
          fail('Complications require a table');
        if (
          item.variant === 'cards' &&
          (!block || !('items' in block) || !item.itemLabels)
        )
          fail('Cards require a list block with item labels');
      }
      const pageOwnsBlock = (pageSlug: string, blockId: string) => {
        const page = experience.pages.find((entry) => entry.slug === pageSlug);
        return topic.sections.some(
          (section) =>
            page?.sectionIds.includes(section.id) &&
            section.blocks.some((block) => block.id === blockId),
        );
      };
      for (const pathway of experience.pathways) {
        if (!pageIds.has(pathway.page))
          fail(`Unknown pathway page: ${pathway.page}`);
        for (const node of [...pathway.steps, ...pathway.branches])
          if (!pageOwnsBlock(pathway.page, node.blockId))
            fail(`Pathway block must belong to its page: ${node.blockId}`);
      }
    }
    if (
      topic.metadata.contentKind === 'clinical' &&
      topic.references.length === 0
    )
      context.addIssue({
        code: 'custom',
        path: ['references'],
        message: 'Clinical topics require references',
      });
    if (topic.sections.filter((section) => section.showReferences).length > 1)
      context.addIssue({
        code: 'custom',
        path: ['sections'],
        message: 'Only one section may display the reference list',
      });
    const references = new Set(
      topic.references.map((reference) => reference.id),
    );
    const seen = new Set<string>();
    function unique(kind: string, id: string, path: (string | number)[]) {
      const key = `${kind}:${id}`;
      if (seen.has(key))
        context.addIssue({
          code: 'custom',
          path,
          message: `Duplicate ${kind} ID: ${id}`,
        });
      seen.add(key);
    }
    function checkReferences(ids: string[], path: (string | number)[]) {
      ids.forEach((id, index) => {
        if (!references.has(id))
          context.addIssue({
            code: 'custom',
            path: [...path, index],
            message: `Unknown reference ID: ${id}`,
          });
      });
    }
    topic.references.forEach((reference, index) =>
      unique('reference', reference.id, ['references', index, 'id']),
    );
    topic.sections.forEach((section, sectionIndex) => {
      const sectionPath = ['sections', sectionIndex];
      unique('section', section.id, [...sectionPath, 'id']);
      section.blocks.forEach((block, blockIndex) => {
        const path = [...sectionPath, 'blocks', blockIndex];
        unique('block', block.id, [...path, 'id']);
        checkReferences(block.referenceIds, [...path, 'referenceIds']);
        if (
          topic.metadata.contentKind === 'clinical' &&
          block.type !== 'sourceNote' &&
          block.type !== 'claimGroup' &&
          block.referenceIds.length === 0
        )
          context.addIssue({
            code: 'custom',
            path: [...path, 'referenceIds'],
            message:
              'Clinical content requires a reference; use sourceNote only for editorial notes',
          });
        if (block.type === 'claimGroup')
          block.claims.forEach((claim, claimIndex) => {
            unique('claim', claim.id, [...path, 'claims', claimIndex, 'id']);
            checkReferences(claim.referenceIds, [
              ...path,
              'claims',
              claimIndex,
              'referenceIds',
            ]);
          });
      });
    });
  });
export type Topic = z.infer<typeof topicSchema>;
// Authored content files satisfy the input shape; defaults apply on parse.
export type TopicInput = z.input<typeof topicSchema>;
export type TopicMetadata = z.infer<typeof topicMetadataSchema>;
type ClinicalMetadata = Extract<TopicMetadata, { contentKind: 'clinical' }>;
type DemoMetadata = Extract<
  TopicMetadata,
  { contentKind: 'non-clinical-demo' }
>;
// What an editorial-status label needs; a procedure shows its owning topic's.
export type ReviewState =
  | Pick<
      ClinicalMetadata,
      'contentKind' | 'status' | 'clinicalReviewer' | 'lastClinicallyReviewed'
    >
  | Pick<DemoMetadata, 'contentKind' | 'demoReviewedAt'>;
export type TopicSection = z.infer<typeof topicSectionSchema>;
export type TopicSectionInput = z.input<typeof topicSectionSchema>;

export function validateTopic(input: unknown, context = 'topic'): Topic {
  const result = topicSchema.safeParse(input);
  if (!result.success) {
    throw new Error(
      `Invalid content in ${context}:\n${result.error.issues.map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`).join('\n')}`,
    );
  }
  return result.data;
}
