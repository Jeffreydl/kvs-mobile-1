import {Injectable} from '@angular/core';
import {baseUrl} from '../base-api.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TaskFilter} from '../tasks/tasks.service';

export class DossierFilter {
  state: string;
  property: string;
  direction: string;
  relatieId: number;
  limit: number;

  public openDossiers() {
    this.state = 'open';
    return this;
  }

  public orderbySla() {
    this.property = 'slaDateTime';
    return this;
  }

  public orderbyEndDate() {
    this.property = 'endDate';
    return this;
  }

  public orderByCreationDate() {
    this.property = 'startDate';
    return this;
  }

  public closedDossiers() {
    this.state = 'closed';
    return this;
  }

  public descending() {
    this.direction = 'desc';
    return this;
  }

  public ascending() {
    this.direction = 'asc';
    return this;
  }

  public forRelation(relatieId: number) {
    this.relatieId = relatieId;
    return this;
  }

  public limitTo(limit: number) {
    this.limit = limit;
    return this;
  }

  public toString(): string {
    const filter = {
      where: {
        and: []
      },
      order: [],
      limit: this.limit
    };

    filter.where.and.push({or: []});
    if (this.limit == null) {
      this.limit = 50;
    }
    if (this.state) {
      filter.where.and.push({
        state: this.state
      });
    }
    if (this.relatieId) {
      filter.where.and.push({
        relatieId: this.relatieId
      });
    }
    if (this.property && this.direction) {
      filter.order.push(this.property + ' ' + this.direction);
    }
    return JSON.stringify(filter);
  }
}

const url = baseUrl + 'api/';

@Injectable({
  providedIn: 'root'
})
export class DossierService {
  constructor(private http: HttpClient) {}

  getAll(filter: DossierFilter): Observable<any> {
    return this.http.get(url + 'Dossiers?filter=' + filter);
  }

  //
  //
  // public getForRelatie(filter?: DossierFilter) {
  //   const url = ApiURL + 'api/Dossiers?filter=' + filter;
  //   const request = this.baseApiService.http.get<Dossier[]>(url, this.baseApiService.getHeaders());
  //   request.pipe(map(response => {
  //     const result = plainToClass(Dossier, response as object);
  //     Object.assign([], result);
  //   }));
  //   return request;
  // }
  //
  // public getAllDosierCategories() {
  //   const url = ApiURL + 'api/dossierCategories';
  //   return this.baseApiService.http.get<DossierCategory[]>(url, this.baseApiService.getHeaders());
  // }
  //
  // public createDossier(dossier) {
  //   const url = ApiURL + 'api/Dossiers';
  //   return this.baseApiService.http.post<Dossier>(url, dossier, this.baseApiService.getHeaders());
  // }

  // public closeDossier(dossierId) {
  //   const url = ApiURL + 'api/Dossiers/' + dossierId + '/close';
  //   return this.baseApiService.http.delete(url, this.baseApiService.getHeaders());
  // }
}
