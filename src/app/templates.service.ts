import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ICustomer} from './customers/ICustomer';
import {baseUrl} from './base-api.service';
import {Observable} from 'rxjs';
import {ITemplate} from './ITemplate';

@Injectable({
  providedIn: 'root'
})
export class TemplatesService {

  constructor(private http: HttpClient) { }

    public postById(relatie: ICustomer, employee: any): Observable<ITemplate> {
    const data = {id: 7, replacement: {employee, relatie}};
    return this.http.post<ITemplate>(baseUrl + 'api/Templates/getById/7', data);
  }



}
