import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {CustomersService} from '../../customers/customers.service';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {TasksService} from '../tasks.service';
import {Router} from '@angular/router';

@AutoUnsubscribe()
@Component({
  selector: 'app-current-task',
  templateUrl: './current-task-dialog.component.html',
  styleUrls: ['./current-task-dialog.component.scss']
})
export class CurrentTaskDialogComponent implements OnInit, OnDestroy {
  public task: any;
  private relatieId: number;

  constructor(
      public dialogRef: MatDialogRef<CurrentTaskDialogComponent>,
      private customersService: CustomersService,
      private tasksService: TasksService,
      private router: Router,
      @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    this.task = this.data.task;
    console.log(this.task);
    this.relatieId = this.data.task.relatieId;
    this.customersService.getById(this.relatieId);
  }

  ngOnDestroy(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

    public deleteTask(id: any) {
        this.tasksService.delete(id).subscribe();
        this.dialogRef.close();
    }
}
