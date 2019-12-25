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
    @ViewChild('stepper', {static: false}) stepper: MatStepper;
    public action: string;
    public task: ITask;
    public clientId: number;

    @ViewChild(TaskCreationStepOneComponent, {static: false}) taskCreationStepOneComponent: TaskCreationStepOneComponent;
    @ViewChild(TaskCreationStepTwoComponent, {static: false}) taskCreationStepTwoComponent: TaskCreationStepTwoComponent;
    @ViewChild(TaskCreationStepThreeComponent, {static: false}) taskCreationStepThreeComponent: TaskCreationStepThreeComponent;
    @ViewChild(TaskCreationStepFourComponent, {static: false}) taskCreationStepFourComponent: TaskCreationStepFourComponent;
    public types: any;
    public taskType: string;
    public categories: any;
    public contactReason: string;
    public template: object;
    public processWorkFlow: any;

    constructor() {}

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
        this.clientId = task.relatieId;
    }

    getAction(action: string) {
        this.action = action;
    }

    // public createDossierForm() {
    //     this.dossierForm = this.formBuilder.group({
    //         dossierId: '',
    //     });
    //     this.dossierForm.valueChanges.subscribe(data => this.onFormValueChange3(data));
    // }

    // private onFormValueChange3(data: any) {
    // }
    //
    // onSubmit3(formData: any) {
    //     this.taskService.edit(this.task.id, formData).subscribe(
    //         (task) => {
    //         }
    //     );
    // }


    private createResponseForm() {

    }
    //
    // public getOpenDossiers() {
    //     this.dossiersService.getAll(new DossierFilter()
    //         .forRelation(this.currentClient.id)
    //         .openDossiers()
    //         .orderByCreationDate()
    //         .descending())
    //         .subscribe(dossiers => {
    //             this.openDossiers = dossiers;
    //         });
    //     this.router.navigate(['dashboard']);
    // }
    public getCategories(categories: any) {
        this.categories = categories;
    }

    public getTypes(types: any) {
        this.types = types;
    }

    public getContactReason(contactReason: string) {
        this.contactReason = contactReason;
    }

    public getTemplate(template: object) {
        this.template = template;
    }

    public getProcessWorkflow(workflow: any) {
        this.processWorkFlow = workflow;
    }
}
