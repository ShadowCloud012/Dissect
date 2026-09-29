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

test('homepage describes the product, with appendicitis as the flagship example', async ({
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
  // Six product capabilities, each with a real flagship example.
  const jobs = page
    .getByRole('list')
    .filter({ hasText: 'Follow the operation' });
  await expect(jobs.getByRole('heading', { level: 3 })).toHaveText([
    'Understand the patient',
    'Prepare for theatre',
    'Understand the anatomy',
    'Follow the operation',
    'Understand decisions',
    'After surgery',
  ]);
  await expect(
    page.getByRole('complementary', { name: 'Acute appendicitis' }),
  ).toBeVisible();
  await expect(
    page.getByText('Draft educational content — awaiting clinical review', {
      exact: true,
    }),
  ).toBeVisible();
  // A real walkthrough step illustrates how every operation is taught.
  await expect(
    page.getByRole('figure').getByText('Mesoappendix & base', { exact: true }),
  ).toBeVisible();
  await page.screenshot({ path: info.outputPath('home.png'), fullPage: true });
  await jobs.getByRole('link', { name: 'Operative walkthrough' }).click();
  await expect(page).toHaveURL(`${base}/appendicectomy#step-appendicectomy-1`);
  // The core sequence is visible at the default (Medical Student) depth.
  await expect(page.locator('.walkthrough-steps > li')).toHaveCount(5);
  await expect(page.locator('#step-appendicectomy-1')).toBeInViewport();
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
    ['anatomy', `${base}/anatomy`],
    ['complications', `${base}/complications`],
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

for (const width of [320, 375, 390, 430])
  test(`operative walkthrough is usable at ${width}px`, async ({
    page,
  }, info) => {
    const errors = trackErrors(page);
    await page.setViewportSize({ width, height: 740 });
    await page.goto(`${base}/appendicectomy`);
    expect(await noOverflow(page)).toBe(true);
    // Theatre prep starts in the first screen; the walkthrough stays open.
    const prep = page.getByRole('region', { name: '5-minute theatre prep' });
    expect((await prep.boundingBox())!.y).toBeLessThan(740);
    const steps = page.locator('.walkthrough-steps > li');
    await expect(steps).toHaveCount(5);
    for (const index of [0, 1, 2, 3, 4])
      await expect(steps.nth(index).locator('.walkthrough-text')).toBeVisible();
    // Contextual links offer ~44px touch targets on phones.
    const heights = await page
      .locator('.walkthrough-links a, .block-links a, .row-link')
      .evaluateAll((links) =>
        links.map((link) => link.getBoundingClientRect().height),
      );
    expect(heights.length).toBeGreaterThan(5);
    for (const height of heights) expect(height).toBeGreaterThanOrEqual(43);
    // Advanced strategy stays gated at the default Medical Student depth.
    const plan = page.getByRole('region', { name: 'What changes the plan' });
    await expect(plan.getByText('Further detail at CST depth')).toHaveCount(5);
    await expect(plan.getByText(/Device choice and strategy/)).toHaveCount(0);
    await expect(
      page.getByText('Draft educational content — awaiting clinical review', {
        exact: true,
      }),
    ).toBeVisible();
    await page.screenshot({
      path: info.outputPath(`appendicectomy-${width}.png`),
      fullPage: true,
    });
    expect(errors).toEqual([]);
  });

test('every topic cross-link resolves to a real route and anchor', async ({
  page,
}, info) => {
  test.skip(info.project.name !== 'desktop-chromium', 'Checked once');
  // Crawls every page of both pathways, then every link it finds.
  test.setTimeout(180_000);
  const hrefs = new Set<string>();
  const topicPages = (topic: string, pages: string[]) =>
    ['', ...pages].map(
      (view) => `/learn/general-surgery/${topic}${view && `/${view}`}`,
    );
  for (const path of [
    '/',
    '/learn/general-surgery',
    ...topicPages('acute-appendicitis', [
      'appendicectomy',
      'anatomy',
      'complications',
      'consent',
      'post-op',
      'hot-seat',
    ]),
    ...topicPages('gallstone-disease', [
      'assessment',
      'management',
      'laparoscopic-cholecystectomy',
      'anatomy',
      'complications',
      'consent',
      'post-op',
      'hot-seat',
    ]),
  ]) {
    await page.goto(path);
    // Reveal every level so gated rows' links are included.
    const advanced = page.getByRole('button', {
      name: 'Show advanced content',
    });
    if (await advanced.count()) await advanced.click();
    for (const href of await page
      .locator('main a[href^="/learn/general-surgery/"]')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href')!)))
      hrefs.add(href);
  }
  expect(hrefs.size).toBeGreaterThan(20);
  for (const href of hrefs) {
    // Navigate with the hash, as a reader would: anchors above the default
    // depth are revealed by the direct link itself.
    const hash = href.split('#')[1];
    const response = await page.goto(href);
    if (response) expect(response.status(), href).toBe(200);
    if (hash) await expect(page.locator(`[id="${hash}"]`), href).toHaveCount(1);
  }
});
