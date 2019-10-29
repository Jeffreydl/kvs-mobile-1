import { Component, OnInit } from '@angular/core';
import { TasksService } from '../tasks.service';
import {FormControl} from '@angular/forms';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {CustomersService} from '../../customers/customers.service';


@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent implements OnInit {
  public categories: object;
  public contactReasons: object;
  public dossierCategories: object;
  public messageChannels: object;
  public types: object;

  public customerDetails;
  autoCompleteFormControl = new FormControl();
  public age: number;

  constructor(private taskService: TasksService, private customersService: CustomersService) { }

  ngOnInit() {
    this.taskService.getCategories().subscribe((data) => { this.categories = data; });
    this.taskService.getContactReasons().subscribe((data) => { this.contactReasons = data; });
    this.taskService.getDossierCategories().subscribe((data) => { this.dossierCategories = data; });
    this.taskService.getMessageChannels().subscribe( (data) => { this.messageChannels = data; });
    this.taskService.getTypes().subscribe((data) => { this.types = data; });

    this.autoCompleteFormControl.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged()
    ).subscribe((value) => {
      this.searchCustomers(value);
    });
  }

  searchCustomers(value: string) {
    if (value.length > 0) {
      this.customersService.search(value).subscribe(
          (data) => {
            this.customerDetails = data;
            console.log(this.customerDetails);
            for (const i of data) {
              this.getAge(i.dateofbirth);
              // console.log(i);
            }
          }
      );
    } else {
      this.customerDetails = null;
    }
  }

  // getAge(birthDate: string) {
  //   const doei = new Date(birthDate);
  //   const hi = new Date();
  //   this.years = hi.getTime() - doei.getTime();
  //   console.log(this.years);
  // }

   getAge(value: string) {
    const today = new Date();
    const birthDate = new Date(value);
    let age = today.getFullYear() - birthDate.getFullYear();
    const months = today.getMonth() - birthDate.getMonth();
    if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    this.age = age;
  }

  addTask() {
  }

}
