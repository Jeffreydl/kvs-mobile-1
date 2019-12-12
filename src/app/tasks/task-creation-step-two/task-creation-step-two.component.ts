import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
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
export class TaskCreationStepTwoComponent implements OnInit, OnDestroy, AfterViewInit {

    public categories: any;
    public contactReasons: any;
    public messageChannels: any;
    public types: any;
    public taskId: number;

  __taskType: string;
    public contactReason: any;
  public get taskType(): string {
    return this.__taskType;
  }

    @Input()
    public set taskType(val: string) {
        this.__taskType = val;
        this.selectPreset();
    }

  public formStepTwo: FormGroup;
  public contactReasonId: number;
  public isChecked = true;
  public taskSubject = '';

    public currentClient: ICustomer;
    public clientSelected: boolean;
    @ViewChild('stepper', {static: false}) stepper: MatStepper;
    public formData: any;
    @Output() task = new EventEmitter<ITask>();
    @Output() action = new EventEmitter<string>();

    @Input() currentTask: ITask;

  @Output() categoriesEmitter = new EventEmitter<any>();
  @Output() typesEmitter = new EventEmitter<any>();
  @Output() contactReasonEmitter = new EventEmitter<string>();

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

    ngAfterViewInit() {
        this.checkCurrentTask();
    }

    selectPreset() {
        console.log(this.__taskType);
        if (this.__taskType === 'email') {
            this.formStepTwo.controls.messageChannelId.setValue(2);
            this.formStepTwo.controls.messageCategoryId.setValue(1);
            this.formStepTwo.controls.typeId.setValue(1);
        } else if (this.__taskType === 'telefoon') {
            this.formStepTwo.controls.messageChannelId.setValue(4);
            this.formStepTwo.controls.messageCategoryId.setValue(4);
            this.formStepTwo.controls.typeId.setValue(2);
        }
    }

    public createAddTaskForm() {
        this.formStepTwo = this.formBuilder.group({
            messageChannelId: this.formBuilder.control(2, Validators.compose([Validators.required])),
            messageCategoryId: this.formBuilder.control(4, Validators.compose([Validators.required])),
            typeId: this.formBuilder.control(2, Validators.compose([Validators.required])),
            contactReasonId: this.formBuilder.control('', Validators.compose([Validators.required])),
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

    this.contactReasonId = data.contactReasonId;
    this.taskSubject = data.subject;
    console.log(this.currentTask);
  }

  public submit(action: string, formData: any) {
    if (this.taskId || this.currentTask) {
      this.editTask(formData);
    } else {
      this.addTask(formData);
    }
    this.action.emit(action);
    this.categoriesEmitter.emit(this.categories);
    this.typesEmitter.emit(this.types);
    this.contactReasonEmitter.emit(this.contactReason);
  }

  public addTask(formData: any) {
      this.tasksService.new(formData).subscribe(
          (task: ITask) => {
              console.log(task.id);
              this.taskId = task.id;
              this.task.emit(task);
          }
      )
  }

  public editTask(formData: any) {
      if (this.taskId) {
          this.tasksService.edit(this.taskId, formData).subscribe(
              (task: ITask) => {
                  console.log(task);
                  this.task.emit(task);
              }
          );
      } else {
          this.tasksService.edit(this.currentTask.id, formData).subscribe(
              (task: ITask) => {
                  console.log(task);
                  this.task.emit(task);
              }
          );
      }
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

  public checkCurrentTask() {
      if (this.currentTask) {
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
}
