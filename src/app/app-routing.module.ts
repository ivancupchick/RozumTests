import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TestsComponent } from './components/tests/tests.component';
import { NewUsersComponent } from './components/new-users/new-users.component';
import { CreateTestComponent } from './components/create-test/create-test.component';
import { TakeTheTestComponent } from './components/take-the-test/take-the-test.component';
import { UsersComponent } from './components/users/users.component';
import { SubjectsComponent } from './components/subjects/subjects.component';
import { NewSubjectComponent } from './components/new-subject/new-subject.component';

const routes: Routes = [{
    path: '',
    redirectTo: 'quastions',
    pathMatch: 'full'
  }, {
    path: 'tests',
    component: TestsComponent
  }, {
    path: 'new-users',
    component: NewUsersComponent
  }, {
    path: 'new-test',
    component: CreateTestComponent
  }, {
    path: 'take-the-test',
    component: TakeTheTestComponent
  }, {
    path: 'users',
    component: UsersComponent
  }, {
    path: 'subjects',
    component: SubjectsComponent
  }, {
    path: 'new-subject',
    component: NewSubjectComponent
  }

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
