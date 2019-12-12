import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {TasksService} from '../tasks.service';

@AutoUnsubscribe()
@Component({
  selector: 'app-task-creation-step-three',
  templateUrl: './task-creation-step-three.component.html',
  styleUrls: ['./task-creation-step-three.component.scss']
})
export class TaskCreationStepThreeComponent implements OnInit, OnDestroy {
  public formStepThree: FormGroup;
  public category = '';
  public taskSubject = '';
  // public categories: any;

  currentTask: any;
  public get task(): any {
    return this.currentTask;
  }
  @Input()
  public set task(val: any) {
    this.currentTask = val;
    console.log(this.currentTask);
    this.createAssigneeForm();
  }

  __action: string;
  public get action(): string {
    return this.__action;
  }
  @Input()
  public set action(val: string) {
    this.__action = val;
  }

  categories: any;
  public get categoriesList(): any {
    return this.categories;
  }
  @Input()
  public set categoriesList(val: any) {
    this.categories = val;
  }

  constructor(private formBuilder: FormBuilder, private tasksService: TasksService) { }

  ngOnInit() {
    console.log(this.currentTask);
    // this.tasksService.getCategories().subscribe((data) => {
    //   this.categories = data;
    // });
  }

  ngOnDestroy(): void {
  }

  public createAssigneeForm() {
    if (this.currentTask) {

      this.formStepThree = this.formBuilder.group({
        category: this.formBuilder.control(this.task.messageCategoryId, Validators.compose([Validators.required])),
        subject: this.formBuilder.control(this.task.subject, Validators.compose([Validators.required])),
        description: this.formBuilder.control('', Validators.compose([Validators.required])),
      });
      this.formStepThree.valueChanges.subscribe(data => this.onFormValueChange2(data));
    }
  }

  private onFormValueChange2(data: any) {
    this.category = data.category.name;
    this.taskSubject = data.subject;
  }

  onSubmit2(formData: any) {
    console.log(formData);
    this.tasksService.edit(this.currentTask.id, formData).subscribe(
        (task) => {
          console.log(task);
        }
    );
    // this.createDossierForm();
    // this.getOpenDossiers();
  }

}
