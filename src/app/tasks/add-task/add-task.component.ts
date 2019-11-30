import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {TasksService} from '../tasks.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomersService} from '../../customers/customers.service';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {ICustomer} from '../../customers/ICustomer';
import {AuthService} from '../../auth/auth.service';
import {MatStepper} from '@angular/material';

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

    public currentClient: ICustomer;
    public clientSelected: boolean;
    @ViewChild('stepper', {static: false}) stepper: MatStepper;
    private action: string;
    public assigneeForm: FormGroup;
    private formData: any;
    private task: any;

    constructor(private taskService: TasksService,
                private customersService: CustomersService,
                private formBuilder: FormBuilder,
                private authService: AuthService,
                ) {}

    ngOnInit() {

        this.taskService.getMessageChannels().subscribe((data)  => { this.messageChannels = data; });
        this.taskService.getCategories().subscribe( (data) => { this.categories = data; });
        this.taskService.getTypes().subscribe((data) => { this.types = data; });
        this.taskService.getContactReasons().subscribe((data) => { this.contactReasons = data; });
        this.taskService.getDossierCategories().subscribe((data) => { this.dossierCategories = data; });

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
            messageChannelId: this.formBuilder.control(1, Validators.compose([Validators.required])),
            messageCategoryId: this.formBuilder.control(4, Validators.compose([Validators.required])),
            typeId: this.formBuilder.control(2, Validators.compose([Validators.required])),
            contactReason: this.formBuilder.control('', Validators.compose([Validators.required])),
            // dossierCategory: this.formBuilder.control('', Validators.compose([Validators.required])),
            subject: this.formBuilder.control('', Validators.compose([Validators.required])),
            body: this.formBuilder.control(''),
            assignedById: this.formBuilder.control(this.authService.getUserId()),
            assigneeId: this.formBuilder.control(this.authService.getUserId()),
            createdById: this.formBuilder.control(this.authService.getUserId()),
            direction: this.formBuilder.control('inbound'),
            isDraft: this.formBuilder.control(true),
        });
        this.form.valueChanges.subscribe(data => this.onFormValueChange(data));
    }

    public onSubmit(formData: FormData) {
        this.addTask(formData);
    }

    public addTask(formData: FormData) {
        this.formData = formData;
        // this.taskService.new(formData).subscribe(
        //     (task) => {
        //         this.task = task;
        //         console.log(this.task);
        //     }
        // );

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
            subject: this.formBuilder.control(this.formData.category, Validators.compose([Validators.required])),
            description: this.formBuilder.control(this.formData.category, Validators.compose([Validators.required])),
        });
        this.form.valueChanges.subscribe(data => this.onFormValueChange2(data));
    }

    private onFormValueChange2(data: any) {
        this.contactReason = data.contactReason;
        this.taskSubject = data.subject;
    }

    private createResponseForm() {

    }

    onSubmit2(value: any) {
        console.log(value);
    }
}
