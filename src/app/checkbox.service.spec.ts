import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { CheckboxService } from './checkbox.service';
import { CheckboxState } from './checkbox-state.model';

describe('CheckboxService', () => {
  let service: CheckboxService;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    http = TestBed.inject(HttpClient);
    service = TestBed.inject(CheckboxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('builds request URLs from the provided userId', () => {
    const state: CheckboxState = {
      checkbox1: true,
      checkbox2: false,
      checkbox3: true,
      checkbox4: false,
    };

    const getSpy = jest.spyOn(http, 'get').mockReturnValue(of(state));
    const postSpy = jest.spyOn(http, 'post').mockReturnValue(of({}));

    service.getState('hamlet').subscribe();
    service.sendState('ophelia', state).subscribe();

    expect(getSpy).toHaveBeenCalledWith('http://localhost:3000/api/hamlet/checkbox-state');
    expect(postSpy).toHaveBeenCalledWith(
      'http://localhost:3000/api/ophelia/checkbox-state',
      state,
    );
  });
});
