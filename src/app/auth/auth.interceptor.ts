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
        const modifiedHeader = request.clone({setHeaders: {'Content-Type': 'application/json', Accept: 'application/json', Authorization: 'YERiwD8mSM2xcqoZhLiRrSjgVm1JydMlsMnvJRDviBFFh7nG4I3AtNlnQzOcgVkk'}});

        return next.handle(modifiedHeader);
    }
}
