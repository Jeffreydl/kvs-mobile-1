import {Component, OnInit, OnDestroy, ViewChild, ChangeDetectionStrategy} from '@angular/core';
import {TasksService} from '../tasks.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CustomersService} from '../../customers/customers.service';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {ICustomer} from '../../customers/ICustomer';
import {AuthService} from '../../auth/auth.service';
import {MatStepper} from '@angular/material';
import {DossierFilter, DossierService} from '../../dossiers/dossier.service';
import {IDossier} from '../../dossiers/IDossier';
import {Router} from '@angular/router';
import {TaskCreationStepOneComponent} from '../task-creation-step-one/task-creation-step-one.component';
import {TaskCreationStepTwoComponent} from '../task-creation-step-two/task-creation-step-two.component';
import {ITask} from '../ITask';
import {TaskCreationStepThreeComponent} from '../task-creation-step-three/task-creation-step-three.component';
import {TaskCreationStepFourComponent} from '../task-creation-step-four/task-creation-step-four.component';

@AutoUnsubscribe()
@Component({
    selector: 'app-add-task',
    templateUrl: './add-task.component.html',
    styleUrls: ['./add-task.component.scss'],
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddTaskComponent implements OnInit, OnDestroy {
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

    constructor(private taskService: TasksService,
                private customersService: CustomersService,
                private formBuilder: FormBuilder,
                private authService: AuthService,
                private dossiersService: DossierService,
                private router: Router,
    ) {}

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

    ngOnInit() {
    }

    ngOnDestroy(): void {
    }

    getPreset(type: string) {
        this.taskType = type;
    }

    public getTask(task: ITask) {
        this.task = task;
        console.log(this.task);
    }

    getAction(action: string) {
        this.action = action;
        console.log(action);
    }

    public createDossierForm() {
        this.dossierForm = this.formBuilder.group({
            dossierId: '',
        });
        this.dossierForm.valueChanges.subscribe(data => this.onFormValueChange3(data));
    }

    private onFormValueChange3(data: any) {
        console.log(data);
    }

    onSubmit3(formData: any) {
        console.log(formData);
        this.taskService.edit(this.task.id, formData).subscribe(
            (task) => {
                console.log(task);
            }
        );
    }


    private createResponseForm() {

    }

    public getOpenDossiers() {
        this.dossiersService.getAll(new DossierFilter()
            .forRelation(this.currentClient.id)
            .openDossiers()
            .orderByCreationDate()
            .descending())
            .subscribe(dossiers => {
                this.openDossiers = dossiers;
                console.log(this.openDossiers);
            });
        this.router.navigate(['dashboard']);
    }
}
