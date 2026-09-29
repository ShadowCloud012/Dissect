import { expect, test } from '@playwright/test';
const base = '/learn/general-surgery/acute-appendicitis';
const views = [
  'assessment',
  'investigations',
  'management',
  'anatomy',
  'appendicectomy',
  'post-op',
  'complications',
  'consent',
  'hot-seat',
  'evidence',
];

test('specialty browsing, canonical discovery and all topic routes', async ({
  page,
}, info) => {
  // Walks every appendicitis route with reloads, so it needs a longer budget.
  test.setTimeout(90_000);
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.goto('/learn');
  await expect(
    page.getByRole('heading', { name: 'General Surgery' }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Acute appendicitis', exact: true }),
  ).toHaveCount(0);
  await page.screenshot({ path: info.outputPath('learn.png'), fullPage: true });
  await page.getByRole('link', { name: /Specialty General Surgery/ }).click();
  await expect(page).toHaveURL('/learn/general-surgery');
  await page.reload();
  const categories = page.getByRole('navigation', {
    name: 'Topic categories',
  });
  for (const [category, query] of [
    ['Emergency General Surgery', '?category=emergency-general-surgery'],
    ['Colorectal', '?category=colorectal'],
    ['All topics', ''],
  ]) {
    const link = categories.getByRole('link', { name: new RegExp(category) });
    await link.click();
    await expect(page).toHaveURL(`/learn/general-surgery${query}`);
    // Category views are real URLs that survive a refresh.
    await page.reload();
    await expect(link).toHaveAttribute('aria-current', 'true');
    await expect(
      page
        .getByRole('region', { name: 'Conditions' })
        .getByRole('link', { name: /Acute appendicitis/ }),
    ).toHaveAttribute('href', base);
  }
  await page.screenshot({
    path: info.outputPath('specialty.png'),
    fullPage: true,
  });
  await page
    .getByRole('region', { name: 'Conditions' })
    .getByRole('link', { name: /Acute appendicitis/ })
    .click();
  await expect(page).toHaveURL(base);
  await expect(
    page.getByRole('heading', { name: 'Clinical snapshot' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: /Do not miss deterioration/ }),
  ).toBeVisible();
  await page.screenshot({ path: info.outputPath('hub.png'), fullPage: true });
  await page
    .getByRole('combobox', { name: 'Training level' })
    .selectOption('registrar');
  for (const view of views) {
    expect((await page.goto(`${base}/${view}`))?.status()).toBe(200);
    await page.reload();
    await expect(
      page.getByRole('combobox', { name: 'Training level' }),
    ).toHaveValue('registrar');
    await expect(
      page.getByRole('combobox', { name: 'Training level' }),
    ).toHaveCount(1);
    await expect(
      page.getByText('Draft educational content — awaiting clinical review', {
        exact: true,
      }),
    ).toBeVisible();
    await expect(page.getByText(/last clinically reviewed/i)).toHaveCount(0);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      new RegExp(`${base}/${view}$`),
    );
    const nav = page.getByRole('navigation', {
      name: info.project.name.startsWith('mobile')
        ? 'Mobile topic pages'
        : 'Topic pages',
      exact: true,
    });
    if (info.project.name.startsWith('mobile'))
      await nav.locator('summary').click();
    await expect(nav.locator('a[aria-current="page"]')).toHaveAttribute(
      'href',
      `${base}/${view}`,
    );
    if (info.project.name.startsWith('mobile'))
      await nav.locator('summary').click();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: info.outputPath(`${view}.png`),
      fullPage: true,
    });
  }
  await page
    .getByRole('navigation', { name: 'Breadcrumb' })
    .getByRole('link', { name: 'Acute appendicitis', exact: true })
    .click();
  await expect(page).toHaveURL(base);
  await page
    .getByRole('link', { name: /^Source: NHS overview/ })
    .first()
    .click();
  await expect(page).toHaveURL(`${base}/evidence#reference-nhs-appendicitis`);
  await expect(page.locator('#reference-nhs-appendicitis')).toBeInViewport();
  expect(errors).toEqual([]);
});

test('mobile quick navigation, depth, keyboard recall and operative disclosures', async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.goto(`${base}/hot-seat`);
  const bank = page.getByRole('region', { name: 'Hot Seat' });
  await expect(bank.getByRole('heading', { level: 3 })).toHaveCount(6);
  const reveal = bank.locator('summary').first();
  const answer = bank.getByText(/Early visceral pain can give way/);
  await expect(answer).not.toBeVisible();
  await reveal.focus();
  await page.keyboard.press('Enter');
  await expect(answer).toBeVisible();
  await page.getByRole('button', { name: 'Show advanced content' }).click();
  await expect(bank.getByRole('heading', { level: 3 })).toHaveCount(20);
  await page.getByRole('button', { name: 'Hide advanced content' }).click();
  await expect(bank.getByRole('heading', { level: 3 })).toHaveCount(6);
  await page
    .getByRole('combobox', { name: 'Training level' })
    .selectOption('cst');
  await page.setViewportSize({ width: 320, height: 740 });
  const nav = page.getByRole('navigation', {
    name: 'Mobile topic pages',
    exact: true,
  });
  await nav.locator('summary').click();
  await nav.getByRole('link', { name: 'Appendicectomy', exact: true }).click();
  await expect(page).toHaveURL(`${base}/appendicectomy`);
  // The operative walkthrough is always open: five sequential steps.
  const steps = page.locator('.walkthrough-steps > li');
  await expect(steps).toHaveCount(5);
  await expect(steps.first()).toBeVisible();
  await page
    .locator('.walkthrough')
    .screenshot({ path: info.outputPath('320-operative-walkthrough.png') });
  for (const view of ['', ...views]) {
    await page.goto(`${base}${view ? `/${view}` : ''}`);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expect(
      page
        .getByRole('navigation', { name: 'Mobile topic pages', exact: true })
        .locator('summary'),
    ).toBeVisible();
    if (['', 'consent', 'complications', 'evidence'].includes(view))
      await page.screenshot({
        path: info.outputPath(`320-${view || 'hub'}.png`),
        fullPage: true,
      });
  }
  await page.goto(base);
  const quickJump = page.getByRole('navigation', { name: 'Quick jump' });
  await quickJump.getByRole('link', { name: 'Manage', exact: true }).click();
  await expect(page).toHaveURL(`${base}/management`);
  await expect(
    quickJump.getByRole('link', { name: 'Manage', exact: true }),
  ).toHaveAttribute('aria-current', 'page');
  // A pathway link to content above the selected depth reveals that block.
  await page
    .getByRole('figure', { name: 'How the management content fits together' })
    .getByRole('link', { name: /Mass or abscess/ })
    .click();
  await expect(page).toHaveURL(`${base}/management#block-abscess-options`);
  await expect(page.getByText(/appendiceal mass is treated/)).toBeInViewport();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page
    .getByRole('navigation', { name: 'Mobile topic pages', exact: true })
    .locator('summary')
    .click();
  expect(errors).toEqual([]);
});

test('unknown topic subpage returns 404', async ({ page }) => {
  expect((await page.goto(`${base}/missing`))?.status()).toBe(404);
});
