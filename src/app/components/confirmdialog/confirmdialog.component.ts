import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirmdialog.component.html',
  styleUrls: ['./confirmdialog.component.css']
})
export class ConfirmdialogComponent implements OnInit {
  title: string;
  message: string;
  btnCancel: string;
  btnOK: string;

  constructor(public dialogRef: MatDialogRef<ConfirmdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogModel) {
    dialogRef.disableClose = data.disableOutsideClose;
    this.title = data.title;
    this.message = data.message;
    this.btnCancel = data.btnCancel;
    this.btnOK = data.btnOk;
  }

  ngOnInit() {
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }
}


export class ConfirmDialogModel {

  constructor(public title: string, public message: string, public btnCancel: string, public btnOk: string, public disableOutsideClose?: boolean) {
  }
}
