import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {baseUrl} from '../base-api.service';

export class TaskFilter {
  state: string;
  mailDirection: string;
  direction: string;
  order: string;
  limit: number;
  createdById: number;
  isDraft: boolean;
  closedById: number;
  endDate: string;

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

  public includeDrafts(isDraft) {
    this.isDraft = isDraft;
    return this;
  }

  public hasEndDate(endDate: string) {
    this.endDate = endDate;
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
    if (this.endDate) {
      filter.where.and.push({
        endDate: this.endDate
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
  // filter = {where: {state: 'open', isDraft: false}, order: 'slaDateTime ASC'};
  categories;

  constructor(private http: HttpClient) {
  }

  getAll(filter: TaskFilter): Observable<any> {
    return this.http.get(url + 'Messages?filter=' + filter);
  }

  new() {
  }

  getCategories() {
    return this.http.get(url + 'Categories');
  }
  getMessageChannels() {
    return this.http.get(url + 'MessageChannels');
  }
  getTypes() {
    return this.http.get(url + 'Types');
  }
  getContactReasons() {
    return this.http.get(url + 'ContactReasons');
  }
  getDossierCategories() {
    return this.http.get(url + 'Dossiercategories');
  }

}
