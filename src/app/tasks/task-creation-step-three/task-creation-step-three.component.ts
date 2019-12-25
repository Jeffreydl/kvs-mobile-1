import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {TasksService} from '../tasks.service';
import {TemplatesService} from '../../templates.service';
import {ITask} from '../ITask';

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

    templateValue: any;
    public get template(): any {
      console.log(this.templateValue);
      return this.templateValue;
    }
    @Input()
    public set template(val: any) {
        this.templateValue = val;
    }

    processWorkflow: any;
    public get workflow(): any {
        console.log(this.templateValue);
        return this.templateValue;
    }
    @Input()
    public set workflow(val: any) {
        this.processWorkflow = val;
    }

    public emailIsChecked = true;
    public closeDossierIsChecked = true;

  constructor(private formBuilder: FormBuilder, private tasksService: TasksService) { }

  ngOnInit() {
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
    this.tasksService.edit(this.currentTask.id, formData).subscribe(
        (task) => {
        }
    );
    // this.createDossierForm();
    // this.getOpenDossiers();
  }

  test() {
    console.log(this.processWorkflow);
  }

}
