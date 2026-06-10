import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CheckboxState } from './checkbox-state.model';

@Injectable({
  providedIn: 'root',
})
export class CheckboxService {
  private apiUrl = '';

  constructor(private http: HttpClient) {}

  // Use CheckboxState interface for the checkbox state
  sendState(state: CheckboxState): Observable<any> {
    console.log('Sending state to API:', state);
    return this.http.post(this.apiUrl, state);
  }

  // Retrieve the current checkbox state from the backend
  getState(): Observable<CheckboxState> {
    return this.http.get<CheckboxState>(this.apiUrl);
  }

  setUserId(userId: string) {
    this.apiUrl = `http://localhost:3000/api/${userId}/checkbox-state`;
  }
}
