import { expect } from '@playwright/test';
import { test } from './fixtures';

test.describe.serial('UI Tests', () => {
  test('Click a checkbox and verify that changes where saved', async ({ checkboxStateUi }) => {
    await test.step('Initial state: all checkboxes unchecked', async () => {
      const c = await checkboxStateUi.getCheckboxValues();
      expect(c).toHaveLength(4);
      expect(c).toContainEqual({ label: 'To Be or Not to Be', isChecked: false });
      expect(c).toContainEqual({
        label: 'Something is Rotten in the State of Denmark',
        isChecked: false,
      });
    });

    await test.step('Toggle two checkboxes and verify that changes where saved', async () => {
      await checkboxStateUi.toggleCheckbox('To Be or Not to Be');
      await checkboxStateUi.toggleCheckbox('Something is Rotten in the State of Denmark');

      const c2 = await checkboxStateUi.getCheckboxValues();
      expect(c2).toContainEqual({ label: 'To Be or Not to Be', isChecked: true });
      expect(c2).toContainEqual({
        label: 'Something is Rotten in the State of Denmark',
        isChecked: true,
      });
    });
    expect(await checkboxStateUi.getErrorStatusText()).toBe(undefined);
  });

  test('Click random checkboxes and verify that the final state is saved', async ({
    checkboxStateUi,
  }) => {
    await test.step('Toggle 20 random checkboxes really fast', async () => {
      await checkboxStateUi.toggleNRandomCheckboxes(20);
    });

    await test.step('Verify that the final state is saved correctly', async () => {
      const stateWhichShouldBeSaved = await checkboxStateUi.getCheckboxValues();

      await checkboxStateUi.waitTillNetworkIdle();
      await checkboxStateUi.reloadPage();
      await checkboxStateUi.waitTillNetworkIdle();
      const actualStateAfterLoad = await checkboxStateUi.getCheckboxValues();
      expect(actualStateAfterLoad).toEqual(stateWhichShouldBeSaved);
    });

    await test.step('Verify that no error occurred during the process', async () => {
      await checkboxStateUi.waitTillNetworkIdle();
      expect(await checkboxStateUi.getErrorStatusText()).toBe(undefined);
    });
  });
});
