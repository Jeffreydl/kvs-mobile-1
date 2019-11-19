import {BrowserModule, HAMMER_GESTURE_CONFIG, HammerGestureConfig} from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material-module/material.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AuthInterceptor } from './auth/auth.interceptor';
import { HttpErrorInterceptor } from './auth/http-error-interceptor';

import { OrderByPipe } from './order-by.pipe';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { KennisbankSearchbarComponent } from './kennisbank/kennisbank-searchbar/kennisbank-searchbar.component';
import { TasksComponent } from './tasks/tasks.component';
import { NavigationComponent } from './navigation/navigation.component';
import { KennisbankComponent } from './kennisbank/kennisbank.component';
import { AddTaskComponent } from './tasks/add-task/add-task.component';
import { SelectedClientComponent } from './customers/selected-client/selected-client.component';
import { ClientSearchbarComponent } from './customers/client-searchbar/client-searchbar.component';
import { ClientCardComponent } from './customers/client-card/client-card.component';
import { HousesComponent } from './houses/houses.component';
import { DossiersComponent } from './dossiers/dossiers.component';
import { ClientListComponent } from './customers/client-list/client-list.component';
import { SanitizeHtmlPipe } from './sanitize-html.pipe';
import { SanitizeUrlPipe } from './sanitize-url.pipe';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { HammerConfig} from './hammer-config/hammerConfig';
import {CurrentClientDialogComponent} from './customers/client-list/current-client-dialog/current-client-dialog.component';

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
    ClientCardComponent,
    HousesComponent,
    DossiersComponent,
    ClientListComponent,
    SanitizeHtmlPipe,
    SanitizeUrlPipe,
    CurrentClientDialogComponent,
  ],
  entryComponents: [CurrentClientDialogComponent],
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
