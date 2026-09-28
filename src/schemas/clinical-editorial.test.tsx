import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { howDissectContentWorks } from '@/content/demo/how-dissect-content-works';
import { EditorialStatus } from '@/components/topic/editorial-status';
import { validateTopic } from './topic';

function clinicalFixture() {
  const { demoReviewedAt: _demoDate, ...metadata } =
    howDissectContentWorks.metadata;
  void _demoDate;
  return {
    metadata: {
      ...metadata,
      contentKind: 'clinical',
      status: 'awaiting-review',
      clinicalReviewer: null,
      lastClinicallyReviewed: null,
    },
    sections: [
      {
        id: 'overview',
        title: 'Overview',
        blocks: [
          {
            id: 'example',
            type: 'question',
            minimumLevel: 'medical-student',
            question: 'An editorial test?',
            answer: 'A structural fixture, not medical guidance.',
            referenceIds: ['dissect-blueprint'],
          },
        ],
      },
    ],
    references: howDissectContentWorks.references,
  };
}
describe('clinical editorial safeguards', () => {
  it.each(['draft', 'awaiting-review'])(
    'never renders a sign-off date for %s',
    (status) => {
      const topic = validateTopic({
        ...clinicalFixture(),
        metadata: { ...clinicalFixture().metadata, status },
      });
      render(<EditorialStatus metadata={topic.metadata} />);
      expect(
        screen.queryByText(/last clinically reviewed/i),
      ).not.toBeInTheDocument();
      expect(screen.getByText(/Draft educational content/)).toBeVisible();
    },
  );
  it('requires both a reviewer and date for sign-off and rejects unreviewed sign-off fields', () => {
    for (const fields of [
      { status: 'clinically-reviewed' },
      { status: 'clinically-reviewed', clinicalReviewer: 'Test reviewer' },
      { status: 'clinically-reviewed', lastClinicallyReviewed: '2026-09-28' },
      { status: 'awaiting-review', lastClinicallyReviewed: '2026-09-28' },
      { status: 'draft', clinicalReviewer: 'Test reviewer' },
      { status: 'published' },
    ])
      expect(() =>
        validateTopic({
          ...clinicalFixture(),
          metadata: { ...clinicalFixture().metadata, ...fields },
        }),
      ).toThrow();
    const topic = validateTopic({
      ...clinicalFixture(),
      metadata: {
        ...clinicalFixture().metadata,
        status: 'clinically-reviewed',
        clinicalReviewer: 'Test reviewer',
        lastClinicallyReviewed: '2026-09-28',
      },
    });
    render(<EditorialStatus metadata={topic.metadata} />);
    expect(screen.getByText(/Last clinically reviewed/)).toHaveTextContent(
      'Test reviewer',
    );
  });
  it('rejects absent references and unreferenced clinical blocks/questions', () => {
    expect(() =>
      validateTopic({ ...clinicalFixture(), references: [] }),
    ).toThrow(/Clinical topics require references/);
    const topic = clinicalFixture();
    topic.sections[0].blocks[0].referenceIds = [];
    expect(() => validateTopic(topic)).toThrow(/referenceIds/);
    expect(() =>
      validateTopic({
        ...topic,
        sections: [
          {
            id: 'overview',
            title: 'Overview',
            blocks: [
              {
                id: 'fact',
                type: 'prose',
                minimumLevel: 'medical-student',
                paragraphs: ['Test fact.'],
              },
            ],
          },
        ],
      }),
    ).toThrow(/Clinical content requires a reference/);
  });
  it('rejects duplicate block and claim IDs', () => {
    const topic = validateTopic(howDissectContentWorks);
    topic.sections[0].blocks.push(topic.sections[0].blocks[0]);
    const group = topic.sections[2].blocks[0];
    if (group.type !== 'claimGroup') throw new Error('Expected claim fixture');
    group.claims.push(group.claims[0]);
    expect(() => validateTopic(topic)).toThrow(/Duplicate block ID/);
    expect(() => validateTopic(topic)).toThrow(/Duplicate claim ID/);
  });
});
