import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {KennisbankItemServer} from '../../kennisbank/kennisbank.model';

export class TaskFilter {
  state: string;
  mailDirection: string;
  direction: string;
  property: string;
  messageCategoryId: number[];
  order: [];
  limit: number;
  relationId: number;
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

  public forRelation(relationId: number) {
    this.relationId = relationId;
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
    this.property = 'createdDateTime';
    return this;
  }

  public orderbySla() {
    this.property = 'slaDateTime';
    return this;
  }

  public forMessageCategoryId(categoryId: number[]) {
    this.messageCategoryId = categoryId;
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
      this.limit = 50;
    }
    if (!this.property) {
      this.property = 'createdDateTime';
    }
    if (!this.direction) {
      this.direction = 'asc';
    }
    if (this.state) {
      filter.where.and.push({
        state: this.state
      });
    }
    if (this.relationId) {
      filter.where.and.push({
        relationId: this.relationId
      });
    }
    if (this.createdById) {
      filter.where.and.push({
        createdById: this.createdById
      });
    }
    if (this.direction) {
      filter.where.and.push({
        direction: this.direction
      });
    }

    if (this.closedById) {
      filter.where.and.push({
        closedById: this.closedById
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

    if (this.messageCategoryId) {
      filter.where.and.push({
            or: [
              {
                messageCategoryId: {
                  inq: this.messageCategoryId
                }
              }
            ]
          }
      );
    }
    if (this.property && this.mailDirection) {
      filter.order.push(this.property + ' ' + this.mailDirection);
    }
    return JSON.stringify(filter);
  }
}

const baseUrl = 'https://kvsapi-demo.hexia.io/api/';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  // filter = {where: {state: 'open', isDraft: false}, order: 'slaDateTime ASC'};
  categories;

  constructor(private http: HttpClient) {
  }

  getAll(filter: TaskFilter): Observable<any> {


    return this.http.get(baseUrl + 'Messages?filter=' + filter);
  }

  new() {
  }

  getCategories() {
    return this.http.get(baseUrl + 'Categories');
  }
  getMessageChannels() {
    return this.http.get(baseUrl + 'MessageChannels');
  }
  getTypes() {
    return this.http.get(baseUrl + 'Types');
  }
  getContactReasons() {
    return this.http.get(baseUrl + 'ContactReasons');
  }
  getDossierCategories() {
    return this.http.get(baseUrl + 'Dossiercategories');
  }

}
