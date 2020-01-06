import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {MatStepper} from '@angular/material';
import {IDossier} from '../../dossiers/IDossier';
import {TaskCreationStepOneComponent} from '../task-creation-step-one/task-creation-step-one.component';
import {TaskCreationStepTwoComponent} from '../task-creation-step-two/task-creation-step-two.component';
import {ITask} from '../ITask';
import {TaskCreationStepThreeComponent} from '../task-creation-step-three/task-creation-step-three.component';
import {TaskCreationStepFourComponent} from '../task-creation-step-four/task-creation-step-four.component';
import { ChangeDetectorRef} from '@angular/core';

@AutoUnsubscribe()
@Component({
    selector: 'app-add-task',
    templateUrl: './add-task.component.html',
    styleUrls: ['./add-task.component.scss'],
})
export class AddTaskComponent implements OnInit, OnDestroy {
    @ViewChild('stepper', {static: false}) stepper: MatStepper;
    public action: string;
    public task: ITask;
    public dossier: IDossier;
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
    public selectedClient;

    constructor(private cdRef: ChangeDetectorRef) {}

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
        this.cdRef.detectChanges();
        const state = window.history.state;
        if (state.action) {
            console.log(state);
            this.taskType = state.action;
            this.stepper.selectedIndex = 1;
            this.selectedClient = state.client;
        }
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

    public getDossier(dossier: IDossier) {
        this.dossier = dossier;
    }
    getAction(action: string) {
        this.action = action;
    }

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
