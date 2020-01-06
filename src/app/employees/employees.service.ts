import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {baseUrl} from '../base-api.service';
import {HttpClient} from '@angular/common/http';
import {IEmployee} from './IEmployee';
import {map} from 'rxjs/operators';

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

  public getAll(filter: EmployeeFilter): Observable<any[]> {

    return this.http.get<any[]>(baseUrl + 'api/Employees?filter=' + filter).pipe(
        map((employees) => {
          employees.map((employee) => {
            this.getFullName(employee);
          });
          return employees;
        })
    );
  }

  public getById(id: number): Observable<IEmployee> {
    return this.http.get<any>(baseUrl + 'api/Employees/' + id);
  }

  public getByToken(token: string): Observable<any> {
      return this.http.get<any>(baseUrl + 'api/Employees/get-user-by-token/' + token);
  }

  public getEmployeeCategories(id: number) {
      return this.http.get(baseUrl + 'api/Employees/' + id + '/categories');
      // after - get the ids of all categories and use them in the gettasks call to get correct tasks
}

  public getFullName(employee: IEmployee): IEmployee {
      if (employee.profile.middlename) {
          employee.profile.fullname = employee.profile.firstname + ' ' + employee.profile.middlename + ' ' + employee.profile.lastname;
          employee.filterByNameAndEmail = employee.profile.firstname + ' ' + employee.profile.middlename + ' ' + employee.profile.lastname + ' ' + employee.email;
      } else {
          employee.profile.fullname = employee.profile.firstname + ' ' + employee.profile.lastname;
          employee.filterByNameAndEmail = employee.profile.firstname + ' ' + employee.profile.lastname + ' ' + employee.email;
      }
      return employee;
  }
}

