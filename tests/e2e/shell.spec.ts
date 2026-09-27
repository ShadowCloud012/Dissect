import { expect, test } from '@playwright/test';

test('shell routes, navigation and local training level work without browser errors', async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  const routes = [
    ['/', 'Learn surgery the way surgeons think.'],
    ['/learn', 'Learn'],
    ['/practice', 'Practice'],
    ['/theatre', 'Theatre'],
    ['/search', 'Search'],
  ];
  for (const [path, title] of routes) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(
      page.getByRole('heading', { level: 1, name: title, exact: true }),
    ).toBeVisible();
    await page.reload();
    await expect(
      page.getByRole('heading', { level: 1, name: title, exact: true }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  }
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('link', { name: 'Skip to content' }),
  ).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();
  const selector = page.getByRole('combobox', { name: 'Training level' });
  await selector.selectOption('cst');
  for (const label of ['Learn', 'Practice', 'Theatre', 'Search']) {
    const link = page
      .getByRole('navigation', { name: 'Primary' })
      .getByRole('link', { name: label, exact: true });
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(new RegExp(`/${label.toLowerCase()}$`));
    await expect(link).toHaveAttribute('aria-current', 'page');
    await expect(selector).toHaveValue('cst');
  }
  await page.reload();
  await expect(selector).toHaveValue('medical-student');
  await page.getByRole('link', { name: 'Dissect home' }).click();
  await expect(page).toHaveURL('/');
  await page.screenshot({
    path: testInfo.outputPath('shell.png'),
    fullPage: true,
  });
  await page.getByRole('link', { name: 'Explore Learn' }).click();
  await expect(page).toHaveURL('/learn');
  expect(errors).toEqual([]);
});
