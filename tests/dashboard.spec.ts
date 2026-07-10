import {expect, test} from '@playwright/test';

test.beforeEach(async ({page}) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('dashboard renders and income chart responds', async ({page}) => {
  await expect(page.getByRole('heading', {name: 'Income Tracker'})).toBeVisible();
  await expect(page.getByText('Your Recent Projects')).toBeVisible();
  await page.getByRole('button', {name: 'Week'}).click();
  await expect(page.getByRole('button', {name: 'Month'})).toBeVisible();
});

test('creates and persists a new project', async ({page}) => {
  await page.getByRole('button', {name: 'Projects', exact: true}).click();
  await page.getByRole('button', {name: 'New project'}).click();
  await page.getByLabel('Project title').fill('Brand identity system');
  await page.getByLabel('Hourly rate').fill('80');
  await page.getByLabel('Description').fill('Visual identity and design system delivery.');
  await page.getByRole('button', {name: 'Create project'}).click();
  await expect(page.getByText('Project created successfully')).toBeVisible();
  await expect(page.getByRole('heading', {name: 'Brand identity system'})).toBeVisible();
  await page.reload();
  await page.getByRole('button', {name: 'Projects', exact: true}).click();
  await expect(page.getByRole('heading', {name: 'Brand identity system'})).toBeVisible();
});

test('sends a message and upgrades premium', async ({page}) => {
  await page.getByRole('button', {name: 'Messages', exact: true}).click();
  await page.getByPlaceholder('Message Randy...').fill('Ready for the next milestone.');
  await page.getByRole('button', {name: 'Enviar mensaje'}).click();
  await expect(page.getByText('Ready for the next milestone.')).toBeVisible();

  await page.getByRole('button', {name: 'Home', exact: true}).click();
  await page.getByRole('button', {name: 'Upgrade now'}).click();
  await expect(page.getByText('Premium Unlocked')).toBeVisible();
});

test('mobile navigation opens and changes page', async ({page}) => {
  await page.setViewportSize({width: 390, height: 844});
  await page.reload();
  await page.getByRole('button', {name: 'Abrir menú'}).click();
  await page.getByRole('button', {name: 'Wallet', exact: true}).click();
  await expect(page.getByRole('heading', {name: 'Wallet'})).toBeVisible();
});
