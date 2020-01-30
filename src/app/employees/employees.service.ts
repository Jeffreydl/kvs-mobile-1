import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {baseUrl} from '../base-api.service';
import {HttpClient} from '@angular/common/http';
import {IEmployee, IEmployeeCategory} from './IEmployee';
import {map} from 'rxjs/operators';

export class EmployeeFilter {
    private status: string;
    private isSystemUser: boolean;
    private id;

    public activeStatus() {
        this.status = 'active';
        return this;
    }

    public noSystemUser() {
        this.isSystemUser = false;
        return this;
    }

    public forEmployee(id) {
        this.id = id;
        return this;
    }

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
        if (this.id) {
            filter.where.and.push({
                employeeId: this.id
            });
        }
        return JSON.stringify(filter);
    }
}

@Injectable({
    providedIn: 'root'
})
export class EmployeesService {

    public categoryIds: number[] = [];

    constructor(private http: HttpClient) {
    }

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

    public retrieveCategories(filter?: EmployeeFilter) {
        this.http.get(baseUrl + 'api/EmployeeCategories?filter=' + filter).subscribe((data: IEmployeeCategory[]) => {
            for (const i of data) {
                this.categoryIds.push(i.categoryId);
            }
        });
    }

    public getCategories(filter?: EmployeeFilter) {
        if (this.categoryIds.length === 0) {
            this.retrieveCategories(filter);
        }

        return this.categoryIds;
    }

    public getFullName(employee: IEmployee): IEmployee {
        const e = employee.profile;
        if (e.middlename) {
            e.fullname = e.firstname + ' ' + e.middlename + ' ' + e.lastname;
            employee.filterByNameAndEmail = e.firstname + ' ' + e.middlename + ' ' + e.lastname + ' ' + employee.email;
        } else {
            e.fullname = e.firstname + ' ' + e.lastname;
            employee.filterByNameAndEmail = e.firstname + ' ' + e.lastname + ' ' + employee.email;
        }
        return employee;
    }
}

