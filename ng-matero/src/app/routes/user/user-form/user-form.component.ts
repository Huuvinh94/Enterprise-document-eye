import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { User } from '@core/models';
import { DialogService } from '@core/services/dialog.service';
import { UserService } from '@core/services/user.service';


@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {

  @ViewChild('firstName', { static: true }) firstName: ElementRef;
  loading: boolean;
  user = new User();
  listRole: Array<any> = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public auth: UserService,
    public dialogRef: MatDialogRef<UserFormComponent>,
    private router: Router,
    private dialogService: DialogService,
  ) { }

  ngOnInit() {
    this.firstName.nativeElement.autofocus = true;

    this.auth.getRoleList().subscribe(res => {
      this.listRole = res.data;
    });
  }

  onBack() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.auth.userFormCreate.valid) {
      const strConfirm = !this.data.isEdit ? 'create' : 'edit';
      this.dialogService.openConfirmDialog('Are you sure ' + strConfirm + ' ?', () => {
        if (this.data.isEdit) {
          this.auth.editUser(this.auth.userFormCreate.value)
            .subscribe(
              res => {
                if (res) {
                  this.dialogRef.close(true);
                }
              }
            );
        } else {
          this.loading = true;
          this.auth.registerUser(this.auth.userFormCreate.value)
            .subscribe(
              res => {
                if (res) {
                  this.dialogRef.close(true);
                }
              }
            );
        }
      });
    }
  }
}
