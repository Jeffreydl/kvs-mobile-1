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
  public hasPermission = true;
  public sessionExpiredMessage: string;

  constructor(private http: HttpClient, handler: HttpBackend, private router: Router) {
    // Service is not intercepted so Authorization token does not get added
    this.http = new HttpClient(handler);
  }

  login(formData) {
    return this.http.post(baseUrl + 'api/Employees/securelogin', formData).subscribe(
        (data: any) => {
          this.token = data.accessToken.id;
          this.ttl = data.accessToken.ttl;
          this.hasPermission = true;
          this.tokenTtlTimer(this.token, this.ttl);
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
  tokenTtlTimer(tempToken, tempTtl) {
    const source$: Observable <number> = timer(1000, 1000);
    const abc: Subscription = source$.subscribe(val => {
      this.ttl = tempTtl - val;
      if (this.ttl % 10 === 0) {
        console.log(tempToken + ' expires in: ' + this.ttl);
      }
      if (this.ttl < 71980) {
        this.token = '';
        this.ttl = 0;
        this.hasPermission = false;
        console.log('Token ' + tempToken + ' is no longer valid.');
        this.router.navigate(['login']);
        this.sessionExpiredMessage = 'Session expired';
        abc.unsubscribe();
      }
    });
  }

  getToken() {
    return this.token;
  }

  isLoggedIn() {
    return this.hasPermission;
  }

  getSessionExpiredMessage() {
    return this.sessionExpiredMessage;
  }
}

