import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import {timer} from 'rxjs';

const authUrl = 'https://kvsapi-demo.hexia.io/api/Employees/secureLogin';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiKey: string;
  ttlTimeLeft: number;
  hasPermission = false;
  httpOptions;

  constructor(private http: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json', Accept: 'application/json'})
   };
  }

  login(formData) {
    return this.http.post(authUrl, formData, this.httpOptions).subscribe(
        (data: any) => {
          const ttl = data.accessToken.ttl;
          const tokenId = data.accessToken.id;
          this.hasPermission = true;
          this.tokenTtlTimer(ttl, tokenId);
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            console.log('Client-side error occured.');
          } else {
            console.log('Server-side error occured.');
          }
        }
    );
  }

  // Starts the countdown of the token and unsubscribes when it reaches 0
  tokenTtlTimer(ttl, tokenId) {
    const source = timer(1000, 1000);
    const abc = source.subscribe(val => {
      this.ttlTimeLeft = ttl - val;
      this.apiKey = tokenId;
      console.log(this.apiKey + ' expires in: ' + this.ttlTimeLeft);

      if (this.ttlTimeLeft < 71900) {
        this.apiKey = '';
        this.ttlTimeLeft = 0;
        this.hasPermission = false;
        console.log('token no longer valid');
        abc.unsubscribe();
      }
    });
  }

  getToken() {
    return this.apiKey;
  }
}

