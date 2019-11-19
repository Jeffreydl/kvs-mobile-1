import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree} from '@angular/router';
import {AuthService} from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

    constructor(private router: Router, private authService: AuthService) {}

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
        if (!this.authService.hasPermission) {
            alert('You are not allowed to view this page. You are redirected to the login Page');
            this.router.navigate(['login']);
            return false;
        }
        return true;
    }
}
