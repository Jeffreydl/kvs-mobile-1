import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {baseUrl} from '../base-api.service';
import {ITask} from './ITask';
import {map, shareReplay} from 'rxjs/operators';

export class TaskFilter {
    private state: string;
    private mailDirection: string;
    private direction: string;
    private order: string;
    private limit: number;
    private createdById: number;
    private isDraft: boolean;
    private closedById: number;
    private assigneeId: number;
    private endDate: string;
    private relatieId: number;
    private categoryIds: number[];

    public openTasks() {
        this.state = 'open';
        return this;
    }

    public closedTasks() {
        this.state = 'archived';
        return this;
    }

    public inboundTasks() {
        this.direction = 'inbound';
        return this;
    }

    public outboundTasks() {
        this.direction = 'outbound';
        return this;
    }

    public ascending() {
        this.mailDirection = 'ASC';
        return this;
    }

    public descending() {
        this.mailDirection = 'DESC';
        return this;
    }

    public orderbyCreatedDate() {
        this.order = 'createdDateTime';
        return this;
    }

    public orderbySla() {
        this.order = 'slaDateTime';
        return this;
    }

    public limitTo(limit: number) {
        this.limit = limit;
        return this;
    }

    public createdBy(id: number) {
        this.createdById = id;
        return this;
    }

    public closedBy(id: number) {
        this.closedById = id;
        return this;
    }

    public includeDrafts(isDraft: boolean) {
        this.isDraft = isDraft;
        return this;
    }

    public assignedTo(id: number) {
        this.assigneeId = id;
        return this;
    }

    public hasEndDate(endDate: string) {
        this.endDate = endDate;
        return this;
    }

    public forClient(relationId: number) {
        this.relatieId = relationId;
        return this;
    }

    public forCategories(categoryIds: number[]) {
        this.categoryIds = categoryIds;
        return this;
    }

    public toString(): string {
        const filter = {
            where: {
                and: []
            },
            order: [],
            limit: this.limit
        };
        if (this.limit == null) {
            this.limit = 20;
        }
        if (!this.order) {
            this.order = 'createdDateTime';
        }
        if (!this.direction) {
            this.direction = 'ASC';
        }
        if (this.state) {
            filter.where.and.push({
                state: this.state
            });
        }
        if (this.direction) {
            filter.where.and.push({
                direction: this.direction
            });
        }
        if (this.categoryIds && this.assigneeId) {
            filter.where.and.push({
                or: [{
                    messageCategoryId: {
                        inq: this.categoryIds
                    },
                    // assigneeId: this.assigneeId
                }]
            });
        }
        if (this.endDate) {
            filter.where.and.push({
                endDate: this.endDate
            });
        }
        if (this.relatieId) {
            filter.where.and.push({
                relatieId: this.relatieId
            });
        }
        if (this.isDraft) {
            filter.where.and.push({
                isDraft: this.isDraft
            });
        }

        if (this.order && this.mailDirection) {
            filter.order.push(this.order + ' ' + this.mailDirection);
        }
        return JSON.stringify(filter);
    }
}

const url = baseUrl + 'api/';

@Injectable({
    providedIn: 'root'
})
export class TasksService {
    public tasks: Observable<ITask[]>;
    public tasksLength = new BehaviorSubject<number>(null);
    private categories$;
    private channels$;
    private types$;
    private contactReasons$;

    constructor(private http: HttpClient) {}

    get categories() {
        if (!this.categories$) {
            this. categories$ = this.requestCategories();
        }
        return this.categories$;
    }

    get channels() {
        if (!this.channels$) {
            this. channels$ = this.requestMessageChannels();
        }
        return this.channels$;
    }

    get types() {
        if (!this.types$) {
            this. types$ = this.requestTypes();
        }
        return this.types$;
    }

    get contactReasons() {
        if (!this.contactReasons$) {
            this. contactReasons$ = this.requestContactReasons();
        }
        return this.contactReasons$;
    }

    public getAll(filter: TaskFilter): Observable<ITask[]> {
        this.tasks = this.http.get<ITask[]>(url + 'Messages?filter=' + filter).pipe(
            // shareReplay(),
            map((tasks) => {
                this.tasksLength.next(tasks.length);
                return tasks;
            })
        );
        console.log(this.tasks);
        return this.tasks;
    }

    public getTasksLength(): BehaviorSubject<number> {
        return this.tasksLength;
    }

    public new(formData: any) {
        if (!formData.subject) {
            formData.subject = '[nieuw]';
        }
        return this.http.post<any>(url + 'Messages', formData);
    }

    public edit(id: number, formData: any): Observable<ITask> {
        return this.http.patch<ITask>(url + 'Messages/' + id, formData);
    }

    public getById(id: number) {
        return this.http.get<any>(url + 'Messages/' + id);
    }

    public delete(id: number) {
        return this.http.delete<any>(url + 'Messages/' + id + '/deleteWithReason/0');
    }

    public assign(data: any) {
        return this.http.post(url + 'Messages/messageAssignment', data);
    }

    public requestCategories() {
        return this.http.get(url + 'Categories').pipe(
            shareReplay(1)
        );
    }

    public requestMessageChannels() {
        return this.http.get(url + 'MessageChannels').pipe(
            shareReplay(1)
        );
    }

    public requestTypes() {
        return this.http.get(url + 'Types').pipe(
            shareReplay(1)
        );
    }

    public requestContactReasons() {
        return this.http.get(url + 'ContactReasons').pipe(
            shareReplay(1)
        );
    }

    public processWorkflow(message) {
        const dossier = null;
        const reply = {subject: 'RE: ' + message.subject};
        const data = {message, reply, dossier};
        return this.http.post(url + 'Messages/processMessageWorkflow', message);
    }

    public finalizeWorkflow(data) {
        console.log(data);
        // const dossier;
        // const message;
        // const reply;
        // const sendEmail = true;
        // const emailTemplateId = 7;
        // const employeeProfile;
        // const closeDossierAfterProcess = true;
        // const publishtoWbs;
        // const recipients;

        // const tasks;
        // const messageComment;
        // const knowledgeBaseAns;

        // const data;

        return this.http.post(url + 'Messages/finalizeMessageWorkflow', data);
    }
}



//
// {"where":{"and":[{"state":"open"},{"direction":"inbound"},{"or":[{"messageCategoryId":{"inq":[8,1,2,3,4,7]},"assigneeId":15}]}]},"order":["createdDateTime DESC"],"limit":20}
// {"where":{"and":[{"state":"open"},{"direction":"inbound"},{"or":[{"messageCategoryId":{"inq":[8,1,2,3,4,7]}},{"assigneeId":15}]}]},"order":["slaDateTime  ASC","createdDateTime  ASC"],"limit":20,"ignoreDefaultIncludes":true,"includeGroup":"listview","include":["sender","relatie"]}
