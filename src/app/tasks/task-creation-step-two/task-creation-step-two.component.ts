import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {TasksService} from '../tasks.service';
import {CustomersService} from '../../customers/customers.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../auth/auth.service';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {ICustomer} from '../../customers/ICustomer';
import {MatStepper} from '@angular/material';
import {ICategory, IContactReason, IMessageChannel, ITask, IType} from '../ITask';
import {TemplatesService} from '../../templates.service';
import {EmployeesService} from '../../employees/employees.service';
import {ITemplate} from '../../ITemplate';
import {DossierService} from '../../dossiers/dossier.service';
import {IDossier} from '../../dossiers/IDossier';
import {Router} from '@angular/router';
import {IEmployeeByToken} from '../../employees/IEmployee';

@AutoUnsubscribe()
@Component({
    selector: 'app-task-creation-step-two',
    templateUrl: './task-creation-step-two.component.html',
    styleUrls: ['./task-creation-step-two.component.scss']
})
export class TaskCreationStepTwoComponent implements OnInit, OnDestroy, AfterViewInit {

    public categories: ICategory[];
    public contactReasons: IContactReason[];
    public messageChannels: IMessageChannel[];
    public types: IType[];
    public taskId: number;

    public contactReason = '';
    public employee: IEmployeeByToken;
    public template: ITemplate;

    @Output() templateEmitter = new EventEmitter<object>();

    @Input()
    public set taskType(val: string) {
        if (val) {
            this.selectPreset(val);
        }
    }

    public formStepTwo: FormGroup;
    public contactReasonId: number;
    public isChecked = true;
    public taskSubject = '';

    @Output() clientEmitter = new EventEmitter<ICustomer>();
    public currentClient: ICustomer;
    public clientSelected: boolean;
    @ViewChild('stepper', {static: false}) stepper: MatStepper;
    @Output() taskEmitter = new EventEmitter<ITask>();
    @Output() dossierEmitter = new EventEmitter<IDossier>();
    @Output() action = new EventEmitter<string>();

    @Input() currentTask: ITask;

    public task: ITask;
    public dossier: IDossier;

    @Output() categoriesEmitter = new EventEmitter<any>();
    @Output() typesEmitter = new EventEmitter<any>();
    @Output() contactReasonEmitter = new EventEmitter<string>();
    @Output() processWorkflowEmitter = new EventEmitter<any>();

    @Input()
    public set createWithClient(val) {
        if (val) {
            this.selectClient(val);
        }
    }

    @Input()
    public set isSaved(val) {
        if (val) {
            this.editTask(this.formStepTwo.value);
        }
    }
    public dossierId: number;

    constructor(private tasksService: TasksService,
                private customersService: CustomersService,
                private formBuilder: FormBuilder,
                private authService: AuthService,
                private templatesService: TemplatesService,
                private employeesService: EmployeesService,
                private dossiersService: DossierService,
                private router: Router,
    ) {}

    ngOnInit() {
        this.tasksService.channels.subscribe(data => this.messageChannels = data);
        this.tasksService.categories.subscribe(data => this.categories = data);
        this.tasksService.types.subscribe(data => this.types = data);
        this.tasksService.contactReasons.subscribe(data => this.contactReasons = data);
        this.createAddTaskForm();
    }

    ngOnDestroy(): void {
    }

    ngAfterViewInit() {
        this.checkCurrentTask();
    }

    selectPreset(taskType) {
        if (taskType === 'email') {
            this.formStepTwo.controls.messageChannelId.setValue(2);
            this.formStepTwo.controls.messageCategoryId.setValue(1);
            this.formStepTwo.controls.typeId.setValue(1);
        } else if (taskType === 'telefoon') {
            this.formStepTwo.controls.messageChannelId.setValue(4);
            this.formStepTwo.controls.messageCategoryId.setValue(4);
            this.formStepTwo.controls.typeId.setValue(2);
        }
        if (!this.taskId) {
            this.addTask(this.formStepTwo.getRawValue());
        }
    }

    public createAddTaskForm() {
        this.formStepTwo = this.formBuilder.group({
            messageChannelId: this.formBuilder.control(2, Validators.compose([Validators.required])),
            messageCategoryId: this.formBuilder.control(4, Validators.compose([Validators.required])),
            typeId: this.formBuilder.control(2, Validators.compose([Validators.required])),
            contactReasonId: this.formBuilder.control(Validators.compose([Validators.required])),
            subject: this.formBuilder.control('', Validators.compose([Validators.required])),
            body: this.formBuilder.control(Validators.compose([])),
            assignedById: this.formBuilder.control(this.authService.getUserId()),
            assigneeId: this.formBuilder.control(this.authService.getUserId()),
            createdById: this.formBuilder.control(this.authService.getUserId()),
            direction: this.formBuilder.control('inbound'),
            isDraft: this.formBuilder.control(true),
        });
        this.formStepTwo.valueChanges.subscribe(data => this.onFormValueChange(data));
    }

    private onFormValueChange(data: any) {
        this.contactReasonId = data.contactReasonId;
        this.taskSubject = data.subject;
    }

    public submitForm(action: string, messageBody: HTMLElement) {
        this.formStepTwo.controls.body.setValue(messageBody.innerHTML);
        const formData = this.formStepTwo.value;
        if (!this.dossierId) {
            this.newDossier(formData, action);
        } else {
            this.editTask(formData, action);
        }
        this.action.emit(action);
        this.categoriesEmitter.emit(this.categories);
        this.typesEmitter.emit(this.types);
        this.contactReasonEmitter.emit(this.contactReason);

        if (action === 'beantwoorden') {
            this.getEmployee();
        }
    }

    public addTask(formData: any) {
        this.tasksService.new(formData).subscribe(
            (task: ITask) => {
                this.taskId = task.id;
            }
        );
    }

    public editTask(formData: ITask, action?: string) {
        let taskId: number;
        if (this.taskId) {
            taskId = this.taskId;
        } else {
            taskId = this.currentTask.id;
        }
        this.tasksService.edit(taskId, formData).subscribe((task) => {
            this.taskEmitter.emit(task);
            if (action === 'beantwoorden') {
                this.task = task;
                this.processTask();
            }
        });
    }

    public newDossier(formData: any, action?: string) {
        this.dossiersService.new(formData).subscribe((dossier: IDossier) => {
            this.dossierId = dossier.id;
            formData.dossierId = dossier.id;
            this.editTask(formData, action);
            this.dossierEmitter.emit(dossier);
            this.dossier = dossier;
        });
    }

    public processTask() {
        const client = this.currentClient;
        const data = {
            message: this.task,
            reply: {
                subject: 'RE: ' + this.task.subject
            },
            draftInfo: {
                selectedDossierOption: this.task.dossierId,
                recipients: {
                    to: [
                        {
                            email: client.emailaddress[0].address,
                            display: client.initials + ' (' + client.firstname + ') ' + client.middlename
                                + ' ' + client.lastname + ' (' + client.emailaddress[0].address + ')',
                            name: client.initials + ' (' + client.firstname + ') ' + client.middlename
                                + ' ' + client.lastname
                        }],
                    cc: null,
                    bcc: null,
                    sendEmailAfterProcess: true,
                    closeDossierAfterProcess: true
                }
            }
        };
        this.tasksService.processWorkflow(data).subscribe((response) => {
            this.processWorkflowEmitter.emit(response);
        });
    }

    public updateSubject() {
        this.isChecked = !this.isChecked;
        if (this.isChecked && this.contactReasonId) {
            this.contactReason = this.contactReasons[this.contactReasonId - 1].name;
            this.formStepTwo.patchValue({
                subject: this.contactReason
            });
        } else {
            this.formStepTwo.patchValue({
                subject: this.taskSubject
            });
        }
    }

    public contactReasonToSubject() {
        if (this.isChecked) {
            this.contactReason = this.contactReasons[this.contactReasonId - 1].name;

            this.formStepTwo.patchValue({
                subject: this.contactReason
            });
        }
    }

    public getEmployee() {
        this.employeesService.getByToken(this.authService.getToken()).subscribe((employee) => {
            this.employee = employee.user;
            this.getTemplate();
        });
    }

    public getTemplate() {
        this.templatesService.postById(this.currentClient, this.employee).subscribe((template) => {
            this.template = template;
            this.templateEmitter.emit(template);
        });
    }

    public getClient(id: number) {
        this.customersService.getById(id).subscribe(
            (client) => {
                this.currentClient = client;
            }
        );
    }

    public deselectClient() {
        this.currentClient = null;
        this.clientSelected = false;
    }

    public selectClient(client: ICustomer) {
        this.currentClient = client;
        this.clientSelected = true;
    }

    public checkCurrentTask() {

        if (this.currentTask) {
            if (this.currentTask.dossierId) {
                this.dossierId = this.currentTask.dossierId;
            }
            if (this.currentTask.relatieId) {
                this.clientSelected = true;
                this.getClient(this.currentTask.relatieId);
                this.formStepTwo.controls.relatieId.setValue(this.currentTask.relatieId);
            }
            if (this.currentTask.assigneeId) {
                this.formStepTwo.controls.assigneeId.setValue(this.currentTask.assigneeId);
            }
            if (this.currentTask.assignedById) {
                this.formStepTwo.controls.assignedById.setValue(this.currentTask.assignedById);
            }
            if (this.currentTask.subject) {
                this.formStepTwo.controls.subject.setValue(this.currentTask.subject);
                this.contactReason = this.currentTask.subject;
            }
            if (this.currentTask.body) {
                this.formStepTwo.controls.body.setValue(this.currentTask.body);
            }
            if (this.currentTask.messageChannelId) {
                this.formStepTwo.controls.messageChannelId.setValue(this.currentTask.messageChannelId);
            }
            if (this.currentTask.messageCategoryId) {
                this.formStepTwo.controls.messageCategoryId.setValue(this.currentTask.messageCategoryId);
            }
            if (this.currentTask.typeId) {
                this.formStepTwo.controls.typeId.setValue(this.currentTask.typeId);
            }
            if (this.currentTask.contactReasonId) {
                this.formStepTwo.controls.contactReasonId.setValue(this.currentTask.contactReasonId);
            }
        }
    }

    redirectToClientCard(client: ICustomer) {
        // output to current-task and close expansion panel
        this.clientEmitter.emit(client);
        this.router.navigate(['klanten'], {state: {client}});
    }
}
