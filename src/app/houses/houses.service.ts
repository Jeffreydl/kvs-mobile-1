import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {baseUrl} from '../base-api.service';

@Injectable({
    providedIn: 'root'
})
export class HousesService {

    constructor(private http: HttpClient) {
    }

    getHouses(id: number): Observable<any> {
        return this.http.get<any>(baseUrl + 'api/relaties/kspdata/' + id);
    }
}

