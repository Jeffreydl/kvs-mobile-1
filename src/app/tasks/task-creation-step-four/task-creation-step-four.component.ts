import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {DossierFilter, DossierService} from '../../dossiers/dossier.service';
import {TasksService} from '../tasks.service';
import {Router} from '@angular/router';
import {IDossier} from '../../dossiers/IDossier';
import {ICustomer} from '../../customers/ICustomer';
import {ITask} from '../ITask';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';

@AutoUnsubscribe()
@Component({
  selector: 'app-task-creation-step-four',
  templateUrl: './task-creation-step-four.component.html',
  styleUrls: ['./task-creation-step-four.component.scss']
})
export class TaskCreationStepFourComponent implements OnInit, OnDestroy {
  public formStepFour: FormGroup;
  public currentClientId: number;
  public get clientId(): number {
    return this.currentClientId;
  }
  @Input()
  public set clientId(val: number) {
    this.currentClientId = val;
    console.log(this.currentClientId);
    this.getOpenDossiers();
    this.createDossierForm();
  }

  public openDossiers: IDossier[];
  public currentTask: ITask;
  @Input() public set task(value: ITask) {
    this.currentTask = value;
  }

  public categories: any;
  public get categoriess() {
    return this.categories;
  }
  @Input() public set categoriess(value) {
    this.categories = value;
  }

  public types: any;
  public get typess() {
    return this.types;
  }
  @Input() public set typess(value) {
    this.types = value;
  }
  public contactReason: string;
  @Input() public set contactReasonn(value: string) {
    this.contactReason = value;
  }
  public get contactReasonn(): string {
    return this.contactReason;
  }
  public isChecked = true;

  constructor(private formBuilder: FormBuilder,
              private tasksService: TasksService,
              private dossiersService: DossierService,
              private router: Router) { }

  ngOnInit() {
  }

  ngOnDestroy(): void {
  }

  public createDossierForm() {
    if (this.currentClientId) {

      this.formStepFour = this.formBuilder.group({
        dossierId: '',
      });
      this.formStepFour.valueChanges.subscribe(data => this.onFormValueChange3(data));
    }
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
    this.router.navigate(['dashboard']);
  }

  public getOpenDossiers() {
    this.dossiersService.getAll(new DossierFilter()
        .forRelation(this.currentClientId)
        .openDossiers()
        .orderByCreationDate()
        .descending())
        .subscribe(dossiers => {
          this.openDossiers = dossiers;
          console.log(this.openDossiers);
        });
  }

}
