import { expect, test } from '@playwright/test';
const route = '/learn/demo/how-dissect-content-works';
test('topic depth, persistence, anchor navigation and references', async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  expect((await page.goto(route))?.status()).toBe(200);
  await expect(page).toHaveTitle('How Dissect content works | Dissect');
  await expect(
    page.getByText('NON-CLINICAL DEMO', { exact: true }),
  ).toBeVisible();
  const selectors = page.getByRole('combobox', { name: 'Training level' });
  await expect(selectors.first()).toHaveValue('medical-student');
  const advanced = page.getByText('Registrar example: one content source');
  await expect(advanced).toHaveCount(0);
  await selectors.first().selectOption('registrar');
  await expect(selectors.last()).toHaveValue('registrar');
  await expect(advanced).toBeVisible();
  await page.reload();
  await expect(selectors.first()).toHaveValue('registrar');
  await expect(advanced).toBeVisible();
  await page.screenshot({
    path: testInfo.outputPath('topic-registrar.png'),
    fullPage: true,
  });
  await page
    .locator('#section-learning-depth')
    .screenshot({ path: testInfo.outputPath('topic-depth-detail.png') });
  await selectors.last().selectOption('medical-student');
  await expect(advanced).toHaveCount(0);
  await page.getByRole('button', { name: 'Show advanced content' }).click();
  await expect(advanced).toBeVisible();
  await expect(selectors.first()).toHaveValue('medical-student');
  await page.getByRole('button', { name: 'Hide advanced content' }).click();
  await expect(advanced).toHaveCount(0);
  const sectionLink = page
    .getByRole('navigation', { name: 'Topic sections' })
    .getByRole('link', { name: 'Sources and provenance' });
  await sectionLink.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(`${route}#section-sources`);
  await expect(sectionLink).toHaveAttribute('aria-current', 'location');
  await page.reload();
  await expect(sectionLink).toHaveAttribute('aria-current', 'location');
  await page
    .getByRole('link', { name: /Source: Dissect v2/ })
    .first()
    .click();
  await expect(page).toHaveURL(`${route}#reference-dissect-blueprint`);
  await expect(page.locator('#reference-dissect-blueprint')).toBeInViewport();
  await page.getByRole('link', { name: 'References (2)', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'References', exact: true }),
  ).toBeInViewport();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: testInfo.outputPath('topic-student.png'),
    fullPage: true,
  });
  await page
    .getByRole('complementary', { name: 'Topic context' })
    .screenshot({ path: testInfo.outputPath('topic-sources-detail.png') });
  await page.setViewportSize({ width: 320, height: 740 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
});
test('unknown topic or specialty returns 404', async ({ page }) => {
  for (const path of [
    '/learn/demo/missing-topic',
    '/learn/unknown/how-dissect-content-works',
  ]) {
    expect((await page.goto(path))?.status()).toBe(404);
    await expect(
      page.getByRole('heading', { name: /not found|could not be found/i }),
    ).toBeVisible();
  }
});
