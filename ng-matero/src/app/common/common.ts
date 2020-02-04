import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
@Injectable()
export class Common {

    constructor(
        private dialog: MatDialog,
        private snackBar: MatSnackBar
    ) { }

    config: MatSnackBarConfig = {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
    };

    openConfirmDialog = (msg: string, callbackYes = null, callbackNo = null) => {
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
                    if (callbackYes !== null && callbackYes !== undefined) {
                        callbackYes();
                    }
                } else {
                    if (callbackNo !== null && callbackNo !== undefined) {
                        callbackNo();
                    }
                }
            });
        }
    }

    messageExecute = (res: any = null) => {
        this.config.panelClass = ['success-sackBar'];
        if (res.statusCode !== 200 && res !== null) {
            this.config.panelClass = 'error-sackBar';
        }
        this.snackBar.open(res.statusText, '', this.config);
    }
}
