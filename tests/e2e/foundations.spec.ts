import { expect, test, type Page } from '@playwright/test';

const gs = '/learn/general-surgery';
const appendicitis = `${gs}/acute-appendicitis`;
const gallstone = `${gs}/gallstone-disease`;
const draft = 'Draft educational content — awaiting clinical review';

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

test('representative pages render with review status and no errors', async ({
  page,
}, info) => {
  test.setTimeout(90_000);
  const errors = trackErrors(page);
  const desktop = !info.project.name.startsWith('mobile');
  const paths = desktop
    ? [
        ['home', '/'],
        ['learn', '/learn'],
        ['general-surgery', gs],
        ['appendicitis', appendicitis],
        ['appendicectomy', `${appendicitis}/appendicectomy`],
        ['gallstone', gallstone],
        ['cholecystectomy', `${gallstone}/laparoscopic-cholecystectomy`],
        ['appendicitis-evidence', `${appendicitis}/evidence`],
        ['gallstone-evidence', `${gallstone}/evidence`],
      ]
    : [
        ['general-surgery', gs],
        ['appendicectomy', `${appendicitis}/appendicectomy`],
        ['cholecystectomy', `${gallstone}/laparoscopic-cholecystectomy`],
        ['gallstone-evidence', `${gallstone}/evidence`],
      ];
  if (!desktop) await page.setViewportSize({ width: 320, height: 740 });
  for (const [name, path] of paths) {
    expect((await page.goto(path))?.status(), path).toBe(200);
    expect(await noOverflow(page), path).toBe(true);
    if (path.includes('/learn/general-surgery/'))
      await expect(
        page.getByText(draft, { exact: true }).first(),
      ).toBeVisible();
    await page.screenshot({
      path: info.outputPath(`${name}.png`),
      fullPage: true,
    });
  }
  expect(errors).toEqual([]);
});

test('Evidence pages list only the sources each topic cites', async ({
  page,
}) => {
  const errors = trackErrors(page);
  const references = () =>
    page
      .getByRole('region', { name: 'References' })
      .locator('li[id^="reference-"]')
      .evaluateAll((items) => items.map((item) => item.id));
  await page.goto(`${gallstone}/evidence`);
  const gallstoneIds = await references();
  // Shared sources cited here are listed; others are not.
  expect(gallstoneIds).toEqual(
    expect.arrayContaining([
      'reference-rcs-consent',
      'reference-nice-vte',
      'reference-safe-cholecystectomy',
    ]),
  );
  for (const absent of ['nice-fluids', 'wses-2025', 'surgical-access-textbook'])
    expect(gallstoneIds).not.toContain(`reference-${absent}`);
  await expect(
    page.getByRole('heading', { name: 'Unresolved clinical-review TODOs' }),
  ).toBeVisible();
  await page.goto(`${appendicitis}/evidence`);
  const appendicitisIds = await references();
  expect(appendicitisIds).toContain('reference-rcs-consent');
  expect(appendicitisIds).not.toContain('reference-safe-cholecystectomy');
  expect(new Set(appendicitisIds).size).toBe(appendicitisIds.length);
  expect(errors).toEqual([]);
});

test('a shared block keeps its source badge and walkthrough link, and appears only where included', async ({
  page,
}) => {
  const errors = trackErrors(page);
  const base = appendicitis;
  await page.goto(`${base}/anatomy`);
  const block = page.locator('#block-abdominal-wall-access');
  await expect(block).toContainText('secondary port placement');
  await block
    .getByRole('link', {
      name: 'In the operation: step 1 · Position & access',
    })
    .click();
  await expect(page).toHaveURL(`${base}/appendicectomy#step-appendicectomy-1`);
  // Step 1's Danger quotes the shared block.
  await expect(page.locator('#step-appendicectomy-1')).toContainText(
    'superficial and inferior epigastric',
  );
  await page.goto(`${base}/anatomy`);
  await page
    .locator('#block-abdominal-wall-access')
    .getByRole('link', { name: /^Source: Textbook surgical access/ })
    .click();
  await expect(page).toHaveURL(
    `${base}/evidence#reference-surgical-access-textbook`,
  );
  await expect(
    page.locator('#reference-surgical-access-textbook'),
  ).toBeInViewport();
  // Not surfaced on the cholecystectomy pathway in this task.
  await page.goto(`${gallstone}/anatomy`);
  await expect(page.locator('#block-abdominal-wall-access')).toHaveCount(0);
  await page.goto(`${gallstone}/laparoscopic-cholecystectomy`);
  await expect(page.locator('#step-cholecystectomy-1')).not.toContainText(
    'epigastric',
  );
  expect(errors).toEqual([]);
});

test('related links follow condition and procedure relationships', async ({
  page,
}, info) => {
  test.skip(
    info.project.name.startsWith('mobile'),
    'The related rail is a desktop context column',
  );
  const errors = trackErrors(page);
  const related = page
    .getByRole('complementary', { name: 'Topic context' })
    .getByRole('region', { name: 'Related' })
    .getByRole('link');
  await page.goto(`${gallstone}/laparoscopic-cholecystectomy`);
  await expect(related).toHaveText([
    'AnatomyAnatomy',
    'ComplicationsComplications',
    'AftercarePost-op',
  ]);
  await page.goto(`${gallstone}/complications`);
  await expect(related).toHaveText([
    'ProcedureLaparoscopic cholecystectomy',
    'AftercarePost-op',
  ]);
  await related.first().click();
  await expect(page).toHaveURL(`${gallstone}/laparoscopic-cholecystectomy`);
  // The procedure's clinical context still links back to its condition.
  await page
    .getByRole('complementary', { name: 'Clinical context' })
    .getByRole('link', { name: 'Gallstone disease and acute cholecystitis' })
    .click();
  await expect(page).toHaveURL(gallstone);
  expect(errors).toEqual([]);
});
