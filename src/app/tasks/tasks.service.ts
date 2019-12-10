import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {baseUrl} from '../base-api.service';
import {ITask} from './ITask';
import {map} from 'rxjs/operators';

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
        if (this.assigneeId) {
            filter.where.and.push({
                assigneeId: this.assigneeId
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

        filter.where.and.push({
            isDraft: this.isDraft
        });

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
    data;
    public tasks: Observable<ITask[]>;
    public tasksLength = new BehaviorSubject<number>(null);

    constructor(private http: HttpClient) {}

    public getAll(filter: TaskFilter): Observable<ITask[]> {
        this.tasks = this.http.get<ITask[]>(url + 'Messages?filter=' + filter).pipe(
            map((tasks) => {
                this.tasksLength.next(tasks.length);
                return tasks;
            })
        );
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

    public edit(id: number, formData: any) {

        // const formData = {
            // body: 'a',
            // contactReasonId: 3,
            // createdDateTime: new Date(),
            // dossierId: 62,
            // id: id,
            // relatieId: 26,
            // typeId: 1,
            // parentContactReason: {
            //     name: 'Algemeen',
            //     id: 3,
            //     parentId: null,
            //     deletedAt: null
            // },
        // };
        return this.http.patch(url + 'Messages/' + id, formData);
    }

    public getById(id: number) {
        return this.http.get<any>(url + 'Messages/' + id);
    }

    public delete(id: number) {
        console.log(id);
        return this.http.delete<any>(url + 'Messages/' + id + '/deleteWithReason/0');
    }

    public getCategories() {
        return this.http.get(url + 'Categories');
    }

    public getMessageChannels() {
        return this.http.get(url + 'MessageChannels');
    }

    public getTypes() {
        return this.http.get(url + 'Types');
    }

    public getContactReasons() {
        return this.http.get(url + 'ContactReasons');
    }

    public getDossierCategories() {
        return this.http.get(url + 'Dossiercategories');
    }

}
