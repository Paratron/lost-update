import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckboxGroupComponent } from './checkbox-group/checkbox-group.component';

const routes: Routes = [
  { path: '', redirectTo: '/checkboxes/defaultUserId', pathMatch: 'full' }, // Default route
  { path: 'checkboxes/:userId', component: CheckboxGroupComponent }, // Route with userId
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
