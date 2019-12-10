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
  public currentClient: ICustomer;
  public openDossiers: IDossier[];
  public dossierForm: FormGroup;
  public currentTask: ITask;
  @Input() public set task(value: ITask) {
    this.currentTask = value;
    this.createDossierForm();
  }

  constructor(private formBuilder: FormBuilder,
              private tasksService: TasksService,
              private dossiersService: DossierService,
              private router: Router) { }

  ngOnInit() {
  }

  ngOnDestroy(): void {
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

}
