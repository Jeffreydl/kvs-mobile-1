import {Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';

@AutoUnsubscribe()
@Component({
  selector: 'app-tasks-searchbar',
  templateUrl: './tasks-searchbar.component.html',
  styleUrls: ['./tasks-searchbar.component.scss']
})
export class TasksSearchbarComponent implements OnInit, OnDestroy {
  @ViewChild('search', {static: true}) searchField: ElementRef;
    @Output() filterEmitter = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
    this.searchField.nativeElement.focus();
  }

  ngOnDestroy() {}

    applyFilter(filterValue: string) {
      this.filterEmitter.emit(filterValue);
    }
}
