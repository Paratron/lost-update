import { provideHttpClient } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, Routes } from '@angular/router';

import { AppComponent } from './app/app.component';
import { CheckboxGroupComponent } from './app/checkbox-group/checkbox-group.component';

const routes: Routes = [
  { path: '', redirectTo: '/checkboxes/defaultUserId', pathMatch: 'full' },
  { path: 'checkboxes/:userId', component: CheckboxGroupComponent },
];

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes), provideHttpClient(), provideAnimations()],
}).catch(err => console.error(err));
