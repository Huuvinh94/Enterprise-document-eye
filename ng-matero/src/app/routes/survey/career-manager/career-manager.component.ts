import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatTableDataSource } from '@angular/material';
import { CareerService } from '@core/services/career.service';
import { DialogService } from '@core/services/dialog.service';
import { CareerFormComponent } from '../career-form/career-form.component';

@Component({
  selector: 'app-career-manager',
  templateUrl: './career-manager.component.html',
  styleUrls: ['./career-manager.component.scss']
})
export class CareerManagerComponent implements OnInit {
  dataSource: any = [];
  displayedColumns: any = [];
  selectedRowIndex: any = -1;
  constructor(
    private dialog: MatDialog,
    private dialogService: DialogService,
    public careerService: CareerService) {
  }
  ngOnInit() {
    this.displayedColumns = ['index', 'careerName', 'userCreate', 'actions'];
    this.getAllCareer();
  }

  createSurvey(id: string) {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '40%';
    dialogConfig.data = {
      isEdit: false
    };
    this.dialog.open(CareerFormComponent, dialogConfig).afterClosed()
      .subscribe(resClose => {
        this.getAllCareer();
      });
  }

  getAllCareer() {
    this.careerService.getAllCareer().subscribe(
      listCareer => {
        this.dataSource = new MatTableDataSource<Element>(listCareer);
        // this.dataSource.paginator = this.paginator;
        // this.array = listUser;
        // this.totalSize = this.array.length;
        // this.iterator();
      },
      err => {
      });
  }

  selectionRow = (row: any, index: number) => {
    this.selectedRowIndex = index;
  }

  onDelete(id: string) {
    this.dialogService.openConfirmDialog('Are you sure delete question', () => {
      this.careerService.deleteCareer(id).subscribe(
        resClose => {
          this.getAllCareer();
        }
      );
    });
  }

  onEdit(id: string) {
    this.careerService.getCareerById(id).subscribe(
      careerDetail => {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.width = '40%';
        dialogConfig.data = {
          isEdit: true,
          careerDetail: JSON.stringify(careerDetail)
        };
        this.dialog.open(CareerFormComponent, dialogConfig).afterClosed()
          .subscribe(resClose => {
            if (resClose) {
              this.getAllCareer();
            }
          });
      }
    );

  }
}
