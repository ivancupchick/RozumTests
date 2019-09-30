import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TestsComponent } from './components/tests/tests.component';
import { NewUsersComponent } from './components/new-users/new-users.component';

const routes: Routes = [
  { path: '', redirectTo: 'quastions', pathMatch: 'full' },
  { path: 'tests', component: TestsComponent },
  { path: 'new-users', component: NewUsersComponent }
  // { path: 'profile/:id', component: ProfileComponent, canActivate: [AuthGuard] },
  // { path: 'quastion', component: CreatequastionComponent, canActivate: [AuthGuard] },
  // { path: 'quastion/:id', component: QuastionComponent },
  // { path: 'editquastion/:id', component: EditQuestionComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
