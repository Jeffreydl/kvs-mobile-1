import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Adds Authorization token to every request
        if (this.authService.checkPermission()) {
            const loginToken = this.authService.getToken();
            const modifiedHeader = request.clone({setHeaders: {Authorization: loginToken}});
            return next.handle(modifiedHeader);
        }
    }
}
