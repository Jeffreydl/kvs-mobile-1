import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

const authUrl = 'https://kvsapi-demo.hexia.io/api/Employees/secureLogin';
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json', Accept: 'application/json'})
};


@Injectable({
  providedIn: 'root'
})
export class LoginAPIService {
  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
  }

  login(formData) {
    return this.http.post(authUrl, formData, httpOptions);
  }
}
