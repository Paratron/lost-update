import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CheckboxState } from './checkbox-state.model';

@Injectable({
  providedIn: 'root',
})
export class CheckboxService {
  private readonly http = inject(HttpClient);

  sendState(userId: string, state: CheckboxState): Observable<unknown> {
    return this.http.post(this.url(userId), state);
  }

  getState(userId: string): Observable<CheckboxState> {
    return this.http.get<CheckboxState>(this.url(userId));
  }

  private url(userId: string): string {
    return `http://localhost:3000/api/${userId}/checkbox-state`;
  }
}
