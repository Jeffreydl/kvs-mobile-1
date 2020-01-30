import {BrowserModule, HAMMER_GESTURE_CONFIG} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from './material-module/material.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {AuthInterceptor} from './auth/auth.interceptor';
import {HttpErrorInterceptor} from './auth/http-error-interceptor';

import {OrderByPipe} from './order-by.pipe';

import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {KennisbankSearchbarComponent} from './kennisbank/kennisbank-searchbar/kennisbank-searchbar.component';
import {TasksComponent} from './tasks/tasks.component';
import {NavigationComponent} from './navigation/navigation.component';
import {KennisbankComponent} from './kennisbank/kennisbank.component';
import {AddTaskComponent} from './tasks/add-task/add-task.component';
import {ClientSearchbarComponent} from './customers/client-searchbar/client-searchbar.component';
import {ClientListComponent} from './customers/client-list/client-list.component';
import {SanitizeHtmlPipe} from './sanitize-html.pipe';
import {SanitizeUrlPipe} from './sanitize-url.pipe';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';

import {HammerConfig} from './hammer-config/hammerConfig';
import {CurrentClientDialogComponent} from './customers/client-list/current-client-dialog/current-client-dialog.component';
import {AddClientDialogComponent} from './customers/add-client-dialog/add-client-dialog.component';
import {CurrentTaskDialogComponent} from './tasks/current-task-dialog/current-task-dialog.component';
import {EmployeesComponent} from './employees/employees.component';
import {TaskCreationStepOneComponent} from './tasks/task-creation-step-one/task-creation-step-one.component';
import {TaskCreationStepTwoComponent} from './tasks/task-creation-step-two/task-creation-step-two.component';
import {TaskCreationStepThreeComponent} from './tasks/task-creation-step-three/task-creation-step-three.component';
import {HeaderComponent} from './header/header.component';
import {ProfileComponent} from './employees/profile/profile.component';
import {TasksSearchbarComponent} from './tasks/tasks-searchbar/tasks-searchbar.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    KennisbankSearchbarComponent,
    TasksComponent,
    NavigationComponent,
    KennisbankComponent,
    AddTaskComponent,
    OrderByPipe,
    ClientSearchbarComponent,
    ClientListComponent,
    SanitizeHtmlPipe,
    SanitizeUrlPipe,
    CurrentClientDialogComponent,
    AddClientDialogComponent,
    CurrentTaskDialogComponent,
    EmployeesComponent,
    TaskCreationStepOneComponent,
    TaskCreationStepTwoComponent,
    TaskCreationStepThreeComponent,
    HeaderComponent,
    ProfileComponent,
    TasksSearchbarComponent,
  ],
  entryComponents: [CurrentClientDialogComponent, AddClientDialogComponent, CurrentTaskDialogComponent, ProfileComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    },
     { provide: HAMMER_GESTURE_CONFIG,
      useClass: HammerConfig
     }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
