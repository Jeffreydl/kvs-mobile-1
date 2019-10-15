import {AfterViewInit, Component, OnInit} from '@angular/core';
import { KennisbankService } from './kennisbank.service';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  data;
  private search$ = new Subject<string>();

  constructor(private kennisbankAPIService: KennisbankService) { }

  ngOnInit() {}

  ngAfterViewInit() {
    // this.search$.pipe(
    //     debounceTime(200),
    //     distinctUntilChanged()
    // ).subscribe(
    //     (filterValue: string) => {
    //       this.dataSource.filter = filterValue.trim().toLowerCase();
    //     }
    // );
  }

  searchKennisbank() {
    this.kennisbankAPIService.getKennisbankItems();
  }

  applyFilter(filterValue: string) {
    this.search$.next(filterValue);
  }
}
