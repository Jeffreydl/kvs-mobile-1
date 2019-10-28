import { Component, OnInit } from '@angular/core';
import { TasksService } from '../tasks.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit {
  public categories$: Observable<any>;
  public contactReasons$: Observable<any>;
  public dossierCategories$: Observable<any>;
  public messageChannels$: Observable<any>;
  public types$: Observable<any>;

  constructor(private taskService: TasksService) { }

  ngOnInit() {
    this.categories$ = this.taskService.getCategories();
    this.contactReasons$ = this.taskService.getContactReasons();
    this.dossierCategories$ = this.taskService.getDossierCategories();
    this.messageChannels$ = this.taskService.getMessageChannels();
    this.types$ = this.taskService.getTypes();

  }

  addTask() {
  }

}
