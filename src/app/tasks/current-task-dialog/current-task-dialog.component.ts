import {ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {TasksService} from '../tasks.service';
import {FormBuilder} from '@angular/forms';
import {CustomersService} from '../../customers/customers.service';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {ICustomer} from '../../customers/ICustomer';
import {AuthService} from '../../auth/auth.service';
import {MatStepper} from '@angular/material';
import {DossierService} from '../../dossiers/dossier.service';
import {Router} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ICategory, ITask} from '../ITask';
import {TaskCreationStepOneComponent} from '../task-creation-step-one/task-creation-step-one.component';
import {TaskCreationStepTwoComponent} from '../task-creation-step-two/task-creation-step-two.component';
import {TaskCreationStepThreeComponent} from '../task-creation-step-three/task-creation-step-three.component';
import {IDossier} from '../../dossiers/IDossier';

@AutoUnsubscribe()
@Component({
  selector: 'app-current-task-dialog',
  templateUrl: './current-task-dialog.component.html',
  styleUrls: ['./current-task-dialog.component.scss']
})
export class CurrentTaskDialogComponent implements OnInit, OnDestroy {
  public currentTask: ITask;
    @ViewChild('stepper', {static: false}) stepper: MatStepper;
    public action: string;
    public task: ITask;

    @ViewChild(TaskCreationStepOneComponent, {static: false}) taskCreationStepOneComponent: TaskCreationStepOneComponent;
    @ViewChild(TaskCreationStepTwoComponent, {static: false}) taskCreationStepTwoComponent: TaskCreationStepTwoComponent;
    @ViewChild(TaskCreationStepThreeComponent, {static: false}) taskCreationStepThreeComponent: TaskCreationStepThreeComponent;
    public taskType: string;

    public template: object;
    public processWorkFlow: any;
    public isSaved: boolean;
    public categories: ICategory[];
    public dossier: IDossier;

  constructor(
      public dialogRef: MatDialogRef<CurrentTaskDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private taskService: TasksService,
      private customersService: CustomersService,
      private formBuilder: FormBuilder,
      private authService: AuthService,
      private dossiersService: DossierService,
      private router: Router,
      private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.currentTask = this.data.task;
    this.cdRef.detectChanges();
  }

  ngOnDestroy(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

    public get formStepTwo() {
        return this.taskCreationStepTwoComponent ? this.taskCreationStepTwoComponent.formStepTwo : null;
    }

    public get formStepThree() {
        return this.taskCreationStepThreeComponent ? this.taskCreationStepThreeComponent.formStepThree : null;
    }

    public getTask(task: ITask) {
        this.task = task;
    }

    public getCategories(categories: ICategory[]) {
        this.categories = categories;
        console.log(this.categories);
    }

    getAction(action: string) {
        this.action = action;
    }

    public getDossier(dossier: IDossier) {
        this.dossier = dossier;
    }

    public getTemplate(template: object) {
        this.template = template;
    }

    public getProcessWorkflow(workflow: any) {
        this.processWorkFlow = workflow;
    }

    public deleteTask() {
        this.taskService.delete(this.currentTask.id).subscribe(() => {
            this.dialogRef.close();
            this.router.navigate(['dashboard']);
        });
        if (this.currentTask.dossierId) {
            this.dossiersService.close(this.currentTask.dossierId).subscribe();
        }
    }

    public saveTask() {
      this.isSaved = true;
    }

    public openClient(client: ICustomer) {
        this.dialogRef.close();
    }
}
