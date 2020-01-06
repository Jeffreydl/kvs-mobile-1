import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {TasksService} from '../tasks.service';
import {TemplatesService} from '../../templates.service';
import {ITask} from '../ITask';
import {Router} from '@angular/router';

@AutoUnsubscribe()
@Component({
  selector: 'app-task-creation-step-three',
  templateUrl: './task-creation-step-three.component.html',
  styleUrls: ['./task-creation-step-three.component.scss']
})
export class TaskCreationStepThreeComponent implements OnInit, OnDestroy {
  public formStepThree: FormGroup;
  public category = '';
  public taskSubject = '';
  // public categories: any;

  currentTask: ITask;
  public get task(): any {
    return this.currentTask;
  }
  @Input()
  public set task(val: any) {
    this.currentTask = val;
    this.createAssigneeForm();
  }

    currentDossier: any;
    public get dossier(): any {
        return this.currentDossier;
    }
    @Input()
    public set dossier(val: any) {
        this.currentDossier = val;
    }

  __action: string;
  public get action(): string {
    return this.__action;
  }
  @Input()
  public set action(val: string) {
    this.__action = val;
  }

  categories: any;
  public get categoriesList(): any {
    return this.categories;
  }
  @Input()
  public set categoriesList(val: any) {
    this.categories = val;
  }

    templateValue: any;
    public get template(): any {
      console.log(this.templateValue);
      return this.templateValue;
    }
    @Input()
    public set template(val: any) {
        this.templateValue = val;
    }

    processWorkflow: any;
    public get workflow(): any {
        console.log(this.templateValue);
        return this.templateValue;
    }
    @Input()
    public set workflow(val: any) {
      console.log(val);
      this.processWorkflow = val;
    }

    public emailIsChecked = true;
    public closeDossierIsChecked = true;

  constructor(private formBuilder: FormBuilder,
              private tasksService: TasksService,
              private router: Router) { }

  ngOnInit() {
  }

  ngOnDestroy(): void {
  }

  public createAssigneeForm() {
    if (this.currentTask) {
      this.formStepThree = this.formBuilder.group({
        category: this.formBuilder.control(this.task.messageCategoryId, Validators.compose([Validators.required])),
        subject: this.formBuilder.control(this.task.subject, Validators.compose([Validators.required])),
        body: this.formBuilder.control('', Validators.compose([Validators.required])),
      });
      this.formStepThree.valueChanges.subscribe(data => this.onFormValueChange2(data));
    }
  }

  private onFormValueChange2(data: any) {
    this.category = data.category.name;
    this.taskSubject = data.subject;
  }

  onSubmit2(formData: any) {
    this.tasksService.edit(this.currentTask.id, formData).subscribe(
        (task: ITask) => {
          this.assignTask(formData, task);
        }
    );
  }

  public assignTask(formData: any, task: ITask) {
    const data = {
      message: task,
      comment: {
        subject: formData.subject,
        body: formData.body
      },
      assignee: task.assignee,
      messageCategory: task.messageCategory
    };
    console.log(data);
    this.tasksService.assign(data).subscribe();
    this.router.navigate(['dashboard']);
  }

  public onSubmitResponse(test) {
    const data = this.processWorkflow.response.reply;
    data.body = test;
    data.template = this.template.response;

    this.tasksService.edit(data.id, data).subscribe((lol) => {
      this.finalizeMessageWorkflow(lol);
    });
  }

  public finalizeMessageWorkflow(lol) {
    console.log(this.processWorkflow);

    const relation = lol.relatie;

    const data = {
        dossier: this.dossier,
        message: this.task,
        reply: this.processWorkflow.response.reply,
        tasks: [],
        messageComment: {createdBy: '15'},
        sendEmail: true,
        emailTemplateId: 7,
        employeeProfile: this.processWorkflow.response.reply.assignee.profile,
        closeDossierAfterProcess: true,
        publishToWbs: false,
        recipients: {
            to: [
                {
                    email: relation.emailaddress[0].address,
                    display: relation.initials + ' (' + relation.firstname + ') ' + relation.middlename
                        + ' ' + relation.lastname + ' (' + relation.emailaddress[0].address + ')',
                    name: relation.initials + ' (' + relation.firstname + ') ' + relation.middlename
                        + ' ' + relation.lastname
                }],
            cc: [],
            bcc: [],
            sendEmailAfterProcess: true,
            closeDossierAfterProcess: true
        }
    };
    data.dossier.comments = [];
    data.dossier.messages = [];
    this.tasksService.finalizeWorkflow(data).subscribe();
  }
}
