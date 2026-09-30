import { expect, test, type Page } from '@playwright/test';

const base = '/learn/general-surgery/gallstone-disease';
const appendicitis = '/learn/general-surgery/acute-appendicitis';

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
const view = (page: Page) =>
  page.getByRole('region', { name: 'The hepatocystic triangle' });
const structure = (page: Page, name: string) =>
  view(page)
    .getByRole('list')
    .filter({ hasText: 'Gallbladder' })
    .getByRole('button', { name: new RegExp(`^${name}`) });
const state = (page: Page, id: string) =>
  page.locator(`[data-structure="${id}"]`).getAttribute('data-state');

test('cholecystectomy anatomy: controlled, at-risk and the critical view', async ({
  page,
}, info) => {
  test.skip(info.project.name.startsWith('mobile'), 'Desktop walkthrough');
  const errors = trackErrors(page);
  await page.goto(`${base}/anatomy`);
  await expect(
    view(page).getByRole('img', {
      name: 'Schematic: The hepatocystic triangle',
    }),
  ).toBeVisible();
  await expect(view(page)).toContainText('Schematic, not to scale');
  await expect(
    page.getByText('Draft educational content — awaiting clinical review', {
      exact: true,
    }),
  ).toBeVisible();
  // Filters follow the roles present: no bleeding risk is sourced here.
  await expect(
    view(page)
      .getByRole('group', { name: 'Emphasise structures' })
      .getByRole('button'),
  ).toHaveText(['All structures', 'Landmarks', 'Structures at risk']);
  for (const [id, name, text] of [
    ['cystic-duct', 'Cystic duct', 'Controlled and divided'],
    [
      'cystic-artery',
      'Cystic artery',
      'usually arises from the right hepatic artery',
    ],
    ['common-bile-duct', 'Common bile duct', 'Structure at risk'],
  ]) {
    await structure(page, name).click();
    await expect(structure(page, name)).toHaveAttribute('aria-pressed', 'true');
    await expect(view(page)).toContainText(text);
    expect(await state(page, id)).toBe('selected');
  }
  await view(page).screenshot({ path: info.outputPath('chole-anatomy.png') });
  // Structure at risk → its complication.
  await view(page)
    .getByRole('link', { name: 'Complications: bile duct or organ injury' })
    .click();
  await expect(page).toHaveURL(
    `${base}/complications#block-complications-table`,
  );
  await page.goBack();
  // The critical-view step highlights its structures.
  await view(page)
    .getByRole('button', {
      name: 'Step 3 · Achieve the critical view of safety',
    })
    .click();
  expect(await state(page, 'cystic-duct')).toBe('emphasised');
  expect(await state(page, 'common-bile-duct')).toBe('emphasised');
  expect(await state(page, 'gallbladder')).toBe('dimmed');
  // Structures at risk, dashed as well as coloured.
  await view(page)
    .getByRole('button', { name: 'Structures at risk', exact: true })
    .click();
  for (const id of ['common-hepatic-duct', 'common-bile-duct'])
    await expect(page.locator(`[data-structure="${id}"]`)).toHaveAttribute(
      'data-risk',
      '',
    );
  expect(await state(page, 'cystic-artery')).toBe('dimmed');
  await view(page).screenshot({ path: info.outputPath('chole-at-risk.png') });
  // Anatomy → what changes the plan.
  await view(page)
    .getByRole('link', {
      name: 'When the anatomy is unclear: what changes the plan',
    })
    .click();
  await expect(page).toHaveURL(
    `${base}/laparoscopic-cholecystectomy#block-senior-help`,
  );
  expect(errors).toEqual([]);
});

test('cholecystectomy step → anatomy → step', async ({ page }) => {
  const errors = trackErrors(page);
  await page.goto(`${base}/laparoscopic-cholecystectomy`);
  await page
    .locator('#step-cholecystectomy-3')
    .getByRole('link', { name: 'Operative anatomy: step 3' })
    .click();
  await expect(page).toHaveURL(
    `${base}/anatomy#cholecystectomy-anatomy-step-3`,
  );
  await expect(
    view(page).getByRole('button', {
      name: 'Step 3 · Achieve the critical view of safety',
    }),
  ).toHaveAttribute('aria-pressed', 'true');
  expect(await state(page, 'hepatocystic-triangle')).toBe('emphasised');
  await structure(page, 'Cystic artery').click();
  await view(page)
    .getByRole('link', { name: 'In the operation: step 4 · Clip & divide' })
    .click();
  await expect(page).toHaveURL(
    `${base}/laparoscopic-cholecystectomy#step-cholecystectomy-4`,
  );
  await expect(page.locator('#step-cholecystectomy-4')).toBeInViewport();
  // The procedure page links to the view.
  await page
    .getByRole('link', { name: 'Operative anatomy (schematic)' })
    .click();
  await expect(page).toHaveURL(`${base}/anatomy#cholecystectomy-anatomy`);
  expect(errors).toEqual([]);
});

for (const width of [320, 375, 390, 430])
  test(`cholecystectomy anatomy is usable at ${width}px`, async ({
    page,
  }, info) => {
    test.skip(
      !info.project.name.startsWith('mobile') && ![320, 390].includes(width),
      'Other widths are checked on the mobile project',
    );
    const errors = trackErrors(page);
    await page.setViewportSize({ width, height: 800 });
    await page.goto(`${base}/anatomy`);
    expect(await noOverflow(page)).toBe(true);
    const heights = await view(page)
      .locator('button, .anatomy-step-links a')
      .evaluateAll((items) =>
        items.map((item) => item.getBoundingClientRect().height),
      );
    for (const height of heights) expect(height).toBeGreaterThanOrEqual(43);
    for (const [id, name] of [
      ['cystic-duct', 'Cystic duct'],
      ['common-hepatic-duct', 'Common hepatic duct'],
    ]) {
      await view(page).locator(`[data-marker="${id}"]`).click();
      const detail = view(page).getByRole('heading', {
        level: 3,
        name: new RegExp(name),
      });
      await expect(detail).toBeVisible();
      // Measured after the tap: the detail follows the figure directly.
      const detailBox = await detail.boundingBox();
      const figure = await view(page).locator('figure').boundingBox();
      expect(detailBox!.y).toBeGreaterThan(figure!.y + figure!.height - 1);
      expect(detailBox!.y).toBeLessThan(figure!.y + figure!.height + 60);
    }
    await view(page)
      .getByRole('button', { name: 'Step 4 · Clip & divide' })
      .click();
    expect(await state(page, 'cystic-duct')).toBe('emphasised');
    expect(await noOverflow(page)).toBe(true);
    await view(page).screenshot({
      path: info.outputPath(`chole-anatomy-${width}.png`),
    });
    expect(errors).toEqual([]);
  });

test('appendicectomy anatomy is unchanged by the second view', async ({
  page,
}) => {
  const errors = trackErrors(page);
  await page.goto(`${appendicitis}/anatomy`);
  const appendix = page.getByRole('region', { name: 'The operative field' });
  await expect(
    appendix
      .getByRole('group', { name: 'Emphasise structures' })
      .getByRole('button'),
  ).toHaveText(['All structures', 'Landmarks', 'Bleeding risk']);
  await expect(appendix.locator('[data-structure]')).toHaveCount(8);
  await expect(appendix).toContainText(
    'Dashed vessel: posterior to the terminal ileum.',
  );
  await expect(appendix).not.toContainText('cystic artery is drawn');
  expect(errors).toEqual([]);
});
