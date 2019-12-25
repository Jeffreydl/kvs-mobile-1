import {Component, OnInit, OnDestroy, ViewChild, Inject} from '@angular/core';
import {TasksService} from '../tasks.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomersService} from '../../customers/customers.service';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {ICustomer} from '../../customers/ICustomer';
import {AuthService} from '../../auth/auth.service';
import {MatStepper} from '@angular/material';
import {DossierFilter, DossierService} from '../../dossiers/dossier.service';
import {IDossier} from '../../dossiers/IDossier';
import {Router} from '@angular/router';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ITask} from '../ITask';
import {TaskCreationStepOneComponent} from '../task-creation-step-one/task-creation-step-one.component';
import {TaskCreationStepTwoComponent} from '../task-creation-step-two/task-creation-step-two.component';
import {TaskCreationStepThreeComponent} from '../task-creation-step-three/task-creation-step-three.component';
import {TaskCreationStepFourComponent} from '../task-creation-step-four/task-creation-step-four.component';

@AutoUnsubscribe()
@Component({
  selector: 'app-current-task-dialog',
  templateUrl: './current-task-dialog.component.html',
  styleUrls: ['./current-task-dialog.component.scss']
})
export class CurrentTaskDialogComponent implements OnInit, OnDestroy {
  public currentTask: ITask;
    public types: any;

    public currentClient: ICustomer;
    @ViewChild('stepper', {static: false}) stepper: MatStepper;
    public action: string;
    public assigneeForm: FormGroup;
    public task: ITask;
    public openDossiers: IDossier[];
    public dossierForm: FormGroup;

    @ViewChild(TaskCreationStepOneComponent, {static: false}) taskCreationStepOneComponent: TaskCreationStepOneComponent;
    @ViewChild(TaskCreationStepTwoComponent, {static: false}) taskCreationStepTwoComponent: TaskCreationStepTwoComponent;
    @ViewChild(TaskCreationStepThreeComponent, {static: false}) taskCreationStepThreeComponent: TaskCreationStepThreeComponent;
    @ViewChild(TaskCreationStepFourComponent, {static: false}) taskCreationStepFourComponent: TaskCreationStepFourComponent;
    public taskType: string;

    public template: object;
    public processWorkFlow: any;


  constructor(
      public dialogRef: MatDialogRef<CurrentTaskDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private taskService: TasksService,
      private customersService: CustomersService,
      private formBuilder: FormBuilder,
      private authService: AuthService,
      private dossiersService: DossierService,
      private router: Router,
  ) {}

  ngOnInit() {

    this.currentTask = this.data.task;
  }

  ngOnDestroy(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

    public get formStepOne() {
        return this.taskCreationStepOneComponent ? this.taskCreationStepOneComponent.formStepOne : null;
    }

    public get formStepTwo() {
        return this.taskCreationStepTwoComponent ? this.taskCreationStepTwoComponent.formStepTwo : null;
    }

    public get formStepThree() {
        return this.taskCreationStepThreeComponent ? this.taskCreationStepThreeComponent.formStepThree : null;
    }

    public get formStepFour() {
        return this.taskCreationStepFourComponent ? this.taskCreationStepFourComponent.formStepFour : null;
    }

    public getTask(task: ITask) {
        this.task = task;
    }

    getAction(action: string) {
        this.action = action;
    }

    public getTemplate(template: object) {
        this.template = template;
    }

    public getProcessWorkflow(workflow: any) {
        this.processWorkFlow = workflow;
    }

    public deleteTask() {
        this.taskService.delete(this.currentTask.id).subscribe((task) => {
            this.dialogRef.close();
            this.router.navigate(['dashboard']);
        });

    }
}
