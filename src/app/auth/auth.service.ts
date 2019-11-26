import {Injectable} from '@angular/core';
import {HttpBackend, HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, Subscription, timer} from 'rxjs';
import {Router} from '@angular/router';
import {baseUrl} from '../base-api.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    public token: string;
    public ttl: number;
    public userId: number;
    public hasPermission = false;
    public sessionExpiredMessage: string;

    constructor(private http: HttpClient, handler: HttpBackend, private router: Router) {
        // Service is not intercepted due to HttpBackend so Authorization token does not get added
        this.http = new HttpClient(handler);
    }

    // Logs in with form data, redirects if succesful
    public login(formData: FormData) {
        return this.http.post(baseUrl + 'api/Employees/securelogin', formData).subscribe(
            (data: any) => {
                this.token = data.accessToken.id;
                this.ttl = data.accessToken.ttl;
                this.userId = data.accessToken.userId;
                this.hasPermission = true;
                localStorage.setItem('loginToken', this.token);
                localStorage.setItem('ttl', this.ttl.toString());
                localStorage.setItem('tokenCreationTime', new Date().getTime().toString());
                localStorage.setItem('userId', this.userId.toString());
                this.router.navigate(['dashboard']);
            },
            (err: HttpErrorResponse) => {
                if (err.error instanceof Error) {
                    console.log('Client-side error occurred.');
                } else {
                    console.log('Server-side error occurred.');
                }
            }
        );
    }

    public logOut() {
        this.hasPermission = false;
        localStorage.removeItem('loginToken');
        localStorage.removeItem('tokenCreationTime');
        this.sessionExpiredMessage = 'Session expired';
        this.router.navigate(['login']);
    }

    public getToken() {
        return this.token;
    }

    public setToken(token: string) {
        this.token = token;
    }

    public getPermission() {
        return this.hasPermission;
    }
    public setPermission(value: boolean) {
        this.hasPermission = value;
    }

    public getUserId() {
        this.userId = Number(localStorage.getItem('userId'));
        return this.userId;
    }

    public getSessionExpiredMessage() {
        return this.sessionExpiredMessage;
    }

    public getTokenTtl() {
        return this.ttl;
    }
}

