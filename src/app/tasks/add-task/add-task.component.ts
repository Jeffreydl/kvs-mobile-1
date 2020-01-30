import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {MatStepper} from '@angular/material';
import {IDossier} from '../../dossiers/IDossier';
import {TaskCreationStepTwoComponent} from '../task-creation-step-two/task-creation-step-two.component';
import {ICategory, ITask, IType} from '../ITask';
import {TaskCreationStepThreeComponent} from '../task-creation-step-three/task-creation-step-three.component';
import {ICustomer} from '../../customers/ICustomer';

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

    @ViewChild(TaskCreationStepTwoComponent, {static: false}) taskCreationStepTwoComponent: TaskCreationStepTwoComponent;
    @ViewChild(TaskCreationStepThreeComponent, {static: false}) taskCreationStepThreeComponent: TaskCreationStepThreeComponent;

    public types: IType[];
    public taskType: string;
    public categories: ICategory[];
    public contactReason: string;
    public template: object;
    public processWorkFlow: any;
    public selectedClient: ICustomer;

    constructor(private cdRef: ChangeDetectorRef) {}

    public get formStepTwo() {
            return this.taskCreationStepTwoComponent ? this.taskCreationStepTwoComponent.formStepTwo : null;
    }

    public get formStepThree() {
        return this.taskCreationStepThreeComponent ? this.taskCreationStepThreeComponent.formStepThree : null;
    }

    ngOnInit() {
        this.cdRef.detectChanges();
        this.getRouteState();
    }

    ngOnDestroy(): void {
    }

    getRouteState(): void {
        const state = window.history.state;
        if (state.action) {
            this.taskType = state.action;
            this.stepper.selectedIndex = 1;
            this.selectedClient = state.client;
        }
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

    public getCategories(categories: ICategory[]) {
        this.categories = categories;
    }

    public getTypes(types: IType[]) {
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
