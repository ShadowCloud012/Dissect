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

test('homepage leads with the operation and links to real destinations', async ({
  page,
}, info) => {
  const errors = trackErrors(page);
  await page.goto('/');
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Know the patient. Understand the operation.',
    }),
  ).toBeVisible();
  // Operative value is visible in the first viewport.
  await expect(
    page.getByRole('figure').getByText('The operation', { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText('Draft educational content — awaiting clinical review', {
      exact: true,
    }),
  ).toBeVisible();
  await page.screenshot({ path: info.outputPath('home.png'), fullPage: true });
  const journey = page
    .getByRole('list')
    .filter({ hasText: 'Follow the operation' });
  await journey.getByRole('link', { name: 'Operative steps' }).click();
  await expect(page).toHaveURL(
    `${base}/appendicectomy#block-operative-sequence`,
  );
  // The core sequence is visible at the default (Medical Student) depth.
  await expect(page.locator('.operative-steps')).toBeVisible();
  await expect(page.getByText(/Shown from a direct link/)).toHaveCount(0);
  await page.goto('/');
  await page.setViewportSize({ width: 320, height: 740 });
  expect(await noOverflow(page)).toBe(true);
  await page.screenshot({
    path: info.outputPath('home-320.png'),
    fullPage: true,
  });
  expect(errors).toEqual([]);
});

for (const width of [320, 375, 390, 430])
  test(`overview shows useful content in the first ${width}px viewport`, async ({
    page,
  }, info) => {
    const errors = trackErrors(page);
    await page.setViewportSize({ width, height: 740 });
    await page.goto(base);
    expect(await noOverflow(page)).toBe(true);
    // The clinical snapshot starts within the first viewport.
    const snapshot = page.getByRole('region', { name: 'Clinical snapshot' });
    const box = await snapshot.boundingBox();
    expect(box!.y).toBeLessThan(740);
    await expect(
      page.getByText('Draft educational content — awaiting clinical review', {
        exact: true,
      }),
    ).toBeInViewport();
    await page.screenshot({ path: info.outputPath(`overview-${width}.png`) });
    await page.screenshot({
      path: info.outputPath(`overview-${width}-full.png`),
      fullPage: true,
    });
    // The journey's Pre-op step jumps to the Before theatre group.
    await page
      .getByRole('navigation', { name: 'Patient journey' })
      .getByRole('link', { name: 'Pre-op' })
      .click();
    await expect(
      page.getByRole('heading', { name: /Before theatre/ }),
    ).toBeInViewport();
    info.annotations.push({
      type: 'overview-height',
      description: String(
        await page.evaluate(() => document.documentElement.scrollHeight),
      ),
    });
    // One sticky row: quick jump plus the full page menu.
    const menu = page.getByRole('navigation', { name: 'Mobile topic pages' });
    await menu.locator('summary').click();
    await expect(
      menu.getByRole('link', { name: 'Hot Seat', exact: true }),
    ).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(
      menu.getByRole('link', { name: 'Hot Seat', exact: true }),
    ).toBeHidden();
    await expect(menu.locator('summary')).toBeFocused();
    expect(errors).toEqual([]);
  });

test('representative pages render without overflow or errors', async ({
  page,
}, info) => {
  const errors = trackErrors(page);
  for (const [name, path] of [
    ['learn', '/learn'],
    ['general-surgery', '/learn/general-surgery'],
    ['overview', base],
    ['investigations', `${base}/investigations`],
    ['appendicectomy', `${base}/appendicectomy`],
    ['hot-seat', `${base}/hot-seat`],
    ['evidence', `${base}/evidence`],
  ]) {
    await page.goto(path);
    expect(await noOverflow(page)).toBe(true);
    await page.screenshot({
      path: info.outputPath(`${name}.png`),
      fullPage: true,
    });
  }
  // Subpages always offer a route back to the overview.
  await page.goto(`${base}/consent`);
  await page
    .getByRole('complementary', { name: 'Topic context' })
    .getByRole('link', { name: /Acute appendicitis overview/ })
    .click();
  await expect(page).toHaveURL(base);
  expect(errors).toEqual([]);
});
