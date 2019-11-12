import {Injectable} from '@angular/core';
import {baseUrl} from '../base-api.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TaskFilter} from '../tasks/tasks.service';

export class DossierFilter {
    private state: string;
    private property: string;
    private direction: string;
    private relatieId: number;
    private limit: number;

    public openDossiers() {
        this.state = 'open';
        return this;
    }

    public orderbySla() {
        this.property = 'slaDateTime';
        return this;
    }

    public orderbyEndDate() {
        this.property = 'endDate';
        return this;
    }

    public orderByCreationDate() {
        this.property = 'startDate';
        return this;
    }

    public closedDossiers() {
        this.state = 'closed';
        return this;
    }

    public descending() {
        this.direction = 'desc';
        return this;
    }

    public ascending() {
        this.direction = 'asc';
        return this;
    }

    public forRelation(relatieId: number) {
        this.relatieId = relatieId;
        return this;
    }

    public limitTo(limit: number) {
        this.limit = limit;
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

        filter.where.and.push({or: []});
        if (this.limit == null) {
            this.limit = 50;
        }
        if (this.state) {
            filter.where.and.push({
                state: this.state
            });
        }
        if (this.relatieId) {
            filter.where.and.push({
                relatieId: this.relatieId
            });
        }
        if (this.property && this.direction) {
            filter.order.push(this.property + ' ' + this.direction);
        }
        return JSON.stringify(filter);
    }
}

const url = baseUrl + 'api/';

@Injectable({
    providedIn: 'root'
})
export class DossierService {
    constructor(private http: HttpClient) {
    }

    public getAll(filter: DossierFilter): Observable<any> {
        return this.http.get(url + 'Dossiers?filter=' + filter);
    }
}
