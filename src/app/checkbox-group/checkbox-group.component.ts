import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CheckboxState } from '../checkbox-state.model';
import { CheckboxService } from '../checkbox.service';
import { ErrorReportingService } from '../error-reporting.service';

@Component({
  selector: 'app-checkbox-group',
  standalone: true,
  templateUrl: './checkbox-group.component.html',
  styleUrls: ['./checkbox-group.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxGroupComponent implements OnInit {
  readonly checkboxes = [
    { name: 'checkbox1', label: 'To Be or Not to Be' },
    { name: 'checkbox2', label: 'Something is Rotten in the State of Denmark' },
    { name: 'checkbox3', label: 'A Horse! A Horse! My Kingdom for a Horse!' },
    { name: 'checkbox4', label: 'Double, Double, Toil and Trouble' },
  ] as const;

  readonly checkboxState = signal<CheckboxState>({
    checkbox1: false,
    checkbox2: false,
    checkbox3: false,
    checkbox4: false,
  });
  private userId = 'defaultUserId';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly checkboxService: CheckboxService,
    private readonly errorReporting: ErrorReportingService,
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId') ?? 'defaultUserId';

    this.checkboxService.getState(this.userId).subscribe({
      next: state => {
        this.checkboxState.set({
          ...this.checkboxState(),
          ...state,
        });
      },
      error: error => {
        this.errorReporting.report('Failed to load initial state', error);
      },
    });
  }

  toggle(name: keyof CheckboxState): void {
    this.checkboxState.update(state => ({
      ...state,
      [name]: !state[name],
    }));

    this.checkboxService.sendState(this.userId, this.checkboxState()).subscribe({
      error: error => {
        this.errorReporting.report('Failed to save state', error);
      },
    });
  }
}
