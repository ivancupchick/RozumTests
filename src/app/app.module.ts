import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { HeaderComponent } from './components/header/header.component';
import { AuthService } from './services/auth.service';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { LoginComponent } from './components/modals/login/login.component';
import { ModalModule } from './modal/modal.module';
import { ModalService } from './modal/modal.service';
import { SignUpComponent } from './components/modals/sign-up/sign-up.component';
import { TestsComponent } from './components/tests/tests.component';
import { NewUsersComponent } from './components/new-users/new-users.component';
import { UsersService } from './services/users.service';
import { TasksService } from './services/tasks.service';
import { TestsService } from './services/tests.service';
import { CreateTestComponent } from './components/create-test/create-test.component';
import { TestFormComponent } from './components/shared/test-form/test-form.component';
import { TakeTheTestComponent } from './components/take-the-test/take-the-test.component';
import { UsersComponent } from './components/users/users.component';
import { SubjectsComponent } from './components/subjects/subjects.component';
import { NewSubjectComponent } from './components/modals/new-subject/new-subject.component';
import { WindowModule } from './window/window.module';
import { WindowsService } from './services/windows.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    SignUpComponent,
    TestsComponent,
    NewUsersComponent,
    CreateTestComponent,
    TestFormComponent,
    TakeTheTestComponent,
    UsersComponent,
    SubjectsComponent,
    NewSubjectComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    FormsModule,
    ModalModule,
    WindowModule
  ],
  providers: [
    AuthService,
    ModalService,
    UsersService,
    TasksService,
    TestsService,
    WindowsService
  ],
  entryComponents: [
    LoginComponent,
    SignUpComponent,
    NewSubjectComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
