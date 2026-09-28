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
    ['/', 'Know the patient. Understand the operation.'],
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
  const primary = page.getByRole('navigation', { name: 'Primary' });
  // Unbuilt areas keep their routes but are not offered as navigation.
  await expect(primary.getByRole('link')).toHaveText(['Learn']);
  const learn = primary.getByRole('link', { name: 'Learn', exact: true });
  await learn.click();
  await expect(page).toHaveURL(/\/learn$/);
  await expect(learn).toHaveAttribute('aria-current', 'page');
  await expect(selector).toHaveValue('cst');
  await page.reload();
  await expect(selector).toHaveValue('cst');
  await page.getByRole('link', { name: 'Dissect home' }).click();
  await expect(page).toHaveURL('/');
  await page.screenshot({
    path: testInfo.outputPath('shell.png'),
    fullPage: true,
  });
  await page.getByRole('link', { name: 'Explore General Surgery' }).click();
  await expect(page).toHaveURL('/learn/general-surgery');
  expect(errors).toEqual([]);
});
