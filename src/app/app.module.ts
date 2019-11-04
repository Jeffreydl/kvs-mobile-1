import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material-module/material.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth.interceptor';
import { HttpErrorInterceptor } from './auth/http-error-interceptor';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { KennisbankSearchbarComponent } from './kennisbank/kennisbank-searchbar/kennisbank-searchbar.component';
import { TasksComponent } from './tasks/tasks.component';
import { NavigationComponent } from './navigation/navigation.component';
import { KennisbankComponent } from './kennisbank/kennisbank.component';
import { AddTaskComponent } from './tasks/add-task/add-task.component';
import { OrderByPipe } from './order-by.pipe';
import { SelectedClientComponent } from './customers/selected-client/selected-client.component';
import { ClientSearchbarComponent } from './customers/client-searchbar/client-searchbar.component';

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
    SelectedClientComponent,
    ClientSearchbarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule
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
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
