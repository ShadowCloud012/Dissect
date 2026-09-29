import { expect, test, type Page } from '@playwright/test';

const gs = '/learn/general-surgery';

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
const results = (page: Page) =>
  page.getByRole('list', { name: 'Search results' }).getByRole('listitem');

test('Search is reachable from the header and General Surgery', async ({
  page,
}, info) => {
  const errors = trackErrors(page);
  await page.goto('/');
  await page.screenshot({ path: info.outputPath('home.png') });
  const primary = page.getByRole('navigation', { name: 'Primary' });
  await primary.getByRole('link', { name: 'Search' }).click();
  await expect(page).toHaveURL('/search');
  await expect(primary.getByRole('link', { name: 'Search' })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await expect(page.getByRole('searchbox')).toBeFocused();
  await page.goto(gs);
  await page.getByRole('link', { name: 'Search Dissect' }).click();
  await expect(page).toHaveURL('/search');
  expect(await noOverflow(page)).toBe(true);
  await page.screenshot({ path: info.outputPath('initial.png') });
  expect(errors).toEqual([]);
});

const cases = [
  // query, first result title, kind label, destination, matched note
  [
    'appendicitis',
    'Acute appendicitis',
    'Condition',
    `${gs}/acute-appendicitis`,
    'Also known as: appendicitis',
  ],
  [
    'appendectomy',
    'Laparoscopic appendicectomy',
    'Procedure',
    `${gs}/acute-appendicitis/appendicectomy`,
    'Also known as: appendectomy',
  ],
  [
    'lap chole',
    'Laparoscopic cholecystectomy',
    'Procedure',
    `${gs}/gallstone-disease/laparoscopic-cholecystectomy`,
    'Also known as: lap chole',
  ],
  [
    'cystic duct',
    'Anatomy — Gallstone disease and acute cholecystitis',
    'Anatomy',
    `${gs}/gallstone-disease/anatomy`,
    'Matched keyword: cystic duct',
  ],
  [
    'bile duct injury',
    'Complications — Gallstone disease and acute cholecystitis',
    'Complications',
    `${gs}/gallstone-disease/complications`,
    'Matched keyword: bile duct injury',
  ],
] as const;

for (const [query, title, kind, href, matched] of cases)
  test(`"${query}" leads to the ${kind.toLowerCase()} result`, async ({
    page,
  }, info) => {
    const errors = trackErrors(page);
    if (info.project.name.startsWith('mobile'))
      await page.setViewportSize({ width: 320, height: 740 });
    await page.goto('/search');
    await page.getByRole('searchbox').fill(query);
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(`/search?q=${encodeURIComponent(query)}`);
    const first = results(page).first();
    await expect(first.getByRole('link').first()).toHaveText(title);
    await expect(first).toContainText(`${kind} · General Surgery`);
    await expect(first).toContainText(matched);
    await expect(first).toContainText('Draft · awaiting clinical review');
    expect(await noOverflow(page)).toBe(true);
    await page.screenshot({
      path: info.outputPath(`${query.replaceAll(' ', '-')}.png`),
      fullPage: true,
    });
    // Keyboard: from the field, Tab reaches the first result's link.
    await page.getByRole('searchbox').focus();
    await page.keyboard.press('Tab');
    if (await page.getByRole('button', { name: 'Clear search' }).isVisible())
      await page.keyboard.press('Tab');
    await expect(first.getByRole('link').first()).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(href);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    expect(errors).toEqual([]);
  });

test('a shared search URL, no-result state and clearing', async ({
  page,
}, info) => {
  const errors = trackErrors(page);
  if (info.project.name.startsWith('mobile'))
    await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/search?q=appendisitis');
  await expect(page.getByRole('searchbox')).toHaveValue('appendisitis');
  await expect(page.getByRole('status')).toHaveText(
    'No exact or metadata match for “appendisitis”.',
  );
  await expect(results(page)).toHaveCount(0);
  expect(await noOverflow(page)).toBe(true);
  await page.screenshot({ path: info.outputPath('no-result.png') });
  await page.getByRole('button', { name: 'Clear search' }).click();
  await expect(page.getByRole('searchbox')).toBeFocused();
  await expect(page).toHaveURL('/search');
  // Example searches are real terms and work as links.
  await page
    .getByRole('navigation', { name: 'Example searches' })
    .getByRole('link', { name: 'Cystic duct' })
    .click();
  await expect(page).toHaveURL('/search?q=Cystic%20duct');
  await expect(page.getByRole('searchbox')).toHaveValue('Cystic duct');
  await expect(results(page).first()).toContainText(
    'Anatomy · General Surgery',
  );
  await page.getByRole('searchbox').press('Escape');
  await expect(page.getByRole('searchbox')).toHaveValue('');
  expect(errors).toEqual([]);
});

for (const width of [320, 375, 390, 430])
  test(`search fits at ${width}px`, async ({ page }, info) => {
    test.skip(
      !info.project.name.startsWith('mobile') && width !== 320,
      'Widths are checked on the mobile project',
    );
    const errors = trackErrors(page);
    await page.setViewportSize({ width, height: 740 });
    await page.goto('/search?q=anatomy');
    await expect(results(page)).toHaveCount(2);
    expect(await noOverflow(page)).toBe(true);
    // Header keeps Learn, Search and the training level on one row.
    const primary = page.getByRole('navigation', { name: 'Primary' });
    await expect(primary.getByRole('link', { name: 'Search' })).toBeVisible();
    const heights = await page
      .locator('.search-result-title, .search-clear, .search-field input')
      .evaluateAll((items) =>
        items.map((item) => item.getBoundingClientRect().height),
      );
    for (const height of heights) expect(height).toBeGreaterThanOrEqual(43);
    await page.screenshot({ path: info.outputPath(`search-${width}.png`) });
    expect(errors).toEqual([]);
  });

test('the field follows the URL: Search nav item, back and forward', async ({
  page,
}) => {
  const errors = trackErrors(page);
  const field = page.getByRole('searchbox');
  const status = page.getByRole('status');
  await page.goto('/search');
  await page
    .getByRole('navigation', { name: 'Example searches' })
    .getByRole('link', { name: 'Lap chole' })
    .click();
  await expect(page).toHaveURL('/search?q=Lap%20chole');
  await expect(field).toHaveValue('Lap chole');
  // Typing replaces this history entry rather than adding new ones.
  await field.fill('cystic duct');
  await expect(page).toHaveURL('/search?q=cystic%20duct');
  // The Search nav item starts a fresh search.
  await page
    .getByRole('navigation', { name: 'Primary' })
    .getByRole('link', { name: 'Search' })
    .click();
  await expect(page).toHaveURL('/search');
  await expect(field).toHaveValue('');
  await expect(status).toHaveText(
    'Try a condition, procedure, anatomy term or complication.',
  );
  await expect(results(page)).toHaveCount(0);
  await page.goBack();
  await expect(page).toHaveURL('/search?q=cystic%20duct');
  await expect(field).toHaveValue('cystic duct');
  await expect(results(page).first()).toContainText(
    'Anatomy · General Surgery',
  );
  await page.goBack();
  await expect(page).toHaveURL('/search');
  await expect(field).toHaveValue('');
  await expect(results(page)).toHaveCount(0);
  await page.goForward();
  await expect(field).toHaveValue('cystic duct');
  await expect(results(page).first()).toContainText(
    'Anatomy · General Surgery',
  );
  await page.goForward();
  await expect(page).toHaveURL('/search');
  await expect(field).toHaveValue('');
  // Clear still clears and keeps focus in the field.
  await field.fill('lap chole');
  await page.getByRole('button', { name: 'Clear search' }).click();
  await expect(field).toHaveValue('');
  await expect(field).toBeFocused();
  await expect(page).toHaveURL('/search');
  expect(errors).toEqual([]);
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  // The page is static and results are ranked in the browser: without
  // JavaScript the form and guidance render, but no results are claimed.
  test('the static page renders the form but not results', async ({ page }) => {
    await page.goto('/search?q=lap%20chole');
    await expect(
      page.getByRole('heading', { level: 1, name: 'Search' }),
    ).toBeVisible();
    await expect(page.getByRole('searchbox')).toBeVisible();
    await expect(results(page)).toHaveCount(0);
  });
});

for (const [query, first, second] of [
  ['app', 'Acute appendicitis', 'Laparoscopic appendicectomy'],
  [
    'chol',
    'Gallstone disease and acute cholecystitis',
    'Laparoscopic cholecystectomy',
  ],
  ['meso', 'Anatomy — Acute appendicitis', 'Laparoscopic appendicectomy'],
] as const)
  test(`prefix "${query}" finds natural partial terms`, async ({
    page,
  }, info) => {
    const errors = trackErrors(page);
    if (info.project.name.startsWith('mobile'))
      await page.setViewportSize({ width: 320, height: 740 });
    await page.goto('/search');
    await page.getByRole('searchbox').fill(query);
    const titles = results(page).locator('.search-result-title');
    await expect(titles.nth(0)).toHaveText(first);
    await expect(titles.nth(1)).toHaveText(second);
    // A prefix is never presented as an exact match.
    await expect(page.getByText('Exact match')).toHaveCount(0);
    expect(await noOverflow(page)).toBe(true);
    await page.screenshot({
      path: info.outputPath(`prefix-${query}.png`),
      fullPage: true,
    });
    expect(errors).toEqual([]);
  });

test('a misspelling still finds nothing', async ({ page }) => {
  await page.goto('/search?q=appendisitis');
  await expect(page.getByRole('status')).toHaveText(
    'No exact or metadata match for “appendisitis”.',
  );
  await page.getByRole('searchbox').fill('a');
  await expect(results(page)).toHaveCount(0);
});
