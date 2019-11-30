import { Component, OnInit } from '@angular/core';
import {EmployeeFilter, EmployeesService} from './employees.service';
import {IEmployee} from './IEmployee';
import {FormControl} from '@angular/forms';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {
    public employees: IEmployee[];
    public autoCompleteFormControl = new FormControl();
    public filteredEmployees: IEmployee[];

  constructor(private employeesService: EmployeesService) { }

  ngOnInit() {
    this.getEmployees();
    this.filteredEmployees = this.employees;
    this.autoCompleteFormControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((value) => {
      this.filterEmployees(value);
    });
  }

    public filterEmployees(value: string) {
        const regex = new RegExp(value, 'i');
        this.filteredEmployees = this.employees.filter(({filterByNameAndEmail}) => regex.test(filterByNameAndEmail));
    }

    public getEmployees() {
        this.employeesService.getAll(new EmployeeFilter()
            .noSystemUser()
            .activeStatus()
        ).subscribe(
            (employees) => {
              this.employees = employees;

            }
        );
    }
}
