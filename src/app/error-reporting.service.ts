import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ErrorReportingService {
  private readonly errorMessage = signal<string | null>(null);
  private errorTimeout: ReturnType<typeof setTimeout> | null = null;

  readonly message = this.errorMessage.asReadonly();

  report(context: string, error: unknown): void {
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
    }

    const detail = this.errorDetail(error);
    this.errorMessage.set(`${context}: ${detail}`);

    this.errorTimeout = setTimeout(() => {
      this.errorMessage.set(null);
      this.errorTimeout = null;
    }, 5000);
  }

  private errorDetail(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const responseMessage = this.responseMessage(error.error);
      const status = error.status
        ? `${error.status}${error.statusText ? ` ${error.statusText}` : ''}`
        : null;

      if (status && responseMessage) {
        return `${status}: ${responseMessage}`;
      }

      return responseMessage ?? error.message;
    }

    if (error instanceof Error) {
      return error.message;
    }

    return this.responseMessage(error) ?? 'Unknown error';
  }

  private responseMessage(error: unknown): string | null {
    if (typeof error === 'string' && error.trim()) {
      return error;
    }

    if (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof error.message === 'string' &&
      error.message.trim()
    ) {
      return error.message;
    }

    return null;
  }
}
