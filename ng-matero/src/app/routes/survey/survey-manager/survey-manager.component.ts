import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatTableDataSource } from '@angular/material';
import { DialogService } from '@core/services/dialog.service';
import { SurveyService } from '@core/services/survey.service';
import { AnswerSurveyComponent } from '../answer-survey/answer-survey.component';
import { SurveyBuilderComponent } from '../survey-builder/survey-builder.component';
import { SurveySendMailComponent } from '../survey-sendmail/survey-sendmail.component';
import { SurveyComponent } from '../survey/survey.component';

@Component({
  selector: 'app-survey-manager',
  templateUrl: './survey-manager.component.html',
  styleUrls: ['./survey-manager.component.scss']
})
export class SurveyManagerComponent implements OnInit {
  dataSource: any = [];
  displayedColumns: any = [];
  selectedRowIndex: any = -1;
  constructor(
    private dialog: MatDialog,
    private dialogService: DialogService,
    public surveyService: SurveyService) {
  }

  ngOnInit() {
    this.displayedColumns = ['index', 'surveyName', 'careerName', 'userCreate', 'actions'];
    this.getListSurvey();
  }

  /**
   * Create new survey
   */
  createSurvey() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '70%';
    dialogConfig.data = {
      isEdit: false
    };
    this.dialog.open(SurveyBuilderComponent, dialogConfig).afterClosed()
      .subscribe(resClose => {
        this.getListSurvey();
      });
  }

  /**
   * Get list survey
   */
  getListSurvey() {
    this.surveyService.getListSurvey().subscribe(
      listSurvey => {
        this.dataSource = new MatTableDataSource<Element>(listSurvey);
        // this.dataSource.paginator = this.paginator;
        // this.array = listUser;
        // this.totalSize = this.array.length;
        // this.iterator();
      },
      err => {
      });
  }

  /**
   * Event select row at table
   */
  selectionRow = (row: any, index: number) => {
    this.selectedRowIndex = index;
    // this.selection.toggle(row);
  }

  /**
   * Handle delete
   */
  onDelete(id: string) {
    this.dialogService.openConfirmDialog('Xác nhận xóa biểu mẫu', () => {
      this.surveyService.deleteSurvey(id).subscribe(
        resClose => {
          this.getListSurvey();
        }
      );
    });
  }

  /**
   * Handle preview
   */
  onPreview(id: string, contentSurvey: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '40%';
    dialogConfig.data = {
      isEdit: true,
      content: contentSurvey
    };
    this.dialog.open(SurveyComponent, dialogConfig).afterClosed()
      .subscribe(resClose => {
        if (resClose) {
        }
      });
  }

  /**
   * Handle edit
   */
  onEdit(id: string, contentSurvey: string, careerid: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '70%';
    dialogConfig.data = {
      isEdit: true,
      content: contentSurvey,
      careerId: careerid,
      _id: id
    };
    this.dialog.open(SurveyBuilderComponent, dialogConfig).afterClosed()
      .subscribe(resClose => {
        if (resClose) {
          this.getListSurvey();
        }
      });
  }

  /**
   * Open modal send mail
   */
  openModalSendMail(id: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    dialogConfig.data = {
      email: '',
      _id: id
    };
    this.dialog.open(SurveySendMailComponent, dialogConfig).afterClosed()
      .subscribe(resClose => {
        if (resClose) {
          this.getListSurvey();
        }
      });
  }

  /**
   * Handle open Modal Answer
   */
  openModalAnswer(id: string, contentSurvey: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '95%';
    dialogConfig.height = '95%';
    dialogConfig.data = {
      isEdit: true,
      content: contentSurvey,
      _id: id
    };
    this.dialog.open(AnswerSurveyComponent, dialogConfig).afterClosed()
      .subscribe(resClose => {
        if (resClose) {
        }
      });
  }
}
