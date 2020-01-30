import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {TasksService} from '../tasks.service';
import {ICategory, ITask} from '../ITask';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';

@AutoUnsubscribe()
@Component({
    selector: 'app-task-creation-step-three',
    templateUrl: './task-creation-step-three.component.html',
    styleUrls: ['./task-creation-step-three.component.scss']
})
export class TaskCreationStepThreeComponent implements OnInit, OnDestroy {
    public formStepThree: FormGroup;

    currentTask: ITask;

    public get task(): any {
        return this.currentTask;
    }

    @Input()
    public set task(val: any) {
        this.currentTask = val;
        this.createAssigneeForm();
    }

    public currentDossier: any;

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

    public categories: ICategory[];

    @Input()
    public set categoriesList(val: any) {
        this.categories = val;
    }

    templateValue: any;

    public get template(): any {
        return this.templateValue;
    }

    @Input()
    public set template(val: any) {
        this.templateValue = val;
    }

    processWorkflow: any;

    @Input()
    public set workflow(val: any) {
        this.processWorkflow = val;
    }

    @Output() closeDialogEmitter = new EventEmitter<boolean>();

    public emailIsChecked = true;
    public closeDossierIsChecked = true;

    constructor(private formBuilder: FormBuilder,
                private tasksService: TasksService,
                private router: Router,
                private snackBar: MatSnackBar) {
    }

    ngOnInit() {
    }

    ngOnDestroy(): void {
    }

    public createAssigneeForm() {
        if (this.currentTask) {
            this.formStepThree = this.formBuilder.group({
                category: this.formBuilder.control(this.currentTask.messageCategory.id, Validators.compose([Validators.required])),
                subject: this.formBuilder.control(this.task.subject, Validators.compose([Validators.required])),
                body: this.formBuilder.control(''),
            });
            this.formStepThree.valueChanges.subscribe(data => this.onFormValueChange(data));
        }
    }

    private onFormValueChange(data: any) {
        }


    onSubmit(formData: any) {
        this.assignTask(formData, this.currentTask);

    }

    public assignTask(formData: any, task: ITask) {
        const data = {
            message: task,
            comment: {
                subject: formData.subject,
                body: formData.body
            },
            assignee: formData.assignee,
            messageCategory: formData.messageCategory
        };
        this.tasksService.assign(data).subscribe(() => {
            this.router.navigate(['dashboard']);
            this.snackBar.open('Taak toegewezen', '', {
                duration: 3000,
                panelClass: 'snack-bar'
            });
        });
        this.closeDialogEmitter.emit(true);
    }

    public onSubmitResponse(test) {
        const data = this.processWorkflow.response.reply;
        data.body = test;
        data.template = this.template.response;

        this.tasksService.edit(data.id, data).subscribe((task) => {
            this.finalizeMessageWorkflow(task);
        });
    }

    public finalizeMessageWorkflow(task) {
        const relation = task.relatie;

        const data = {
            dossier: this.processWorkflow.response.dossier,
            message: this.task,
            reply: this.processWorkflow.response.reply,
            tasks: [],
            messageComment: {createdBy: this.task.createdById},
            knowledgeBaseAns: [],
            sendEmail: true,
            emailTemplateId: this.template.response.id,
            employeeProfile: {},
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
                sendEmailAfterProcess: this.emailIsChecked,
                closeDossierAfterProcess: this.closeDossierIsChecked
            }
        };

        this.tasksService.finalizeWorkflow(data).subscribe(() => {
                this.router.navigate(['dashboard']);
                this.snackBar.open('Antwoord verzonden', '', {
                    duration: 3000,
                    panelClass: 'snack-bar'
                });
                this.closeDialogEmitter.emit(true);
            }
        );
    }
}


