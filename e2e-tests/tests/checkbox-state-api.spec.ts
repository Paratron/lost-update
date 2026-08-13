import { expect } from '@playwright/test';
import { test } from './fixtures';

test.describe.serial('Checkbox State API', () => {
  test('POST should update the state', async ({ request, userId }) => {
    const newState = {
      checkbox1: true,
      checkbox2: false,
    };

    const response = await request.post(`/api/${userId}/checkbox-state`, {
      data: {
        state: newState,
      },
    });
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.message).toContain('Checkbox state stored successfully');

    await test.step('State should be returned as it was stored', async () => {
      const response = await request.get(`/api/${userId}/checkbox-state`);
      expect(response.status()).toBe(200);
      const responseBody = await response.json();
      expect(responseBody.state).toEqual(newState);
    });

    await test.step('Another update should overwrite the state', async () => {
      const updatedState = {
        checkbox1: false,
        checkbox2: true,
      };
      const response = await request.post(`/api/${userId}/checkbox-state`, {
        data: {
          state: updatedState,
        },
      });
      expect(response.status()).toBe(200);
      const responseBody = await response.json();
      expect(responseBody.message).toContain('Checkbox state stored successfully');

      const response2 = await request.get(`/api/${userId}/checkbox-state`);
      expect(response2.status()).toBe(200);
      const responseBody2 = await response2.json();
      expect(responseBody2.state).toEqual(updatedState);
    });
  });

  test('POST can be executed sequentially', async ({ request, userId }) => {
    const first = await request.post(`/api/${userId}/checkbox-state`, {
      data: {
        state: { checkbox1: false, checkbox2: true },
      },
    });
    const responseBody = await first.json();
    expect(responseBody.message).toContain('Checkbox state stored successfully');
    const second = await request.post(`/api/${userId}/checkbox-state`, {
      data: {
        state: { checkbox1: true, checkbox2: false },
      },
    });
    const responseBody2 = await second.json();
    expect(responseBody2.message).toContain('Checkbox state stored successfully');
  });

  test('POST should return 409 when multiple requests are sent in parallel', async ({
    request,
    userId,
  }) => {
    const newState = {
      state: { checkbox1: true, checkbox2: false },
    };

    // Send requests in parallel
    const responses = await Promise.all([
      request.post(`/api/${userId}/checkbox-state`, { data: newState }),
      request.post(`/api/${userId}/checkbox-state`, { data: newState }),
      request.post(`/api/${userId}/checkbox-state`, { data: newState }),
      request.post(`/api/${userId}/checkbox-state`, { data: newState }),
      request.post(`/api/${userId}/checkbox-state`, { data: newState }),
    ]);

    // At least one request should return 409
    expect(responses.some(response => response.status() === 409)).toBeTruthy();
  });

  test('GET for a new user should initialize and return the default state', async ({ request }) => {
    const response = await request.get(`/api/unknown-user/checkbox-state`);
    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({
      checkbox1: false,
      checkbox2: false,
      checkbox3: false,
      checkbox4: false,
    });
  });
});
