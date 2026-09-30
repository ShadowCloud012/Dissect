import { render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { topicRegistry } from '@/content/registry';
import { resolveTheatrePrep } from '@/lib/topic-pages';
import { trainingLevelStorageKey } from '@/lib/training-level-storage';
import { validateTopic } from '@/schemas/topic';
import { TheatrePrep } from './theatre-prep';
import { TopicExperience } from './topic-experience';

const cases = [
  {
    slug: 'acute-appendicitis',
    page: 'appendicectomy',
    title: 'Laparoscopic appendicectomy',
    view: 'The operative field',
    steps: 5,
  },
  {
    slug: 'gallstone-disease',
    page: 'laparoscopic-cholecystectomy',
    title: 'Laparoscopic cholecystectomy',
    view: 'The hepatocystic triangle',
    steps: 6,
  },
] as const;
const topic = (slug: string) =>
  topicRegistry.getTopic('general-surgery', slug)!;
const renderPrep = (slug: string, page: string) => {
  const current = topic(slug);
  return render(
    <TheatrePrep topic={current} prep={resolveTheatrePrep(current, page)!} />,
  );
};
const section = (name: string) => screen.getByRole('region', { name });

beforeEach(() => {
  localStorage.clear();
  window.location.hash = '';
});

describe('composition', () => {
  it('references each procedure’s own walkthrough, anatomy view and plan panel', () => {
    for (const { slug, page, steps } of cases) {
      const prep = resolveTheatrePrep(topic(slug), page)!;
      const composition = topic(slug).experience!.theatrePreps[0];
      expect(prep.anatomy.id).toBe(composition.anatomyViewId);
      expect(prep.plan).toMatchObject({
        id: composition.planBriefingId,
        variant: 'plan',
      });
      // The sequence is the walkthrough itself, not a second list of steps.
      expect(prep.steps).toHaveLength(steps);
      const walkthrough = topic(slug).experience!.walkthroughs.find(
        (entry) => entry.id === composition.walkthroughId,
      )!;
      expect(prep.steps.map((step) => step.label)).toEqual(
        walkthrough.steps.map((step) => step.label),
      );
    }
    // Pages without a composition have no Theatre Prep.
    expect(
      resolveTheatrePrep(topic('acute-appendicitis'), 'anatomy'),
    ).toBeUndefined();
  });
  it('quotes existing blocks only, in sections of their own sources', () => {
    const prep = resolveTheatrePrep(
      topic('gallstone-disease'),
      'laparoscopic-cholecystectomy',
    )!;
    const sourceBlocks = (key: 'patient' | 'before' | 'consent' | 'after') => [
      ...new Set(
        prep[key].rows.flatMap((row) =>
          row.extracts.map((extract) => extract.blockId),
        ),
      ),
    ];
    expect(sourceBlocks('consent')).toEqual([
      'supported-decision',
      'patient-understanding',
      'procedure-risks',
    ]);
    expect(sourceBlocks('after')).toEqual([
      'recovery-basics',
      'postoperative-warning',
      'postoperative-review',
      'bile-leak',
    ]);
    expect(
      prep.gaps.map((gap) => [gap.section, gap.block.id, gap.belowLevel]),
    ).toEqual([
      ['before', 'preoperative-preparation-todo', undefined],
      ['consent', 'operation-consent-todo', 'cst'],
    ]);
    // Risks come from anatomy roles, never a separate list.
    expect(prep.risks.map((risk) => risk.id)).toEqual([
      'common-hepatic-duct',
      'common-bile-duct',
    ]);
    const appendix = resolveTheatrePrep(
      topic('acute-appendicitis'),
      'appendicectomy',
    )!;
    expect(appendix.risks.map((risk) => [risk.id, risk.roles])).toEqual([
      ['mesoappendix', ['controlled', 'bleeding-risk']],
      ['appendicular-artery', ['controlled', 'bleeding-risk']],
    ]);
  });
  it('rejects compositions that break provenance or structure', () => {
    const invalid = () => structuredClone(topic('gallstone-disease'));
    const prepOf = (copy: ReturnType<typeof invalid>) =>
      copy.experience!.theatrePreps[0];
    const expectInvalid = (
      change: (copy: ReturnType<typeof invalid>) => void,
      message: RegExp,
    ) => {
      const copy = invalid();
      change(copy);
      expect(() => validateTopic(copy)).toThrow(message);
    };
    expectInvalid((copy) => {
      prepOf(copy).procedureId = 'missing-procedure';
    }, /Theatre Prep for an unknown procedure/);
    expectInvalid((copy) => {
      prepOf(copy).anatomyViewId = 'missing-view';
    }, /anatomy view does not match/);
    expectInvalid((copy) => {
      prepOf(copy).planBriefingId = 'theatre-prep';
    }, /needs the procedure's plan panel/);
    expectInvalid((copy) => {
      prepOf(copy).gaps = [
        { section: 'before', blockId: 'surgery-indications' },
      ];
    }, /gap must be an editorial note/);
    expectInvalid((copy) => {
      prepOf(copy).patient[0].extracts[0].text = 'Most patients need surgery';
    }, /not verbatim/);
    // A CST source cannot be shown at Medical Student depth.
    expectInvalid((copy) => {
      delete prepOf(copy).consent.find(
        (row) => row.label === 'Risks to discuss',
      )!.minimumLevel;
    }, /shallower than its source: Risks to discuss/);
    expectInvalid((copy) => {
      prepOf(copy).after.push(prepOf(copy).after[0]);
    }, /Duplicate Theatre Prep row in after/);
    expectInvalid((copy) => {
      copy.experience!.theatrePreps.push(prepOf(copy));
    }, /One Theatre Prep per procedure/);
  });
});

describe.each(cases)(
  'rendering $title',
  ({ slug, page, title, view, steps }) => {
    it('renders every section through the same generic page', () => {
      renderPrep(slug, page);
      expect(
        screen.getByRole('heading', { level: 1, name: title }),
      ).toBeInTheDocument();
      expect(screen.getByText('5-minute Theatre Prep')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Draft educational content — awaiting clinical review',
        ),
      ).toBeInTheDocument();
      expect(
        within(
          screen.getByRole('navigation', { name: 'Theatre Prep sections' }),
        )
          .getAllByRole('link')
          .map((link) => link.textContent),
      ).toEqual([
        'Patient',
        'Before theatre',
        'Anatomy',
        'Operation',
        'Risks',
        'Plan',
        'Consent',
        'After',
      ]);
      for (const name of [
        'Patient & indication',
        'Before theatre',
        '30-second anatomy',
        'Operation in 60 seconds',
        'Risks in the operative field',
        'What could change the plan',
        'Consent snapshot',
        'After surgery',
      ])
        expect(section(name)).toBeInTheDocument();
      expect(
        within(section('30-second anatomy')).getByRole('img', {
          name: `Schematic: ${view}`,
        }),
      ).toBeInTheDocument();
      expect(
        within(section('Operation in 60 seconds')).getAllByRole('listitem'),
      ).toHaveLength(steps);
      // The plan panel's rows, without repeating its heading under this one.
      const plan = section('What could change the plan');
      expect(within(plan).getByText('Always')).toBeInTheDocument();
      expect(within(plan).queryByRole('heading', { level: 3 })).toBeNull();
      // The unsourced preparation remains a visible gap.
      expect(
        within(section('Before theatre')).getByText(/Clinical-review TODO/),
      ).toBeInTheDocument();
    });
    it('links to the canonical deeper pages', () => {
      renderPrep(slug, page);
      const base = `/learn/general-surgery/${slug}`;
      const deeper = within(
        screen.getByRole('navigation', { name: 'Go deeper' }),
      );
      expect(
        deeper.getAllByRole('link').map((link) => link.getAttribute('href')),
      ).toEqual([base, `${base}/${page}`]);
      // Each other deeper page is linked once, from its own section.
      for (const path of ['anatomy', 'consent', 'complications', 'post-op'])
        expect(
          screen
            .getAllByRole('link')
            .filter((link) => link.getAttribute('href') === `${base}/${path}`),
        ).toHaveLength(1);
      expect(
        screen.getByRole('link', { name: 'Open full walkthrough' }),
      ).toHaveAttribute(
        'href',
        expect.stringMatching(new RegExp(`^${base}/${page}#step-`)),
      );
    });
  },
);

describe('training depth', () => {
  it('shows core prep at Medical Student depth and hints at the rest', () => {
    renderPrep('gallstone-disease', 'laparoscopic-cholecystectomy');
    const consent = section('Consent snapshot');
    expect(consent).toHaveTextContent(
      'Explain why cholecystectomy is proposed',
    );
    // Rows above this depth are named in one line, not a hint row each.
    expect(consent).toHaveTextContent('Also at CST depth: Risks to discuss');
    expect(section('Before theatre')).toHaveTextContent(
      'Also at FY1/2 depth: MRCP, Team and initial care, Checklist, VTE and prophylaxis, Escalate',
    );
    expect(section('Before theatre')).not.toHaveTextContent(
      'Further detail at',
    );
    expect(section('Risks in the operative field')).toHaveTextContent(
      'Bile duct injury is the most common serious complication',
    );
  });
  it('adds operative judgement at CST depth without hiding the core', () => {
    localStorage.setItem(trainingLevelStorageKey, 'cst');
    renderPrep('gallstone-disease', 'laparoscopic-cholecystectomy');
    expect(section('Consent snapshot')).toHaveTextContent(
      'Discuss bleeding, infection, injury to the bile ducts',
    );
    expect(section('Consent snapshot')).toHaveTextContent(
      'Explain why cholecystectomy is proposed',
    );
    expect(section('What could change the plan')).toHaveTextContent(
      'intraoperative biliary imaging',
    );
    expect(section('What could change the plan')).toHaveTextContent(
      'Also at Registrar depth: Critical view not obtainable, Bile duct injury',
    );
  });
  it('adds difficult-case strategy at Registrar depth', () => {
    localStorage.setItem(trainingLevelStorageKey, 'registrar');
    renderPrep('acute-appendicitis', 'appendicectomy');
    expect(section('Patient & indication')).toHaveTextContent(
      'Antibiotic treatment can avoid immediate surgery in selected uncomplicated cases',
    );
    expect(section('What could change the plan')).toHaveTextContent(
      /involve an appropriately experienced colleague/i,
    );
    expect(section('What could change the plan')).not.toHaveTextContent(
      'Also at',
    );
  });
});

describe('risks and consent gaps', () => {
  it('groups risks by role and states each quoted risk once', () => {
    renderPrep('gallstone-disease', 'laparoscopic-cholecystectomy');
    let risks = section('Risks in the operative field');
    expect(
      within(risks)
        .getAllByRole('heading', { level: 3 })
        .map((heading) => heading.textContent),
    ).toEqual(['Structures to protect']);
    expect(risks).toHaveTextContent('Common hepatic duct · Common bile duct');
    expect(
      risks.textContent!.match(
        /Bile duct injury is the most common serious complication/g,
      ),
    ).toHaveLength(1);
    document.body.innerHTML = '';
    renderPrep('acute-appendicitis', 'appendicectomy');
    risks = section('Risks in the operative field');
    expect(
      within(risks)
        .getAllByRole('heading', { level: 3 })
        .map((heading) => heading.textContent),
    ).toEqual(['Bleeding risk']);
    // The artery's quoted risk is contained in the mesoappendix's: one entry.
    expect(risks).toHaveTextContent('Mesoappendix · Appendicular artery');
    expect(risks.textContent!.match(/Inadequate ligation/g)).toHaveLength(1);
    expect(within(risks).getAllByRole('link', { name: /^Step/ })).toHaveLength(
      2,
    );
  });
  it.each([
    ['medical-student', true],
    ['foundation', true],
    ['cst', false],
    ['registrar', false],
  ])(
    'shows the operation-specific consent gap at %s depth: %s',
    (level, shown) => {
      localStorage.setItem(trainingLevelStorageKey, level);
      renderPrep('acute-appendicitis', 'appendicectomy');
      const consent = section('Consent snapshot');
      const gap = within(consent).queryByText(
        /operation-specific consent — clinical\/editorial content needed/,
      );
      expect(!!gap).toBe(shown);
      // CST and above see the sourced operation-specific risks instead.
      if (!shown)
        expect(consent).toHaveTextContent(
          'Discuss anaesthetic considerations, bleeding, infection',
        );
    },
  );
});

describe('entry points', () => {
  it('links procedure pages and hubs to Theatre Prep', () => {
    const current = topic('gallstone-disease');
    const { unmount } = render(
      <TopicExperience
        topic={current}
        pageSlug="laparoscopic-cholecystectomy"
      />,
    );
    const href =
      '/learn/general-surgery/gallstone-disease/laparoscopic-cholecystectomy/theatre-prep';
    expect(screen.getByRole('link', { name: 'Theatre Prep' })).toHaveAttribute(
      'href',
      href,
    );
    expect(
      screen.getByText('Get ready for this operation in 5 minutes.'),
    ).toBeInTheDocument();
    unmount();
    render(<TopicExperience topic={current} />);
    expect(
      within(
        screen.getByRole('complementary', { name: 'Related procedure' }),
      ).getByRole('link', { name: 'Theatre Prep' }),
    ).toHaveAttribute('href', href);
  });
});
