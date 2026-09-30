import { test, expect } from '@playwright/test';

const PUBLIC_MODE = false;

test('public mode cannot expose private names in text', async ({ page }) => {
  await page.goto('/');

  const bodyText = await page.locator('body').innerText();
  expect(bodyText.toLowerCase()).not.toContain('private');
  expect(bodyText.toLowerCase()).not.toContain('owner');
  expect(bodyText.toLowerCase()).not.toContain('individual');

  const html = await page.content();
  expect(html.toLowerCase()).not.toContain('private');
  expect(html.toLowerCase()).not.toContain('owner');
  expect(html.toLowerCase()).not.toContain('individual');

  if (PUBLIC_MODE) {
    expect(bodyText.toLowerCase()).not.toContain('person');
  }
});
