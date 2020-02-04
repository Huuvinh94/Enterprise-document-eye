import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { isNullOrUndefined } from 'util';
@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }

  openConfirmDialog(msg: string, callbackYes = null, callbackNo = null) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '380px',
      disableClose: true,
      panelClass: 'confirm-dialog-container',
      autoFocus: true,
      position: {
        top: '50px'
      },
      data: {
        message: msg
      }
    });
    // check call back function and call function
    if (typeof callbackYes === 'function' || typeof callbackNo === 'function') {
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          if (!isNullOrUndefined(callbackYes)) {
            callbackYes();
          }
        } else {
          if (!isNullOrUndefined(callbackNo)) {
            callbackNo();
          }
        }
      });
    }
  }

  closeConfirmDialog() {
    this.dialog.closeAll();
  }
}
