import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {KennisbankItem, KennisbankItemServer} from './kennisbank.model';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {baseUrl} from '../base-api.service';


@Injectable({
    providedIn: 'root'
})

export class KennisbankService implements KennisbankItem {
    public id: string;
    public title: string;
    public content: string;

    constructor(private http: HttpClient) {
    }

    search(keyword: string): Observable<any> {
        return this.http.get(baseUrl + 'search/' + keyword).pipe(
            map((data: KennisbankItemServer) => data.KbaseItems)
        );
    }
}
