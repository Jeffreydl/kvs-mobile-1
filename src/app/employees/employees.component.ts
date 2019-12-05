import {Component, Input, OnInit} from '@angular/core';
import {EmployeeFilter, EmployeesService} from './employees.service';
import {IEmployee} from './IEmployee';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
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
    @Input() formStepThree: FormGroup;
    public selectedEmployee = '';

  constructor(private employeesService: EmployeesService) { }

  ngOnInit() {
    this.getEmployees();

    this.formStepThree.addControl('assigneeId', new FormControl(Validators.compose([Validators.required])));
  }

    private filter(value: string): IEmployee[] {
        const filterValue = value.toLowerCase();
        console.log(filterValue);

        console.log(this.employees.filter(option => option.filterByNameAndEmail.toLowerCase().includes(filterValue)));
        return this.employees.filter(option => option.filterByNameAndEmail.toLowerCase().includes(filterValue));
    }

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
        this.formStepThree.controls.assigneeId.setValue(employee.id);
    }
}
