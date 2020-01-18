import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {LoginComponent} from './login/login.component';
import {DashboardComponent} from './dashboard/dashboard.component';

import {AuthGuardService} from './auth/auth-guard.service';
import {KennisbankComponent} from './kennisbank/kennisbank.component';
import {AddTaskComponent} from './tasks/add-task/add-task.component';
import {ClientListComponent} from './customers/client-list/client-list.component';

const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService]},
    {path: 'kennisbank', component: KennisbankComponent, canActivate: [AuthGuardService]},
    {path: 'taak-aanmaken', component: AddTaskComponent, canActivate: [AuthGuardService]},
    {path: 'klanten', component: ClientListComponent, canActivate: [AuthGuardService]},
    {path: '', pathMatch: 'full', redirectTo: 'login'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
