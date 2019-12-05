import {Component, OnInit, OnDestroy, ViewChild, Inject} from '@angular/core';
import {TasksService} from '../tasks.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomersService} from '../../customers/customers.service';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {ICustomer} from '../../customers/ICustomer';
import {AuthService} from '../../auth/auth.service';
import {MatStepper} from '@angular/material';
import {DossierFilter, DossierService} from '../../dossiers/dossier.service';
import {IDossier} from '../../dossiers/IDossier';
import {Router} from '@angular/router';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ITask} from '../ITask';

@AutoUnsubscribe()
@Component({
  selector: 'app-current-task-dialog',
  templateUrl: './current-task-dialog.component.html',
  styleUrls: ['./current-task-dialog.component.scss']
})
export class CurrentTaskDialogComponent implements OnInit, OnDestroy {
  public currentTask: ITask;
  private relatieId: number;

  public categories: any;
  public contactReasons: any;
  public dossierCategories: any;
  public messageChannels: any;
  public types: any;

  public createTaskForm: FormGroup;
  public contactReason = '';
  public isChecked = true;
  public taskSubject = '';

  public currentClient: ICustomer;
  public clientSelected: boolean;
  @ViewChild('stepper', {static: false}) stepper: MatStepper;
  public action: string;
  public assigneeForm: FormGroup;
  public formData: any;
  public task: any;
  public employeeId: number;
  public openDossiers: IDossier[];
  public dossierForm: FormGroup;

  constructor(
      public dialogRef: MatDialogRef<CurrentTaskDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private tasksService: TasksService,
      private customersService: CustomersService,
      private formBuilder: FormBuilder,
      private authService: AuthService,
      private dossiersService: DossierService,
      private router: Router,
  ) {
  }

  ngOnInit() {

    this.currentTask = this.data.task;
    console.log(this.currentTask);
    this.relatieId = this.data.task.relatieId;
    this.customersService.getById(this.relatieId);

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
    this.tasksService.getDossierCategories().subscribe((data) => {
      this.dossierCategories = data;
    });

    this.createAddTaskForm();
  }

  ngOnDestroy(): void {
  }

  public updateSubject() {
    this.isChecked = !this.isChecked;
    if (this.isChecked && this.contactReason !== '') {
      this.createTaskForm.patchValue({
        subject: this.contactReason
      });
    } else {
      this.createTaskForm.patchValue({
        subject: this.taskSubject
      });
    }
  }

  public contactReasonToSubject() {
    if (this.isChecked) {
      this.createTaskForm.patchValue({
        subject: this.contactReason
      });
    }
  }

  public createAddTaskForm() {
    this.createTaskForm = this.formBuilder.group({
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
    this.createTaskForm.valueChanges.subscribe(data => this.onFormValueChange(data));
  }

  private onFormValueChange(data: any) {
    this.contactReason = data.contactReason.name;
    this.taskSubject = data.subject;
  }

  public onSubmit(formData: FormData) {
    console.log(formData);
    this.addTask(formData);
  }

  public addTask(formData: FormData) {
    this.formData = formData;
    this.tasksService.new(formData).subscribe(
        (task) => {
          this.task = task;
          console.log(this.task);
          if (this.action === 'toewijzen') {
            this.createAssigneeForm();
          } else {
            // this.createResponseForm();
            this.createAssigneeForm();
          }
        }
    );
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

  public move(index: number, action: string) {
    this.action = action;
    this.stepper.selectedIndex = index;
  }

  public createAssigneeForm() {
    this.assigneeForm = this.formBuilder.group({
      category: this.formBuilder.control(this.task.messageCategoryId, Validators.compose([Validators.required])),
      subject: this.formBuilder.control(this.task.subject, Validators.compose([Validators.required])),
      description: this.formBuilder.control('', Validators.compose([Validators.required])),
    });
    this.createTaskForm.valueChanges.subscribe(data => this.onFormValueChange2(data));
  }

  private onFormValueChange2(data: any) {
    this.contactReason = data.contactReason.name;
    this.taskSubject = data.subject;
  }

  onSubmit2(formData: any) {
    console.log(formData);
    this.tasksService.edit(this.task.id, formData).subscribe(
        (task) => {
          console.log(task);
        }
    );
    this.createDossierForm();
    this.getOpenDossiers();
    // this.createDossierForm();
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
    this.tasksService.edit(this.task.id, formData).subscribe(
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

  onNoClick(): void {
    this.dialogRef.close();
  }

  public deleteTask(id: any) {
    this.tasksService.delete(id).subscribe();
    this.dialogRef.close();
  }

}
