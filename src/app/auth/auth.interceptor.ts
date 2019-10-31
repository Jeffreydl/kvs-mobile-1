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
        const modifiedHeader = request.clone({setHeaders: {'Content-Type': 'application/json', Accept: 'application/json', Authorization: 'IFjVOAziQSY98kKGCfyQGnnnR7dN7ZpwlFBDVjmCyGREi2z1pupJpwRTDHXV2ndb'}});

        return next.handle(modifiedHeader);
    }
}
