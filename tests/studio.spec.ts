import {expect, test} from '@playwright/test';

test('renders the WebGL playground and interactive controls', async ({page}) => {
  await page.goto('/');
  await expect(page.getByRole('heading', {name: /WE MAKE/})).toBeVisible();
  await expect(page.locator('canvas')).toBeVisible();

  await page.getByRole('button', {name: 'Hot signal'}).click();
  await page.getByRole('button', {name: 'Pause animation'}).click();
  await expect(page.getByRole('button', {name: 'Play animation'})).toBeVisible();

  await page.getByRole('button', {name: 'Select CORE'}).click();
  await expect(page.getByRole('heading', {name: 'CORE'})).toBeVisible();
});

test('opens and closes a project case study', async ({page}) => {
  await page.goto('/');
  await page.locator('.project-tile').first().click();
  await expect(page.getByRole('dialog', {name: 'NOMA LABS'})).toBeVisible();
  await expect(page.getByRole('heading', {name: 'A softer kind of future'})).toBeVisible();
  await page.getByRole('button', {name: 'Close project'}).click();
  await expect(page.getByRole('dialog', {name: 'NOMA LABS'})).not.toBeVisible();
});

test('submits a project inquiry', async ({page}) => {
  await page.goto('/');
  await page.getByRole('button', {name: 'Start a project'}).click();
  await page.getByLabel('YOUR NAME').fill('Mara Studio');
  await page.getByLabel('EMAIL').fill('hello@mara.design');
  await page.getByLabel('WHAT DO YOU NEED?').selectOption('Visual identity');
  await page.getByLabel('THE SHORT VERSION').fill('We need a new global identity.');
  await page.getByRole('button', {name: 'Send inquiry'}).click();
  await expect(page.getByRole('heading', {name: /GOOD THINGS/})).toBeVisible();
});

test('mobile navigation reveals studio links', async ({page}) => {
  await page.setViewportSize({width: 390, height: 844});
  await page.goto('/');
  await page.getByRole('button', {name: 'Toggle menu'}).click();
  await expect(page.getByRole('button', {name: 'Playground'})).toBeVisible();
  await page.getByRole('button', {name: 'Work'}).click();
  await expect(page.getByText('SELECTED WORK')).toBeInViewport();
});
