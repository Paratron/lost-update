import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { CheckboxGroupComponent } from './checkbox-group.component';
import { CheckboxService } from '../checkbox.service';
import { ErrorReportingService } from '../error-reporting.service';

describe('CheckboxGroupComponent', () => {
  let component: CheckboxGroupComponent;
  let fixture: ComponentFixture<CheckboxGroupComponent>;
  let checkboxService: {
    getState: jest.Mock;
    sendState: jest.Mock;
  };
  let errorReporting: {
    report: jest.Mock;
  };

  beforeEach(async () => {
    checkboxService = {
      getState: jest.fn().mockReturnValue(
        of({
          checkbox1: false,
          checkbox2: false,
          checkbox3: false,
          checkbox4: false,
        }),
      ),
      sendState: jest.fn().mockReturnValue(of({})),
    };
    errorReporting = {
      report: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [CheckboxGroupComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: CheckboxService, useValue: checkboxService },
        { provide: ErrorReportingService, useValue: errorReporting },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ userId: 'hamlet' }),
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckboxGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders the default checkbox signal state', () => {
    const checkboxes = Array.from(
      fixture.nativeElement.querySelectorAll(
        'input.quote-checkbox',
      ) as NodeListOf<HTMLInputElement>,
    );

    expect(checkboxService.getState).toHaveBeenCalledWith('hamlet');
    expect(checkboxes).toHaveLength(4);
    expect(checkboxes.every(checkbox => !checkbox.checked)).toBe(true);
  });
});
