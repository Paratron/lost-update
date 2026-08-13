import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ErrorReportingService } from './error-reporting.service';

describe('ErrorReportingService', () => {
  let service: ErrorReportingService;

  beforeEach(() => {
    jest.useFakeTimers();
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorReportingService);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('reports an error and clears it after five seconds', () => {
    service.report('Failed to save state', new Error('Conflict'));

    expect(service.message()).toBe('Failed to save state: Conflict');

    jest.advanceTimersByTime(5000);

    expect(service.message()).toBeNull();
  });

  it('reports the HTTP status and backend message for conflicts', () => {
    service.report(
      'Failed to save state',
      new HttpErrorResponse({
        status: 409,
        statusText: 'Conflict',
        error: { message: 'Version mismatch' },
      }),
    );

    expect(service.message()).toBe('Failed to save state: 409 Conflict: Version mismatch');
  });

  it('reports a message from an error-like response', () => {
    service.report('Failed to save state', { message: 'Request failed' });

    expect(service.message()).toBe('Failed to save state: Request failed');
  });
});
