import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
    selector: 'app-deletion-dialog',
    templateUrl: './deletion-dialog.component.html',
    styleUrls: ['./deletion-dialog.component.scss']
})
export class DeletionDialogComponent implements OnInit {

    constructor(public dialogRef: MatDialogRef<DeletionDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    ngOnInit() {
    }

    public onNoClick(): void {
      this.dialogRef.close(false);
    }

  public onYesClick() {
    this.dialogRef.close(true);
  }
}
