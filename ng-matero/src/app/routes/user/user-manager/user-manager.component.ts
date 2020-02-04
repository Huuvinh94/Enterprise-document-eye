import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatPaginator, MatTableDataSource } from '@angular/material';
import { DialogService } from '@core/services/dialog.service';
import { UserService } from '@core/services/user.service';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'app-user-manager',
  templateUrl: './user-manager.component.html',
  styleUrls: ['./user-manager.component.scss']
})
export class UserManagerComponent implements OnInit {
  pageSize = 10;
  array: any;
  currentPage = 0;
  totalSize = 0;
  dataSource: any = [];
  displayedColumns: any = [];
  selectedRowIndex: any = -1;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  constructor(
    public userService: UserService,
    private dialog: MatDialog,
    private dialogService: DialogService
  ) { }

  ngOnInit() {
    this.displayedColumns = ['index', 'email', 'roleName', 'firstName', 'lastName', 'actions'];
    this.getAllUser();
  }

  private iterator() {
    const end = (this.currentPage + 1) * this.pageSize;
    const start = this.currentPage * this.pageSize;
    const part = this.array.slice(start, end);
    this.dataSource = part;
  }

  handlePage(e: any) {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    this.iterator();
  }

  selectionRow = (row: any, index: number) => {
    this.selectedRowIndex = index;
    // this.selection.toggle(row);
  }

  getAllUser() {
    this.userService.getListUser().subscribe(
      listUser => {
        this.dataSource = new MatTableDataSource<Element>(listUser);
        this.dataSource.paginator = this.paginator;
        this.array = listUser;
        this.totalSize = this.array.length;
        this.iterator();
      },
      err => {
      });
  }

  createUser() {
    this.userService.setInitFormGroup(true, null);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '40%';
    dialogConfig.data = {
      isEdit: false
    };
    this.dialog.open(UserFormComponent, dialogConfig).afterClosed()
      .subscribe(resClose => {
        if (resClose) {
          this.getAllUser();
        }
      });
  }


  onDelete(id: string) {
    this.dialogService.openConfirmDialog('Are you sure delete user', () => {
      this.userService.deleteUser(id).subscribe(
        resClose => {
          this.getAllUser();
        }
      );
    });
  }

  onEdit(id: string) {
    this.userService.getUserById(id).subscribe(
      userDetail => {
        if (userDetail === null) {
          return;
        }
        this.userService.setInitFormGroup(false, userDetail);
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.width = '40%';
        dialogConfig.data = {
          isEdit: true
        };
        this.dialog.open(UserFormComponent, dialogConfig).afterClosed()
          .subscribe(resClose => {
            if (resClose) {
              this.getAllUser();
            }
          });
      }
    );
  }
}
