import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {CustomersService} from '../../customers/customers.service';

@Component({
  selector: 'app-current-task',
  templateUrl: './current-task-dialog.component.html',
  styleUrls: ['./current-task-dialog.component.scss']
})
export class CurrentTaskDialogComponent implements OnInit {
  public task: any;
  private relatieId: number;

  constructor(
      public dialogRef: MatDialogRef<CurrentTaskDialogComponent>,
      private customersService: CustomersService,
      @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    this.task = this.data.task;
    console.log(this.task);
    this.relatieId = this.data.task.relatieId;
    this.customersService.getById(this.relatieId);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
