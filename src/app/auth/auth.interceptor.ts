import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Add Authorization token to every request

        const tokenCreationTime = Number(localStorage.getItem('tokenCreationTime'));
        const currentTime =  Number(new Date().getTime());
        const ttl = Number(localStorage.getItem('ttl')) * 1000;
        const loginToken = localStorage.getItem('loginToken');

        if (tokenCreationTime + ttl < currentTime) {
            this.authService.logOut();
        }
        const modifiedHeader = request.clone({setHeaders: {Authorization: loginToken}});
        // const modifiedHeader = request.clone({
        //     setHeaders: {
        //         'Content-Type': 'application/json',
        //         Accept: 'application/json',
        //         Authorization: 'dHQJyzAwz7F0j5aosoelLsHKa0WTR8dBbEHt1YJerWUKkHIxLDDpDlvvE40h0p3F'
        //     }
        // });
        return next.handle(modifiedHeader);
    }
}
