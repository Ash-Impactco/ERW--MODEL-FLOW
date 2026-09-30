import { test, expect } from '@playwright/test';

test('page loads without console errors and form controls drive results', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(`pageerror:${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(`console:${message.text()}`);
    }
  });

  await page.goto('/');
  await expect(page.locator('h1')).toHaveText('Ilha Carbon');
  await expect(errors).toHaveLength(0);

  await page.locator('#areaHa').fill('1500');
  await page.locator('#applicationRate').fill('40');
  await page.locator('#creditablePerT').fill('0.2');
  await page.locator('#discount').fill('0.2');
  await page.locator('#rockPricePerT').fill('23');
  await page.locator('#mrvCostPerHa').fill('480');
  await page.locator('#fixedMrvCost').fill('30000');
  await page.locator('#creditPrice').fill('60');

  await expect(page.locator('#resultBasaltTonnes')).toHaveText('60,000 t');
  await expect(page.locator('#resultCredits')).toHaveText('9,600');
  await expect(page.locator('#resultCostPerCredit')).toHaveText('€222');

  await page.locator('[data-preset="reducedRate"]').click();
  await expect(page.locator('#applicationRate')).toHaveValue('20.8');
  await expect(page.locator('[data-preset="reducedRate"]')).toHaveAttribute('aria-pressed', 'true');

  await page.locator('#projectSentenceOne').fill('Sentence one');
  await page.locator('#projectSentenceTwo').fill('Sentence two');
  await page.locator('#projectSentenceThree').fill('Sentence three');

  await expect(page.locator('#sentenceOutputOne')).toHaveText('Sentence one');
  await expect(page.locator('#sentenceOutputTwo')).toHaveText('Sentence two');
  await expect(page.locator('#sentenceOutputThree')).toHaveText('Sentence three');

  await page.locator('#resetModel').click();
  await expect(page.locator('#applicationRate')).toHaveValue('40');

  await page.locator('[data-stakeholder="investor"]').click();
  await expect(page.locator('[data-stakeholder="investor"]')).toHaveClass(/is-active/);

  await page.locator('.phase-toggle').first().click();
  await expect(page.locator('.phase-toggle').first()).toHaveAttribute('aria-expanded', 'true');

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('.mind-map-list')).toBeVisible();
  await expect(page.locator('.mind-map-svg')).not.toBeVisible();
});
