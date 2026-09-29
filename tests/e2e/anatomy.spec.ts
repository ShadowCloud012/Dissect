import { expect, test, type Page } from '@playwright/test';

const base = '/learn/general-surgery/acute-appendicitis';

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
const structure = (page: Page, name: string) =>
  page
    .getByRole('list')
    .filter({ hasText: 'Caecum' })
    .getByRole('button', { name: new RegExp(`^${name}`) });
const state = (page: Page, id: string) =>
  page.locator(`[data-structure="${id}"]`).getAttribute('data-state');

test('select structures by tap and see sourced detail', async ({
  page,
}, info) => {
  const errors = trackErrors(page);
  await page.goto(`${base}/anatomy`);
  const view = page.getByRole('region', { name: 'The operative field' });
  await expect(
    view.getByRole('img', { name: 'Schematic: The operative field' }),
  ).toBeVisible();
  await expect(
    page.getByText('Draft educational content — awaiting clinical review', {
      exact: true,
    }),
  ).toBeVisible();
  for (const [id, name, text] of [
    ['caecum', 'Caecum', 'The caecum is the beginning of the large bowel'],
    [
      'taeniae-coli',
      'Taeniae coli',
      'Following the caecal taeniae to their convergence',
    ],
    [
      'appendicular-artery',
      'Appendicular artery',
      'passes posterior to the terminal ileum',
    ],
  ]) {
    // Tap the drawing itself.
    await view.locator(`[data-structure="${id}"] .anatomy-marker`).click();
    await expect(structure(page, name)).toHaveAttribute('aria-pressed', 'true');
    await expect(view).toContainText(text);
    expect(await state(page, id)).toBe('selected');
  }
  expect(await noOverflow(page)).toBe(true);
  await view.screenshot({ path: info.outputPath('anatomy-selected.png') });
  // Structure → operative step.
  await view
    .getByRole('link', {
      name: 'In the operation: step 3 · Mesoappendix & base',
    })
    .click();
  await expect(page).toHaveURL(`${base}/appendicectomy#step-appendicectomy-3`);
  await expect(page.locator('#step-appendicectomy-3')).toBeInViewport();
  expect(errors).toEqual([]);
});

test('operative step → anatomy, and keyboard operation', async ({ page }) => {
  const errors = trackErrors(page);
  await page.goto(`${base}/appendicectomy`);
  await page
    .locator('#step-appendicectomy-3')
    .getByRole('link', { name: 'Operative anatomy: step 3' })
    .click();
  await expect(page).toHaveURL(`${base}/anatomy#appendicectomy-anatomy-step-3`);
  await expect(
    page.getByRole('button', { name: 'Step 3 · Mesoappendix & base' }),
  ).toHaveAttribute('aria-pressed', 'true');
  expect(await state(page, 'mesoappendix')).toBe('emphasised');
  expect(await state(page, 'caecum')).toBe('dimmed');
  // Keyboard: focus a structure, select with Enter, move on with Tab/Space.
  await structure(page, 'Terminal ileum').focus();
  await page.keyboard.press('Enter');
  await expect(structure(page, 'Terminal ileum')).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(structure(page, 'Terminal ileum')).toBeFocused();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Space');
  await expect(structure(page, 'Appendix\\s*Removed')).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  // Bleeding risk: those structures are drawn dashed; others are dimmed.
  await page
    .getByRole('button', { name: 'Bleeding risk', exact: true })
    .click();
  await expect(page.locator('[data-structure="mesoappendix"]')).toHaveAttribute(
    'data-risk',
    '',
  );
  expect(await state(page, 'terminal-ileum')).toBe('dimmed');
  // The appendicectomy page links to the view.
  await page.goto(`${base}/appendicectomy`);
  await page
    .getByRole('link', { name: 'Operative anatomy (schematic)' })
    .click();
  await expect(page).toHaveURL(`${base}/anatomy#appendicectomy-anatomy`);
  expect(errors).toEqual([]);
});

for (const width of [320, 375, 390, 430])
  test(`anatomy is usable at ${width}px`, async ({ page }, info) => {
    test.skip(
      !info.project.name.startsWith('mobile') && ![320, 390].includes(width),
      'Other widths are checked on the mobile project',
    );
    const errors = trackErrors(page);
    await page.setViewportSize({ width, height: 800 });
    await page.goto(`${base}/anatomy`);
    const view = page.getByRole('region', { name: 'The operative field' });
    expect(await noOverflow(page)).toBe(true);
    // The drawing fills the column; controls are touch-sized.
    const figure = await view.getByRole('img').boundingBox();
    expect(figure!.width).toBeGreaterThan(width - 80);
    const heights = await view
      .locator('button, .anatomy-step-links a')
      .evaluateAll((items) =>
        items.map((item) => item.getBoundingClientRect().height),
      );
    for (const height of heights) expect(height).toBeGreaterThanOrEqual(43);
    // A tap on the drawing puts the detail directly beneath it.
    await view
      .locator('[data-structure="mesoappendix"] .anatomy-marker')
      .click();
    const detail = view.getByRole('heading', {
      level: 3,
      name: /Mesoappendix/,
    });
    await expect(detail).toBeVisible();
    const detailBox = await detail.boundingBox();
    // Measured after the tap, which may scroll the page: the detail follows
    // the figure (drawing and caption) directly.
    const drawing = await view.locator('figure').boundingBox();
    expect(detailBox!.y).toBeGreaterThan(drawing!.y + drawing!.height - 1);
    expect(detailBox!.y).toBeLessThan(drawing!.y + drawing!.height + 60);
    expect(await noOverflow(page)).toBe(true);
    await view.screenshot({ path: info.outputPath(`anatomy-${width}.png`) });
    expect(errors).toEqual([]);
  });
