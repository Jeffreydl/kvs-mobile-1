import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {baseUrl} from './base-api.service';
import {HttpClient} from '@angular/common/http';


export class EmployeeFilter {
  private status: string;
  private isSystemUser: boolean;

  public activeStatus() {
    this.status = 'active';
    return this;
  }
  public noSystemUser() {
    this.isSystemUser = false;
    return this;
  }

  // [where][and][0][status]=active&filter[where][and][1][isSystemUser]=false'

  public toString(): string {
    const filter = {
      where: {
        and: []
      },

    };

    if (this.status) {
      filter.where.and.push({
        status: this.status
      });
    }
    if (!this.isSystemUser) {
      filter.where.and.push({
        isSystemUser: this.isSystemUser
      });
    }
    return JSON.stringify(filter);
  }
}

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  constructor(private http: HttpClient) { }

  public getAll(filter: EmployeeFilter) {
    // [where][and][0][status]=active&filter[where][and][1][isSystemUser]=false'
    return this.http.get(baseUrl + 'api/Employees?filter=' + filter);
  }

  public getById(id: number): Observable<any> {
    console.log(id);
    return this.http.get<any>(baseUrl + 'api/Employees/' + id);
  }
}

