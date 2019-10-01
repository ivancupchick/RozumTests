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

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    SignUpComponent,
    TestsComponent,
    NewUsersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    FormsModule,
    ModalModule
  ],
  providers: [
    AuthService,
    ModalService,
    UsersService,
    TasksService,
    TestsService
  ],
  entryComponents: [
    LoginComponent,
    SignUpComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
