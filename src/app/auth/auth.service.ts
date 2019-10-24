import {Injectable} from '@angular/core';
import {HttpBackend, HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, Subscription, timer} from 'rxjs';

const authUrl = 'https://kvsapi-demo.hexia.io/api/Employees/secureLogin';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token: string;
  ttl: number;
  hasPermission = true;

  constructor(private http: HttpClient, handler: HttpBackend) {
    // Service is not intercepted so Authorization token does not get added
    this.http = new HttpClient(handler);
  }

  login(formData) {
    return this.http.post(authUrl, formData).subscribe(
        (data: any) => {
          this.token = data.accessToken.id;
          this.ttl = data.accessToken.ttl;
          this.hasPermission = true;
          this.tokenTtlTimer(this.token, this.ttl);
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
      if (this.ttl < 71970) {
        this.token = '';
        this.ttl = 0;
        this.hasPermission = true;
        console.log('Token ' + tempToken + ' is no longer valid.');
        abc.unsubscribe();
      }
    });
  }

  getToken() {
    return this.token;
  }
}

