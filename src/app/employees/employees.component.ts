import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {EmployeeFilter, EmployeesService} from './employees.service';
import {IEmployee} from './IEmployee';
import {FormControl} from '@angular/forms';
import {debounceTime, distinctUntilChanged, map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {
    public employees: IEmployee[];
    public myControl = new FormControl();
    public filteredEmployees: Observable<IEmployee[]>;
    @Output() public employeeId = new EventEmitter<IEmployee>();
    public selectedEmployee = '';

  constructor(private employeesService: EmployeesService) { }

  ngOnInit() {
    this.getEmployees();
  }

    private filter(value: string): IEmployee[] {
        const filterValue = value.toLowerCase();
        console.log(filterValue);

        console.log(this.employees.filter(option => option.filterByNameAndEmail.toLowerCase().includes(filterValue)));
        return this.employees.filter(option => option.filterByNameAndEmail.toLowerCase().includes(filterValue));
    }

    // public filterEmployees(value: string) {
    //     const regex = new RegExp(value, 'i');
    //     this.filteredEmployees = this.employees.filter(({filterByNameAndEmail}) => regex.test(filterByNameAndEmail));
    // }

    public getEmployees() {
        this.employeesService.getAll(new EmployeeFilter()
            .noSystemUser()
            .activeStatus()
        ).subscribe(
            (employees) => {
              this.employees = employees;
              this.filteredEmployees = this.myControl.valueChanges.pipe(
                  startWith(''),
                  map(value => this.filter(value))
              );
            }
        );
    }

    public selectEmployee(employee: IEmployee) {
        console.log(employee);
        this.employeeId.emit(employee);
    }
}
