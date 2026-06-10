import { Locator, Page, test as base } from '@playwright/test';

export type CheckboxAppFixtures = {
  //  Frontend URL
  frontendBaseURL: string;
  // Generate a random string user ID
  userId: string;
  // Page object
  checkboxStateUi: CheckboxStateUi;
};

export const test = base.extend<CheckboxAppFixtures>({
  frontendBaseURL: ['', { option: true }],
  page: async ({ context, frontendBaseURL, userId }, use) => {
    const page = await context.newPage();
    const url = `${frontendBaseURL}/checkboxes/${userId}`;
    await page.goto(url);
    await use(page);
  },
  userId: async ({}, use) => {
    const randomUserId = Math.random().toString(36).substring(2, 15);
    await use(randomUserId);
  },
  checkboxStateUi: async ({ page, frontendBaseURL }, use) => {
    const checkboxStateUi = new CheckboxStateUi(page);
    await use(checkboxStateUi);
  },
});

export class CheckboxStateUi {
  private page: Page;
  private allCheckBoxesLocator: Locator;
  private errorLabelLocator: Locator;

  constructor(page: Page) {
    this.page = page;
    this.allCheckBoxesLocator = page.locator('input[type="checkbox"]');
    this.errorLabelLocator = page.locator('.error-label');
  }

  async reloadPage() {
    await this.page.reload();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getCheckboxValues(): Promise<{ label: string | undefined; isChecked: boolean }[]> {
    const checkboxes = await this.allCheckBoxesLocator.elementHandles();
    return Promise.all(
      checkboxes.map(async checkbox => {
        const label = await checkbox.evaluate(node => node.nextSibling?.textContent?.trim());
        const isChecked = await checkbox.isChecked();
        return { label, isChecked };
      }),
    );
  }

  /**
   * Toggle a checkbox by label.
   *
   * @param label
   */
  async toggleCheckbox(label: string) {
    const checkbox = this.page.getByText(label);
    await checkbox.check();
  }

  /**
   * Toggle n random checkboxes.
   *
   * Adds a random delay of up to 5 ms between each checkbox toggle.
   *
   * @param n nr of checkboxes to toggle
   */
  async toggleNRandomCheckboxes(n: number) {
    const checkboxes = await this.allCheckBoxesLocator.all();
    const randomIndexes = this.generateRandomIndexes(n, checkboxes.length);
    for (const index of randomIndexes) {
      const checked = await checkboxes[index].isChecked();
      if (checked) {
        await checkboxes[index].uncheck();
      } else {
        await checkboxes[index].check();
      }
      await this.page.waitForTimeout(Math.floor(Math.random() * 200));
    }
  }

  // Generate n random indexes between 0 and max
  private generateRandomIndexes(n: number, max: number) {
    const indexes = [];
    for (let i = 0; i < n; i++) {
      indexes.push(Math.floor(Math.random() * max));
    }
    return indexes;
  }

  async waitTillNetworkIdle() {
    const maxWaitTime = 10000; // 10 seconds maximum
    const idleTime = 1000; // Wait 1 second of no requests (enough for 200ms debounce + request)

    let lastRequestTime = Date.now();
    let pendingRequests = 0;
    let isResolved = false;

    const requestListener = () => {
      pendingRequests++;
      lastRequestTime = Date.now();
    };

    const responseListener = () => {
      pendingRequests--;
      lastRequestTime = Date.now();
    };

    this.page.on('request', requestListener);
    this.page.on('requestfinished', responseListener);
    this.page.on('requestfailed', responseListener);

    try {
      await Promise.race([
        // Option 1: Wait for idle condition
        new Promise<void>((resolve, reject) => {
          const checkIdle = async () => {
            if (isResolved) return; // Stop checking if already resolved

            // Fail fast if error label is shown
            const errorText = await this.getErrorStatusText();
            if (errorText) {
              isResolved = true;
              reject(new Error(`Error displayed during network wait: ${errorText}`));
              return;
            }

            const timeSinceLastRequest = Date.now() - lastRequestTime;

            if (pendingRequests === 0 && timeSinceLastRequest >= idleTime) {
              isResolved = true;
              resolve();
            } else {
              setTimeout(checkIdle, 100);
            }
          };
          checkIdle();
        }),
        // Option 2: Timeout after maxWaitTime
        new Promise<void>(resolve =>
          setTimeout(() => {
            isResolved = true;
            resolve();
          }, maxWaitTime),
        ),
      ]);
    } finally {
      this.page.off('request', requestListener);
      this.page.off('requestfinished', responseListener);
      this.page.off('requestfailed', responseListener);
    }
  }

  async getErrorStatusText() {
    const isVisible = await this.errorLabelLocator.isVisible();
    if (!isVisible) {
      return undefined;
    }
    return await this.errorLabelLocator.textContent();
  }
}
