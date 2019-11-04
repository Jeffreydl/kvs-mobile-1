import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {baseUrl} from '../base-api.service';
import {IKennisbankItems, IkennisbankItemsChildren, IKennisbankSearchItem} from './IKennisbank';
import {map} from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})

export class KennisbankService {

    constructor(private http: HttpClient) {
    }

    getAll(): Observable<IKennisbankItems[]> {
        return this.http.get<IKennisbankItems[]>(baseUrl + 'api/Nodes/nodes/getNodes/nl/0/1').pipe(
            map((data: any) => data.items)
        );
    }

    getById(id: string): Observable<IkennisbankItemsChildren[]> {
        return this.http.get<IkennisbankItemsChildren[]>(baseUrl + 'api/Nodes/nodes/getNodes/nl/' + id + '/0').pipe(
            map((data: any) => data.items)
        );
    }

    search(keyword: string): Observable<IKennisbankSearchItem[]> {
        return this.http.get<IKennisbankSearchItem[]>(baseUrl + 'search/' + keyword).pipe(
           map((data: any) => data.KbaseItems)
        );
    }
}