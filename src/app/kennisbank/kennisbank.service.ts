import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {baseUrl} from '../base-api.service';
import {IKennisbankItem} from './IKennisbank';


@Injectable({
    providedIn: 'root'
})

export class KennisbankService {

    constructor(private http: HttpClient) {
    }

    search(keyword: string): Observable<IKennisbankItem[]> {
        return this.http.get<IKennisbankItem[]>(baseUrl + 'search/' + keyword);
    }
}
