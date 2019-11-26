import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {TasksService} from '../tasks.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomersService} from '../../customers/customers.service';
import {Subscription} from 'rxjs';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {ICustomer} from '../../customers/ICustomer';
import {AuthService} from '../../auth/auth.service';
import {MatStepper} from '@angular/material';
import {ITask} from '../itask';
import {EmployeeFilter, EmployeesService} from '../../employees.service';

@AutoUnsubscribe()
@Component({
    selector: 'app-add-task',
    templateUrl: './add-task.component.html',
    styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent implements OnInit, OnDestroy {
    public categories: any;
    public contactReasons: any;
    public dossierCategories: any;
    public messageChannels: any;
    public types: any;

    public form: FormGroup;
    public contactReason = '';
    public isChecked = true;
    public taskSubject = '';

    private categorySubscription$: Subscription;
    private contactReasonsSubscription$: Subscription;
    private dossierCategoriesSubscription$: Subscription;
    private messageChannelsSubscription$: Subscription;
    private typesSubscription$: Subscription;

    public currentClient: ICustomer;
    public clientSelected: boolean;
    private employeeId: number;
    @ViewChild('stepper', {static: false}) stepper: MatStepper;
    private action: string;
    public assigneeForm: FormGroup;
    private formData: any;

    constructor(private taskService: TasksService,
                private customersService: CustomersService,
                private formBuilder: FormBuilder,
                private authService: AuthService,
                private employeesService: EmployeesService,
                ) {}

    ngOnInit() {
        this.employeesService.getAll(new EmployeeFilter()
            .noSystemUser()
            .activeStatus())
            .subscribe(
                (employees) => {
                    console.log(employees);
                }
            )
        ;

        this.employeeId = this.authService.getUserId();

        this.messageChannelsSubscription$ = this.taskService.getMessageChannels().subscribe((data) => {
            this.messageChannels = data;
        });
        this.categorySubscription$ = this.taskService.getCategories().subscribe((data) => {
            this.categories = data;
        });
        this.typesSubscription$ = this.taskService.getTypes().subscribe((data) => {
            this.types = data;
        });
        this.contactReasonsSubscription$ = this.taskService.getContactReasons().subscribe((data) => {
            this.contactReasons = data;
        });
        this.dossierCategoriesSubscription$ = this.taskService.getDossierCategories().subscribe((data) => {
            this.dossierCategories = data;
        });

        this.createAddTaskForm();
    }

    ngOnDestroy(): void {
    }

    public updateSubject() {
        this.isChecked = !this.isChecked;
        if (this.isChecked) {
            this.form.patchValue({
                subject: this.contactReason
            });
        } else {
            this.form.patchValue({
                subject: this.taskSubject
            });
        }
    }

    public contactReasonToSubject() {
        if (this.isChecked) {
            this.form.patchValue({
                subject: this.contactReason
            });
        }
    }

    private createAddTaskForm() {
        this.form = this.formBuilder.group({
            messageChannel: this.formBuilder.control('', Validators.compose([Validators.required])),
            category: this.formBuilder.control('', Validators.compose([Validators.required])),
            type: this.formBuilder.control('', Validators.compose([Validators.required])),
            contactReason: this.formBuilder.control('', Validators.compose([Validators.required])),
            dossierCategory: this.formBuilder.control('', Validators.compose([Validators.required])),
            subject: this.formBuilder.control('', Validators.compose([Validators.required])),
            body: this.formBuilder.control(''),
        });
        this.form.valueChanges.subscribe(data => this.onFormValueChange(data));
    }

    private addTask() {
    }

    public onSubmit(formData: any) {
        // POST request to create a new task
        // this.taskService.new(formData);
        console.log(formData);
        this.formData = formData;
        console.log(this.currentClient);
        console.log(this.employeeId);

        if (this.action === 'toewijzen') {
            this.createAssigneeForm();
        } else {
            // this.createResponseForm();
            this.createAssigneeForm();
        }

    }

    private onFormValueChange(data: any) {
        this.contactReason = data.contactReason;
        this.taskSubject = data.subject;
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

    public getClientId(id: number) {
        this.getClient(id);
        this.clientSelected = true;
    }

    move(index: number, action: string) {
        this.action = action;
        this.stepper.selectedIndex = index;
    }

    private createAssigneeForm() {
        this.assigneeForm = this.formBuilder.group({
            category: this.formBuilder.control(this.formData.category, Validators.compose([Validators.required])),
        });
        this.form.valueChanges.subscribe(data => this.onFormValueChange(data));
    }

    private createResponseForm() {

    }

    onSubmit2(value: any) {
        console.log(value);
    }
}
