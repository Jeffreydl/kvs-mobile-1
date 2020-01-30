import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {baseUrl} from '../base-api.service';
import {IKennisbankItem, IKennisbankItemChildren, IKennisbankSearchItem} from './IKennisbank';
import {map} from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})

export class KennisbankService {

    constructor(private http: HttpClient) {}

    public getAll(): Observable<IKennisbankItem[]> {
        return this.http.get<IKennisbankItem[]>(baseUrl + 'api/Nodes/nodes/getNodes/nl/0/1').pipe(
            map((data: any) => data.items)
        );
    }

    public getById(id: string): Observable<IKennisbankItemChildren[]> {
        return this.http.get<IKennisbankItemChildren[]>(baseUrl + 'api/Nodes/nodes/getNodes/nl/' + id + '/0').pipe(
            map((data: any) => data.items)
        );
    }

    public getByWebsiteId(id: string): Observable<IKennisbankItemChildren> {
        return this.http.get<IKennisbankItemChildren>(baseUrl + 'api/Nodes/nodes/getNode/nl/' + id).pipe(
            map((data: any) => data.items)
        );
    }

    public search(keyword: string): Observable<IKennisbankSearchItem[]> {
        return this.http.get<IKennisbankSearchItem[]>(baseUrl + 'search/' + keyword).pipe(
           map((data: any) => data.KbaseItems)
        );
    }
}
