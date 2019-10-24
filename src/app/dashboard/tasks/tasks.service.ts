import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {KennisbankItemServer} from '../kennisbank-searchbar/kennisbank.model';

// const baseUrl = 'https://kvsapi-demo.hexia.io/api/Messages?filter=%7B%22where%22%3A%7B%22and%22%3A%5B%7B%22state%22%3A%22open%22%7D%2C%7B%22direction%22%3A%22inbound%22%7D%2C%7B%22or%22%3A%5B%7B%22messageCategoryId%22%3A%7B%22inq%22%3A%5B2%2C3%2C7%2C8%2C4%2C1%5D%7D%7D%2C%7B%22assigneeId%22%3A13%7D%5D%7D%5D%7D%2C%22order%22%3A%5B%22slaDateTime%20%20ASC%22%2C%22createdDateTime%20%20ASC%22%5D%2C%22limit%22%3A15%7D';
const baseUrl = 'https://kvsapi-demo.hexia.io/api/Messages?filter=';
export class TaskFilter {
  state: string;
  maildirection: string;
  direction: string;
  property: string;
  messageCategoryId: number[];
  order: [];
  limit: number;
  relatieId: number;
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

  public forRelation(relatieId: number) {
    this.relatieId = relatieId;
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

  public descending() {
    this.maildirection = 'desc';
    return this;
  }

  public ascending() {
    this.maildirection = 'asc';
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
    if (this.relatieId) {
      filter.where.and.push({
        relatieId: this.relatieId
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
    if (this.property && this.maildirection) {
      filter.order.push(this.property + ' ' + this.maildirection);
    }
    return JSON.stringify(filter);
  }
}



@Injectable({
  providedIn: 'root'
})
export class TasksService {
  filter = {where: {state: 'open', isDraft: false}, order: 'slaDateTime ASC'};

  constructor(private http: HttpClient) {
  }

  getAll(): Observable<any> {
    return this.http.get(baseUrl + JSON.stringify(this.filter));
  }

}
