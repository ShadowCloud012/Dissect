import { expect, test, type Page } from '@playwright/test';

const gs = '/learn/general-surgery';
const condition = `${gs}/gallstone-disease`;
const procedure = `${condition}/laparoscopic-cholecystectomy`;

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

test('General Surgery separates conditions and procedures, linked both ways', async ({
  page,
}, info) => {
  const errors = trackErrors(page);
  await page.goto(gs);
  const conditions = page.getByRole('region', { name: 'Conditions' });
  const procedures = page.getByRole('region', { name: 'Procedures' });
  await expect(conditions.getByRole('heading', { level: 3 })).toHaveCount(2);
  await expect(procedures.getByRole('heading', { level: 3 })).toHaveCount(2);
  expect(await noOverflow(page)).toBe(true);
  await page.screenshot({
    path: info.outputPath('discovery.png'),
    fullPage: true,
  });
  // Procedure-first entry → procedure page → back to its condition.
  await procedures
    .getByRole('link', { name: /Laparoscopic cholecystectomy/ })
    .click();
  await expect(page).toHaveURL(procedure);
  await page
    .getByRole('complementary', { name: 'Clinical context' })
    .getByRole('link', { name: 'Gallstone disease and acute cholecystitis' })
    .click();
  await expect(page).toHaveURL(condition);
  // Condition-first entry → related procedure.
  await page
    .getByRole('complementary', { name: 'Related procedure' })
    .getByRole('link', { name: 'Laparoscopic cholecystectomy' })
    .click();
  await expect(page).toHaveURL(procedure);
  expect(errors).toEqual([]);
});

test('new condition and procedure pages render without errors', async ({
  page,
}, info) => {
  const errors = trackErrors(page);
  for (const [name, path] of [
    ['condition', condition],
    ['procedure', procedure],
    ['anatomy', `${condition}/anatomy`],
    ['complications', `${condition}/complications`],
    ['consent', `${condition}/consent`],
    ['evidence', `${condition}/evidence`],
  ]) {
    expect((await page.goto(path))?.status(), path).toBe(200);
    await expect(
      page.getByText('Draft educational content — awaiting clinical review', {
        exact: true,
      }),
    ).toBeVisible();
    expect(await noOverflow(page)).toBe(true);
    await page.screenshot({
      path: info.outputPath(`${name}.png`),
      fullPage: true,
    });
  }
  // Sources resolve to the evidence page.
  await page.goto(`${condition}/anatomy`);
  await page
    .getByRole('link', {
      name: /^Source: Textbook laparoscopic cholecystectomy/,
    })
    .first()
    .click();
  await expect(page).toHaveURL(
    `${condition}/evidence#reference-lapchole-textbook`,
  );
  await expect(page.locator('#reference-lapchole-textbook')).toBeInViewport();
  expect(errors).toEqual([]);
});

for (const width of [320, 390])
  test(`cholecystectomy walkthrough is usable at ${width}px`, async ({
    page,
  }, info) => {
    const errors = trackErrors(page);
    await page.setViewportSize({ width, height: 740 });
    await page.goto(procedure);
    expect(await noOverflow(page)).toBe(true);
    // Procedure identity and prep are in the first screen.
    await expect(page.getByText('Procedure', { exact: true })).toBeVisible();
    const prep = page.getByRole('region', { name: '5-minute theatre prep' });
    expect((await prep.boundingBox())!.y).toBeLessThan(900);
    // The core operation is visible at the default Medical Student depth.
    const steps = page.locator('.walkthrough-steps > li');
    await expect(steps).toHaveCount(6);
    for (const index of [0, 1, 2, 3, 4, 5])
      await expect(steps.nth(index).locator('.walkthrough-text')).toBeVisible();
    // Technical judgement stays gated.
    const plan = page.getByRole('region', { name: 'What changes the plan' });
    await expect(plan.getByText(/subtotal cholecystectomy/)).toHaveCount(0);
    await expect(page.getByText('Two structures only')).toHaveCount(0);
    await page.screenshot({
      path: info.outputPath(`procedure-${width}.png`),
      fullPage: true,
    });
    await page.goto(condition);
    expect(await noOverflow(page)).toBe(true);
    await page.screenshot({ path: info.outputPath(`condition-${width}.png`) });
    await page.goto(gs);
    expect(await noOverflow(page)).toBe(true);
    await page.screenshot({
      path: info.outputPath(`discovery-${width}.png`),
      fullPage: true,
    });
    expect(errors).toEqual([]);
  });
