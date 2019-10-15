import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';

const url = 'https://kvsapi-demo.hexia.io/search/algemeen';


@Injectable({
  providedIn: 'root'
})
export class KennisbankService {
  httpOptions;
  token;
  results;

  constructor(private http: HttpClient, private loginAPIService: AuthService) {
    this.httpOptions = {
      headers: new HttpHeaders({Authorization: this.token})
    };
  }

  getKennisbankItems() {
    this.token = this.loginAPIService.getToken();
    console.log(this.token);
    this.http.get(url, this.httpOptions).subscribe(
        (data: any) => {
          console.log(data.KbaseItems[0].content);
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
}
