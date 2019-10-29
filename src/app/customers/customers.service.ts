import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {baseUrl} from '../base-api.service';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  constructor(private http: HttpClient) { }

  search(keyword: string): Observable<any> {
    return this.http.get(baseUrl + 'search/' + keyword).pipe(
        map((data: any) => data.Relations)
    );
  }
}
