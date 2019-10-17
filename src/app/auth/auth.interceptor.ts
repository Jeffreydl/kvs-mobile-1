import { Injectable} from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class I1 implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const modified = req.clone({setHeaders: {'Content-Type': 'application/json', Accept: 'application/json'}});

        return next.handle(modified);
    }
}

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const modified = req.clone({setHeaders: {Authorization: this.authService.getToken()}});
        // const modified = req.clone({setHeaders: {Authorization: 'SqylSwvoT5FUBWmH1dJLkyLy7pmigpXHcyUtnGk8uSWkxbLIc5N2CydEQFgWkU0z'}});

        return next.handle(modified);
    }
}
