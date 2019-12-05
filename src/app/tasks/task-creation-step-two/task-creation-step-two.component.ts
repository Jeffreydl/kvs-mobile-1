import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {TasksService} from '../tasks.service';
import {CustomersService} from '../../customers/customers.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../auth/auth.service';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {ICustomer} from '../../customers/ICustomer';
import {MatStepper} from '@angular/material';
import {ITask} from '../ITask';

@AutoUnsubscribe()
@Component({
  selector: 'app-task-creation-step-two',
  templateUrl: './task-creation-step-two.component.html',
  styleUrls: ['./task-creation-step-two.component.scss']
})
export class TaskCreationStepTwoComponent implements OnInit, OnDestroy {

  public categories: any;
  public contactReasons: any;
  public messageChannels: any;
  public types: any;

  __taskType: string;
  public get taskType(): string {
    return this.__taskType;
  }

  @Input()
  public set taskType(val: string) {
    this.__taskType = val;
    this.selectPreset();
  }

  public formStepTwo: FormGroup;
  public contactReason = '';
  public isChecked = true;
  public taskSubject = '';

  public currentClient: ICustomer;
  public clientSelected: boolean;
  @ViewChild('stepper', {static: false}) stepper: MatStepper;
  public formData: any;
  @Output() task = new EventEmitter<ITask>();
  @Output() action = new EventEmitter<string>();

  constructor(private tasksService: TasksService,
              private customersService: CustomersService,
              private formBuilder: FormBuilder,
              private authService: AuthService,
  ) {}

  ngOnInit() {

    this.tasksService.getMessageChannels().subscribe((data) => {
      this.messageChannels = data;
    });
    this.tasksService.getCategories().subscribe((data) => {
      this.categories = data;
    });
    this.tasksService.getTypes().subscribe((data) => {
      this.types = data;
    });
    this.tasksService.getContactReasons().subscribe((data) => {
      this.contactReasons = data;
    });
    this.createAddTaskForm();
  }

  ngOnDestroy(): void {
  }

  selectPreset() {
    console.log(this.__taskType);
    if (this.__taskType === 'email') {
      this.formStepTwo.controls.messageChannelId.setValue(2);
      this.formStepTwo.controls.messageCategoryId.setValue(1);
      this.formStepTwo.controls.typeId.setValue(1);
    } else if (this.__taskType === 'telefoon') {
      this.formStepTwo.controls.messageChannelId.setValue(1);
      this.formStepTwo.controls.messageCategoryId.setValue(4);
      this.formStepTwo.controls.typeId.setValue(2);
    }
  }

  public createAddTaskForm() {
    this.formStepTwo = this.formBuilder.group({
      messageChannelId: this.formBuilder.control(1, Validators.compose([Validators.required])),
      messageCategoryId: this.formBuilder.control(4, Validators.compose([Validators.required])),
      typeId: this.formBuilder.control(2, Validators.compose([Validators.required])),
      contactReason: this.formBuilder.control('', Validators.compose([Validators.required])),
      subject: this.formBuilder.control('', Validators.compose([Validators.required])),
      body: this.formBuilder.control(''),
      assignedById: this.formBuilder.control(this.authService.getUserId()),
      assigneeId: this.formBuilder.control(this.authService.getUserId()),
      createdById: this.formBuilder.control(this.authService.getUserId()),
      direction: this.formBuilder.control('inbound'),
      isDraft: this.formBuilder.control(true),
    });
    this.formStepTwo.valueChanges.subscribe(data => this.onFormValueChange(data));
  }

  private onFormValueChange(data: any) {
    this.contactReason = data.contactReason.name;
    this.taskSubject = data.subject;
  }

  public addTask(action: string, formData: any) {
    this.tasksService.new(formData).subscribe(
        (task) => {
          console.log(task);
          this.task.emit(task);
        }
    );
    this.action.emit(action);
  }

  public updateSubject() {
    this.isChecked = !this.isChecked;
    if (this.isChecked && this.contactReason !== '') {
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
      this.formStepTwo.patchValue({
        subject: this.contactReason
      });
    }
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

}
