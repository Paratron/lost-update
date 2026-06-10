import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CheckboxState } from '../checkbox-state.model';
import { CheckboxService } from '../checkbox.service';
import { ActivatedRoute } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-checkbox-group',
  templateUrl: './checkbox-group.component.html',
  styleUrls: ['./checkbox-group.component.css'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' })),
      ]),
    ]),
  ],
})
export class CheckboxGroupComponent implements OnInit {
  checkboxForm!: FormGroup;
  errorMessage: string | null = null;
  private errorTimeout: any;

  checkboxes = [
    { name: 'checkbox1', label: 'To Be or Not to Be' },
    { name: 'checkbox2', label: 'Something is Rotten in the State of Denmark' },
    { name: 'checkbox3', label: 'A Horse! A Horse! My Kingdom for a Horse!' },
    { name: 'checkbox4', label: 'Double, Double, Toil and Trouble' },
  ];

  constructor(
    private fb: FormBuilder,
    private checkboxService: CheckboxService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.checkboxForm = this.fb.group({
      ...this.checkboxes.reduce((acc: { [key: string]: boolean[] }, checkbox) => {
        acc[checkbox.name] = [false];
        return acc;
      }, {}),
    });

    // Immediately handle form changes
    this.checkboxForm.valueChanges.subscribe(formValue => {
      const state = this.extractCheckboxState(formValue);
      this.sendState(state);
    });

    // Get the userId from the URL and initialize the service URL
    this.route.paramMap.subscribe(params => {
      const userId = params.get('userId') || 'defaultUserId';
      this.checkboxService.setUserId(userId);
      // Load initial state after userId is set
      this.loadInitialState();
    });
  }

  private extractCheckboxState(formValue: any): CheckboxState {
    const state: CheckboxState = {};
    for (const checkbox of this.checkboxes) {
      state[checkbox.name] = formValue[checkbox.name];
    }
    return state;
  }

  private sendState(state: CheckboxState) {
    this.checkboxService.sendState(state).subscribe({
      next: response => {
        console.log('Save completed successfully', response);
      },
      error: error => {
        console.error('Failed to save state synchronously', error);
        this.showError('Failed to save state: ' + (error.message || 'Unknown error'));
      },
    });
  }

  private loadInitialState() {
    this.checkboxService.getState().subscribe({
      next: (state: CheckboxState) => {
        console.log('Loaded initial state from backend:', state);
        this.checkboxForm.patchValue(state, { emitEvent: false }); // Don't trigger save on load
        this.cdr.markForCheck();
      },
      error: error => {
        if (error.status === 404) {
          // 404 is normal - state doesn't exist yet, start with empty form
          console.log('No saved state found (404) - starting with empty form');
        } else {
          console.error('Failed to load initial checkbox state', error);
          this.showError('Failed to load initial state: ' + (error.message || 'Unknown error'));
        }
      },
    });
  }

  private showError(message: string) {
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
    }

    this.errorMessage = message;
    this.cdr.markForCheck();

    this.errorTimeout = setTimeout(() => {
      this.errorMessage = null;
      this.cdr.markForCheck();
    }, 5000);
  }
}
