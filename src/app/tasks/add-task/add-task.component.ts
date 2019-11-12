import {Component, OnInit, OnDestroy} from '@angular/core';
import {TasksService} from '../tasks.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomersService} from '../../customers/customers.service';
import {Subscription} from 'rxjs';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';

@AutoUnsubscribe()
@Component({
    selector: 'app-add-task',
    templateUrl: './add-task.component.html',
    styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent implements OnInit, OnDestroy {
    private categories: any;
    private contactReasons: any;
    private dossierCategories: any;
    private messageChannels: any;
    private types: any;

    private form: FormGroup;
    private contactReason = '';
    private isChecked = true;
    private taskSubject = '';

    private categorySubscription$: Subscription;
    private contactReasonsSubscription$: Subscription;
    private dossierCategoriesSubscription$: Subscription;
    private messageChannelsSubscription$: Subscription;
    private typesSubscription$: Subscription;

    constructor(private taskService: TasksService, private customersService: CustomersService, private formBuilder: FormBuilder) {}

    ngOnInit() {
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

        this.form = this.formBuilder.group({
           messageChannel: this.formBuilder.control('', Validators.compose([Validators.required])),
           category: this.formBuilder.control('', Validators.compose([Validators.required])),
           types: this.formBuilder.control('', Validators.compose([Validators.required])),
           contactReason: this.formBuilder.control('', Validators.compose([Validators.required])),
           dossierCategory: this.formBuilder.control('', Validators.compose([Validators.required])),
           subject: this.formBuilder.control('', Validators.compose([Validators.required])),
           body: this.formBuilder.control(''),
        });
        this.form.valueChanges.subscribe(data => this.onFormValueChange(data));

    }

    ngOnDestroy(): void {
    }

    private addTask() {
    }

    private onSubmit(value: any) {
        // POST request to create a new task
    }

    private onFormValueChange(data: any) {
        this.contactReason = data.contactReason;
    }

}
