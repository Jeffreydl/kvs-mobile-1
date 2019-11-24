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
                // this.tokenTtlTimer(this.token, this.ttl);
                localStorage.setItem('loginToken', this.token);
                localStorage.setItem('ttl', this.ttl.toString());
                localStorage.setItem('tokenCreationTime', new Date().getTime().toString());
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

    // Starts the countdown of the token (20 hours) and limits site access when it reaches 0
    // public tokenTtlTimer(tempToken, tempTtl) {
    //     const source$: Observable<number> = timer(1000, 1000);
    //     const abc: Subscription = source$.subscribe(val => {
    //         this.ttl = tempTtl - val;
    //         if (this.ttl % 10 === 0) {
    //             console.log(tempToken + ' expires in: ' + this.ttl);
    //         }
    //         if (this.ttl < 0) {
    //             this.token = '';
    //             this.ttl = 0;
    //             this.hasPermission = false;
    //             localStorage.removeItem('loginToken');
    //             console.log('Token ' + tempToken + ' is no longer valid.');
    //             this.router.navigate(['login']);
    //             this.sessionExpiredMessage = 'Session expired';
    //             abc.unsubscribe();
    //         }
    //     });
    // }

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
        return this.userId;
    }

    public getSessionExpiredMessage() {
        return this.sessionExpiredMessage;
    }

    public getTokenTtl() {
        return this.ttl;
    }
}

