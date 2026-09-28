import { expect, test } from '@playwright/test';

const route = '/learn/general-surgery/acute-appendicitis';
test('appendicitis discovery, editorial status, depth, navigation and sources', async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  expect((await page.goto(route))?.status()).toBe(200);
  await expect(page).toHaveTitle('Acute appendicitis | Dissect');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    /Assessment, management/,
  );
  await expect(
    page.getByText('Draft educational content — awaiting clinical review', {
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.getByText(/last clinically reviewed/i)).toHaveCount(0);
  const selector = page.getByRole('combobox', { name: 'Training level' });
  await expect(selector).toHaveCount(1);
  const bank = page.getByRole('region', { name: 'Hot Seat' });
  await expect(bank.getByRole('heading', { level: 3 })).toHaveCount(5);
  await page.screenshot({
    path: testInfo.outputPath('appendicitis-student.png'),
    fullPage: true,
  });
  await page
    .locator('article > header')
    .screenshot({ path: testInfo.outputPath('appendicitis-status.png') });
  await selector.selectOption('registrar');
  await page.reload();
  await expect(selector).toHaveValue('registrar');
  await expect(bank.getByRole('heading', { level: 3 })).toHaveCount(20);
  await expect(
    page.getByText(
      /Source types describe the publication, not evidence certainty/,
    ),
  ).toBeVisible();
  await expect(page.locator('#reference-wses-2025')).toContainText(
    'Mauro Podda, Marco Ceresoli, Belinda De Simone',
  );
  await page
    .locator('#section-presentation')
    .screenshot({ path: testInfo.outputPath('appendicitis-history.png') });
  await page
    .locator('#section-management')
    .screenshot({ path: testInfo.outputPath('appendicitis-management.png') });
  await page.screenshot({
    path: testInfo.outputPath('appendicitis-registrar.png'),
    fullPage: true,
  });
  await page
    .locator('#section-laparoscopic-appendicectomy')
    .screenshot({ path: testInfo.outputPath('appendicitis-operation.png') });
  const navLink = page
    .getByRole('navigation', { name: 'Topic sections' })
    .getByRole('link', { name: 'Consent', exact: true });
  await navLink.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(`${route}#section-consent`);
  await expect(navLink).toHaveAttribute('aria-current', 'location');
  await expect(
    page.getByRole('heading', { name: 'Consent', exact: true }),
  ).toBeInViewport();
  await page
    .locator('#section-consent')
    .screenshot({ path: testInfo.outputPath('appendicitis-consent.png') });
  await page
    .getByRole('link', { name: /Source: Consent: Supported Decision-Making/ })
    .first()
    .click();
  await expect(page.locator('#reference-rcs-consent')).toBeInViewport();
  await expect(
    page.getByRole('link', { name: /Open source\s*:\s*Consent:/ }),
  ).toHaveAttribute('rel', 'noopener noreferrer');
  await page
    .locator('#reference-wses-2025')
    .screenshot({ path: testInfo.outputPath('appendicitis-source.png') });
  await selector.selectOption('medical-student');
  await expect(bank.getByRole('heading', { level: 3 })).toHaveCount(5);
  await page.getByRole('button', { name: 'Show advanced content' }).click();
  await expect(bank.getByRole('heading', { level: 3 })).toHaveCount(20);
  await expect(selector).toHaveValue('medical-student');
  await page.getByRole('button', { name: 'Hide advanced content' }).click();
  await expect(bank.getByRole('heading', { level: 3 })).toHaveCount(5);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.setViewportSize({ width: 320, height: 740 });
  await page.getByRole('button', { name: 'Show advanced content' }).click();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.locator('#section-complications').screenshot({
    path: testInfo.outputPath('appendicitis-320-complications.png'),
  });
  await page.goto('/learn');
  await expect(
    page.getByText('General Surgery', { exact: true }),
  ).toBeVisible();
  await page
    .getByRole('link', { name: 'Acute appendicitis', exact: true })
    .click();
  await expect(page).toHaveURL(route);
  await expect(
    page.getByRole('heading', { level: 1, name: 'Acute appendicitis' }),
  ).toBeVisible();
  await page.screenshot({
    path: testInfo.outputPath('appendicitis-320-top.png'),
  });
  expect(errors).toEqual([]);
});
