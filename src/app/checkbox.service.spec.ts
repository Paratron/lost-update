import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { CheckboxService } from './checkbox.service';

describe('CheckboxService', () => {
  let service: CheckboxService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
    service = TestBed.inject(CheckboxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
