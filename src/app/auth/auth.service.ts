import {Injectable} from '@angular/core';
import {HttpBackend, HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {baseUrl} from '../base-api.service';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    public token: string;
    public ttl: number;
    public userId: string;
    public sessionExpiredMessage: string;
    public loggedIn = new BehaviorSubject<boolean>(false);
    public hasPermission = false;

    constructor(private http: HttpClient, handler: HttpBackend, private router: Router) {
        // Service is not intercepted due to HttpBackend so Authorization token does not get added
        this.http = new HttpClient(handler);
    }

    // Logs in with form data, redirects if succesful
    public login(formData: FormData) {
        return this.http.post(baseUrl + 'api/Employees/securelogin', formData).subscribe(
            (data: any) => {
                this.setToken(data.accessToken.id);
                localStorage.setItem('ttl', data.accessToken.ttl.toString());
                localStorage.setItem('tokenCreationTime', new Date().getTime().toString());
                this.setUserId(data.accessToken.userId);
                this.hasPermission = true;
                this.loggedIn.next(true);
                localStorage.setItem('hasPermission', JSON.stringify(this.loggedIn.value));
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

    public get isLoggedIn() {
        if (JSON.parse(localStorage.getItem('hasPermission'))) {
            this.loggedIn.next(true);
        }
        return this.loggedIn.asObservable();
    }

    public logOut() {
        this.sessionExpiredMessage = 'Session expired';
        this.hasPermission = false;
        this.loggedIn.next(false);
        localStorage.clear();
        this.router.navigate(['login']);
    }

    public getToken() {
        this.token = localStorage.getItem('loginToken');
        return this.token;
    }

    public setToken(token: string) {
        localStorage.setItem('loginToken', token);
        this.token = token;
    }

    public getUserId(): string {
        this.userId = localStorage.getItem('userId');
        return this.userId;
    }

    public setUserId(userId: string) {
        localStorage.setItem('userId', userId);
        this.userId = userId;
    }

    public getSessionExpiredMessage(): string {
        return this.sessionExpiredMessage;
    }

    public getTokenTtl(): number {
        this.ttl = Number(localStorage.getItem('ttl'));
        return this.ttl;
    }

    public checkPermission(): boolean {
        const tokenCreationTime = Number(localStorage.getItem('tokenCreationTime'));
        const currentTime =  Number(new Date().getTime());
        const ttl = Number(this.getTokenTtl()) * 1000;

        this.hasPermission = JSON.parse(localStorage.getItem('hasPermission'));

        if (tokenCreationTime + ttl < currentTime) {
            this.logOut();
        }
        return this.hasPermission;
    }
}

