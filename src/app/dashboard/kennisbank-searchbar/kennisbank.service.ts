import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {KennisbankItem, KennisbankItemServer} from './kennisbank.model';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

const baseUrl = 'https://kvsapi-demo.hexia.io/search/';

@Injectable({
    providedIn: 'root'
})

export class KennisbankService implements KennisbankItem {
    id: string;
    title: string;
    content: string;

    constructor(private http: HttpClient) {
    }

    search(keyword: string): Observable<any> {
        const url = baseUrl + keyword;
        return this.http.get(url).pipe(
            map((data: KennisbankItemServer) => data.KbaseItems)
        );
    }
}
