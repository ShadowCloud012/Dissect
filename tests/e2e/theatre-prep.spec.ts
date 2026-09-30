import { expect, test, type Page } from '@playwright/test';

const gs = '/learn/general-surgery';
const procedures = [
  {
    name: 'appendicectomy',
    procedure: `${gs}/acute-appendicitis/appendicectomy`,
    title: 'Laparoscopic appendicectomy',
    base: `${gs}/acute-appendicitis`,
    structure: 'Mesoappendix',
    what: 'The mesoappendix carries the appendicular arterial supply',
    risk: 'Bleeding risk',
    steps: 5,
  },
  {
    name: 'cholecystectomy',
    procedure: `${gs}/gallstone-disease/laparoscopic-cholecystectomy`,
    title: 'Laparoscopic cholecystectomy',
    base: `${gs}/gallstone-disease`,
    structure: 'Common bile duct',
    what: 'The cystic duct usually connects the gallbladder to the common bile duct',
    risk: 'Structures to protect',
    steps: 6,
  },
] as const;

function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  return errors;
}
const noOverflow = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth <= innerWidth);
const section = (page: Page, name: string) =>
  page.getByRole('region', { name, exact: true });

for (const item of procedures) {
  test(`${item.name}: Theatre Prep from the procedure page`, async ({
    page,
  }, info) => {
    test.skip(info.project.name.startsWith('mobile'), 'Desktop walk-through');
    const errors = trackErrors(page);
    await page.goto(item.procedure);
    await page.getByRole('link', { name: 'Theatre Prep', exact: true }).click();
    await expect(page).toHaveURL(`${item.procedure}/theatre-prep`);
    await expect(
      page.getByRole('heading', { level: 1, name: item.title }),
    ).toBeVisible();
    await expect(page.getByText('5-minute Theatre Prep')).toBeVisible();
    await expect(
      page.getByText('Draft educational content — awaiting clinical review', {
        exact: true,
      }),
    ).toBeVisible();
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
      await expect(section(page, name)).toBeVisible();
    await expect(
      section(page, 'Operation in 60 seconds').getByRole('listitem'),
    ).toHaveCount(item.steps);
    // Risk roles render as text from the server, not colour alone.
    await expect(section(page, 'Risks in the operative field')).toContainText(
      item.risk,
    );
    // The anatomy glance: tap a structure to see its sourced line.
    const anatomy = section(page, '30-second anatomy');
    await anatomy
      .getByRole('button', { name: new RegExp(`^${item.structure}`) })
      .click();
    await expect(anatomy).toContainText(item.what);
    await page.screenshot({
      path: info.outputPath(`${item.name}-prep.png`),
      fullPage: true,
    });
    // Deeper pages are canonical and real.
    for (const [name, href] of [
      ['Full operative anatomy', `${item.base}/anatomy`],
      ['Full consent page', `${item.base}/consent`],
      ['Post-op', `${item.base}/post-op`],
      ['Complications', `${item.base}/complications`],
    ])
      await expect(
        page.getByRole('link', { name, exact: true }).first(),
      ).toHaveAttribute('href', href);
    await page.getByRole('link', { name: 'Open full walkthrough' }).click();
    await expect(page).toHaveURL(new RegExp(`${item.procedure}#step-`));
    await page.goBack();
    await page
      .getByRole('link', { name: 'Full operative anatomy' })
      .first()
      .click();
    await expect(page).toHaveURL(`${item.base}/anatomy`);
    expect(errors).toEqual([]);
  });
}

test('an advanced training level adds depth without hiding core prep', async ({
  page,
}) => {
  const errors = trackErrors(page);
  await page.goto(`${procedures[1].procedure}/theatre-prep`);
  const consent = section(page, 'Consent snapshot');
  await expect(consent).toContainText('Also at CST depth: Risks to discuss');
  await expect(consent).toContainText(
    'operation-specific consent — clinical/editorial content needed',
  );
  await page
    .getByRole('combobox', { name: 'Training level' })
    .selectOption('cst');
  await expect(consent).toContainText(
    'Discuss bleeding, infection, injury to the bile ducts',
  );
  await expect(consent).toContainText(
    'Explain why cholecystectomy is proposed',
  );
  await expect(section(page, 'What could change the plan')).toContainText(
    'intraoperative biliary imaging',
  );
  expect(errors).toEqual([]);
});

for (const width of [320, 390])
  for (const item of procedures)
    test(`${item.name} Theatre Prep is usable at ${width}px`, async ({
      page,
    }, info) => {
      test.skip(
        !info.project.name.startsWith('mobile') && width !== 320,
        'Checked once on desktop',
      );
      const errors = trackErrors(page);
      await page.setViewportSize({ width, height: 800 });
      await page.goto(`${item.procedure}/theatre-prep`);
      expect(await noOverflow(page)).toBe(true);
      // Compact section navigation jumps within the page.
      const nav = page.getByRole('navigation', {
        name: 'Theatre Prep sections',
      });
      await nav.getByRole('link', { name: 'Risks', exact: true }).click();
      await expect(
        page.getByRole('heading', {
          level: 2,
          name: 'Risks in the operative field',
        }),
      ).toBeInViewport();
      // Sequence readable, anatomy usable, targets touch-sized.
      await expect(
        section(page, 'Operation in 60 seconds').getByRole('listitem').first(),
      ).toBeVisible();
      const anatomy = section(page, '30-second anatomy');
      await anatomy
        .getByRole('button', { name: new RegExp(`^${item.structure}`) })
        .click();
      await expect(anatomy).toContainText(item.what);
      const heights = await page
        .locator(
          '.prep-nav a, .prep-more a, .anatomy-glance-key button, .prep-risk-steps a, .prep-deeper a',
        )
        .evaluateAll((items) =>
          items.map((node) => node.getBoundingClientRect().height),
        );
      for (const height of heights) expect(height).toBeGreaterThanOrEqual(43);
      // Dense, not padded: the whole briefing stays well under a long read.
      expect(
        await page.evaluate(() => document.documentElement.scrollHeight),
      ).toBeLessThan(8000);
      expect(await noOverflow(page)).toBe(true);
      await page.screenshot({
        path: info.outputPath(`${item.name}-prep-${width}.png`),
        fullPage: true,
      });
      expect(errors).toEqual([]);
    });
