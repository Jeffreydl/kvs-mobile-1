import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {baseUrl} from '../base-api.service';
import {map} from 'rxjs/operators';
import {ICustomer} from './ICustomer';

@Injectable({
    providedIn: 'root'
})
export class CustomersService {

    constructor(private http: HttpClient) {
    }

    search(keyword: string): Observable<ICustomer[]> {
        return this.http.get<ICustomer[]>(baseUrl + 'search/' + keyword).pipe(
            map((data: any) => data.Relations)
        );
    }

    getClient(id: number): Observable<ICustomer> {
        return this.http.get<ICustomer>(baseUrl + 'api/relaties/' + id);
    }
}
