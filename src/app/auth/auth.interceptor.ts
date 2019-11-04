import { Injectable} from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // Add Authorization token to every request
        // const modifiedHeader = request.clone({setHeaders: {Authorization: this.authService.getToken()}});
        const modifiedHeader = request.clone({setHeaders: {'Content-Type': 'application/json', Accept: 'application/json', Authorization: 'Vsi2P2P0dGxtqEWgBY9zCfrbMAn4TYxm8F5QSOus1GkoGHOUb2SR3i5Tm1Nzr28d'}});

        return next.handle(modifiedHeader);
    }
}
