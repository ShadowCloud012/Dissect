import type { Topic, TopicMetadata } from '@/schemas/topic';
import type { ContentBlock } from '@/schemas/content-block';
import { isExtractSelection, type TopicLink } from '@/schemas/topic-experience';
import {
  trainingLevelRank,
  trainingLevels,
  type TrainingLevel,
} from '@/lib/training-level';

export function topicHref(metadata: Pick<TopicMetadata, 'specialty' | 'slug'>) {
  return `/learn/${metadata.specialty}/${metadata.slug}`;
}
export function resolveTopicPage(topic: Topic, slug: string) {
  const page = topic.experience?.pages.find((page) => page.slug === slug);
  return page
    ? {
        page,
        sections: page.sectionIds.map((id) =>
          topic.sections.find((section) => section.id === id)!,
        ),
      }
    : undefined;
}
function findBlock(topic: Topic, id: string) {
  return topic.sections
    .flatMap((section) => section.blocks)
    .find((block) => block.id === id)!;
}
export const stepAnchor = (walkthroughId: string, step: number) =>
  `step-${walkthroughId}-${step}`;
// Real routes/anchors only; links are validated against the topic schema.
export function linkHref(topic: Topic, link: TopicLink) {
  const walkthrough = link.step
    ? topic.experience?.walkthroughs.find((entry) => entry.page === link.page)
    : undefined;
  const anchor = link.blockId
    ? `#block-${link.blockId}`
    : walkthrough
      ? `#${stepAnchor(walkthrough.id, link.step!)}`
      : '';
  return `${topicHref(topic.metadata)}/${link.page}${anchor}`;
}
function resolveLinks(topic: Topic, links: TopicLink[]) {
  return links.map((link) => ({
    label: link.label,
    href: linkHref(topic, link),
  }));
}
type ExtractRow = {
  label: string;
  minimumLevel?: TrainingLevel;
  extracts: { text: string; blockId: string }[];
  link?: TopicLink;
};
export function resolveRows(topic: Topic, rows: ExtractRow[]) {
  return rows.map((row) => ({
    label: row.label,
    minimumLevel: row.minimumLevel,
    href: row.link ? linkHref(topic, row.link) : undefined,
    linkLabel: row.link?.label,
    extracts: row.extracts.map((extract) => ({
      ...extract,
      block: findBlock(topic, extract.blockId),
    })),
  }));
}
export type ResolvedRow = ReturnType<typeof resolveRows>[number];
const uniqueReferences = (blocks: ContentBlock[]) => [
  ...new Set(blocks.flatMap((block) => block.referenceIds)),
];
// Resolves every quick-reference entry to the authored blocks it draws on.
export function selectQuickReference(topic: Topic) {
  return (topic.experience?.quickReference ?? []).map((selection) =>
    isExtractSelection(selection)
      ? {
          ...selection,
          kind: 'extracts' as const,
          rows: resolveRows(topic, selection.rows),
        }
      : {
          ...selection,
          kind: 'block' as const,
          block: findBlock(topic, selection.blockId),
        },
  );
}
export function quickReferenceBlocks(
  entry: ReturnType<typeof selectQuickReference>[number],
) {
  return entry.kind === 'block'
    ? [entry.block]
    : entry.rows.flatMap((row) => row.extracts.map((extract) => extract.block));
}
// Hub groups with resolved links. Sources are de-duplicated per group so each
// source is listed once beside the answers it supports.
export function groupQuickReference(topic: Topic) {
  const experience = topic.experience;
  if (!experience) return [];
  const base = topicHref(topic.metadata);
  const entries = selectQuickReference(topic).map((entry) => {
    const owned =
      entry.kind === 'block' &&
      resolveTopicPage(topic, entry.page)!.sections.some((section) =>
        section.blocks.includes(entry.block),
      );
    // Flag policy dependence from universally shown content only; gated rows
    // carry the note on their full page.
    const universal =
      entry.kind === 'block'
        ? [entry.block]
        : entry.rows
            .filter((row) => !row.minimumLevel)
            .flatMap((row) => row.extracts.map((extract) => extract.block));
    return {
      ...entry,
      localPolicyMayVary: universal.some((block) => block.localPolicyMayVary),
      pageTitle: experience.pages.find((page) => page.slug === entry.page)!
        .title,
      href: `${base}/${entry.page}${owned ? `#block-${entry.block.id}` : ''}`,
    };
  });
  return experience.quickReferenceGroups.map((group) => {
    const members = entries.filter((entry) => entry.group === group.id);
    return {
      ...group,
      entries: members,
      referenceIds: [
        ...new Set(
          members.flatMap((entry) =>
            quickReferenceBlocks(entry).flatMap((block) => block.referenceIds),
          ),
        ),
      ],
      context: experience.contexts.find(
        (context) => context.id === group.contextId,
      ),
    };
  });
}
// Journey steps resolved to hub anchors or subpages.
export function topicJourney(topic: Topic) {
  const base = topicHref(topic.metadata);
  return (topic.experience?.journey ?? []).map((step) => ({
    label: step.label,
    href: step.page ? `${base}/${step.page}` : `#quick-${step.group}`,
  }));
}
// Walkthrough fields default to the depth of their deepest source block, so
// the page's training level decides how much operative reasoning appears.
function deepestLevel(blocks: ContentBlock[]): TrainingLevel {
  return blocks.reduce<TrainingLevel>(
    (deepest, block) =>
      trainingLevelRank(block.minimumLevel) > trainingLevelRank(deepest)
        ? block.minimumLevel
        : deepest,
    trainingLevels[0].id,
  );
}
export function resolveWalkthroughs(topic: Topic, page: string) {
  return (topic.experience?.walkthroughs ?? [])
    .filter((walkthrough) => walkthrough.page === page)
    .map((walkthrough) => {
      const block = findBlock(topic, walkthrough.blockId);
      const items = block.type === 'checklist' ? block.items : [];
      const steps = walkthrough.steps.map((step, index) => {
        const fields = step.fields.map((field) => {
          const extracts = field.extracts.map((extract) => ({
            ...extract,
            block: findBlock(topic, extract.blockId),
          }));
          return {
            kind: field.kind,
            minimumLevel:
              field.minimumLevel ??
              deepestLevel(extracts.map((extract) => extract.block)),
            extracts,
          };
        });
        return {
          number: index + 1,
          anchor: stepAnchor(walkthrough.id, index + 1),
          label: step.label,
          text: items[step.itemIndex],
          fields,
          gaps: step.gaps,
          links: [
            ...resolveLinks(topic, step.links),
            ...anatomyStepLinks(topic, walkthrough.id, index + 1),
          ],
        };
      });
      return {
        id: walkthrough.id,
        block,
        absorbsBlockIds: walkthrough.absorbsBlockIds,
        steps,
        referenceIds: uniqueReferences([
          block,
          ...steps.flatMap((step) =>
            step.fields.flatMap((field) =>
              field.extracts.map((extract) => extract.block),
            ),
          ),
        ]),
      };
    });
}
export type ResolvedWalkthrough = ReturnType<
  typeof resolveWalkthroughs
>[number];
export function resolveBriefings(topic: Topic, page: string) {
  return (topic.experience?.briefings ?? [])
    .filter((briefing) => briefing.page === page)
    .map((briefing) => {
      const rows = resolveRows(topic, briefing.rows);
      return {
        ...briefing,
        rows,
        referenceIds: uniqueReferences(
          rows.flatMap((row) => row.extracts.map((extract) => extract.block)),
        ),
      };
    });
}
export type ResolvedBriefing = ReturnType<typeof resolveBriefings>[number];
export function resolveBlockLinks(topic: Topic) {
  return Object.fromEntries(
    (topic.experience?.blockLinks ?? []).map((entry) => [
      entry.blockId,
      resolveLinks(topic, entry.links),
    ]),
  );
}
// Blocks flagged as policy-dependent, located on their owning subpage.
export function localPolicyEntries(topic: Topic) {
  const pages = topic.experience?.pages ?? [];
  return topic.sections.flatMap((section) => {
    const page = pages.find((entry) => entry.sectionIds.includes(section.id));
    if (!page) return [];
    return section.blocks
      .filter(
        (block) =>
          block.localPolicyMayVary ||
          (block.type === 'claimGroup' &&
            block.claims.some((claim) => claim.localPolicyMayVary)),
      )
      .map((block) => ({
        page,
        anchor: `block-${block.id}`,
        label:
          topic.experience?.presentation.find(
            (item) => item.blockId === block.id,
          )?.label ?? section.title,
      }));
  });
}
export type EntityLink = { id: string; title: string; href: string };
// A procedure as seen from one condition topic. `page` is set when the
// procedure's canonical page belongs to this topic.
export type ProcedureRelation = EntityLink & {
  summary: string;
  page?: string;
  conditions: EntityLink[];
  anatomyPage?: string;
  complicationsPage?: string;
  aftercarePage?: string;
};
// The procedures a topic owns, without registry context (no cross-topic
// links). The registry's relationsFor adds linked procedures and conditions.
export function ownProcedureRelations(topic: Topic): ProcedureRelation[] {
  if (topic.metadata.contentKind !== 'clinical') return [];
  const base = topicHref(topic.metadata);
  const condition = {
    id: topic.metadata.id,
    title: topic.metadata.title,
    href: base,
  };
  return topic.metadata.procedures.map((procedure) => ({
    id: procedure.id,
    title: procedure.title,
    summary: procedure.summary,
    href: `${base}/${procedure.page}`,
    page: procedure.page,
    conditions: [condition],
    anatomyPage: procedure.anatomyPage,
    complicationsPage: procedure.complicationsPage,
    aftercarePage: procedure.aftercarePage,
  }));
}
export const relatedKindLabels = {
  procedure: 'Procedure',
  anatomy: 'Anatomy',
  complications: 'Complications',
  aftercare: 'Aftercare',
} as const;
// Related links follow declared relationships only: procedure → anatomy,
// complications and aftercare; anatomy → procedure; complications →
// procedure and aftercare; aftercare → complications and procedure; any
// other page of a condition → its procedures.
export function relatedLinks(
  topic: Topic,
  procedures: ProcedureRelation[],
  current: string,
) {
  const base = topicHref(topic.metadata);
  const pageLink = (kind: keyof typeof relatedKindLabels, slug?: string) => {
    const page = topic.experience?.pages.find((entry) => entry.slug === slug);
    return page
      ? [{ kind, title: page.title, href: `${base}/${page.slug}` }]
      : [];
  };
  const procedureLink = (procedure: ProcedureRelation) => [
    {
      kind: 'procedure' as const,
      title: procedure.title,
      href: procedure.href,
    },
  ];
  const links = procedures.flatMap((procedure) => {
    if (procedure.page === current)
      return [
        ...pageLink('anatomy', procedure.anatomyPage),
        ...pageLink('complications', procedure.complicationsPage),
        ...pageLink('aftercare', procedure.aftercarePage),
      ];
    if (procedure.anatomyPage === current) return procedureLink(procedure);
    if (procedure.complicationsPage === current)
      return [
        ...procedureLink(procedure),
        ...pageLink('aftercare', procedure.aftercarePage),
      ];
    if (procedure.aftercarePage === current)
      return [
        ...pageLink('complications', procedure.complicationsPage),
        ...procedureLink(procedure),
      ];
    return procedureLink(procedure);
  });
  const currentHref = `${base}/${current}`;
  return links.filter(
    (link, index) =>
      link.href !== currentHref &&
      links.findIndex((other) => other.href === link.href) === index,
  );
}
// Operative anatomy views. Step ↔ structure links come from each structure's
// validated `steps`; nothing else declares them.
export const anatomyStepAnchor = (viewId: string, step: number) =>
  `${viewId}-step-${step}`;
function anatomyStepLinks(topic: Topic, walkthroughId: string, step: number) {
  return (topic.experience?.anatomyViews ?? [])
    .filter(
      (view) =>
        view.walkthroughId === walkthroughId &&
        view.structures.some((structure) => structure.steps.includes(step)),
    )
    .map((view) => ({
      label: `Operative anatomy: step ${step}`,
      href: `${topicHref(topic.metadata)}/${view.page}#${anatomyStepAnchor(view.id, step)}`,
    }));
}
export function resolveAnatomyViews(topic: Topic, page: string) {
  const experience = topic.experience;
  const base = topicHref(topic.metadata);
  return (experience?.anatomyViews ?? [])
    .filter((view) => view.page === page)
    .map((view) => {
      const walkthrough = experience!.walkthroughs.find(
        (entry) => entry.id === view.walkthroughId,
      )!;
      const stepLink = (number: number) => ({
        number,
        label: walkthrough.steps[number - 1].label,
        href: `${base}/${walkthrough.page}#${stepAnchor(walkthrough.id, number)}`,
        anchor: anatomyStepAnchor(view.id, number),
      });
      const structures = view.structures.map((structure) => {
        const fields = structure.fields.map((field) => {
          const blocks = field.extracts.map((extract) =>
            findBlock(topic, extract.blockId),
          );
          return {
            kind: field.kind,
            minimumLevel: deepestLevel(blocks),
            texts: field.extracts.map((extract) => extract.text),
            referenceIds: uniqueReferences(blocks),
          };
        });
        return {
          id: structure.id,
          label: structure.label,
          roles: structure.roles,
          fields,
          steps: structure.steps.map(stepLink),
          referenceIds: [
            ...new Set(fields.flatMap((field) => field.referenceIds)),
          ],
        };
      });
      const noteBlocks = view.notes.map((note) =>
        findBlock(topic, note.blockId),
      );
      return {
        id: view.id,
        title: view.title,
        caption: view.caption,
        walkthroughHref: `${base}/${walkthrough.page}#${stepAnchor(walkthrough.id, 1)}`,
        structures,
        // Steps that involve at least one structure in this view.
        steps: walkthrough.steps
          .map((_, index) => ({
            ...stepLink(index + 1),
            structureIds: structures
              .filter((structure) =>
                structure.steps.some((step) => step.number === index + 1),
              )
              .map((structure) => structure.id),
          }))
          .filter((step) => step.structureIds.length > 0),
        notes: {
          texts: view.notes.map((note) => note.text),
          referenceIds: uniqueReferences(noteBlocks),
        },
      };
    });
}
export type ResolvedAnatomyView = ReturnType<
  typeof resolveAnatomyViews
>[number];
