import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatTableDataSource } from '@angular/material';
import { DialogService } from '@core/services/dialog.service';
import { QuestionService } from '@core/services/question.service';
import { Common } from 'app/common/common';
import { QuestionFormComponent } from '../question-form/question-form.component';

@Component({
  selector: 'app-question-bank-manager',
  templateUrl: './question-bank-manager.component.html',
  styleUrls: ['./question-bank-manager.component.scss']
})
export class QuestionBankManagerComponent implements OnInit {
  dataSource: any = [];
  displayedColumns: any = [];
  selectedRowIndex: any = -1;
  isImport = false;
  constructor(
    private dialog: MatDialog,
    private dialogService: DialogService,
    public questionService: QuestionService,
    private common: Common) {
  }
  ngOnInit() {
    this.displayedColumns = ['index', 'content', 'careerName', 'userCreate', 'actions'];
    this.getAllQuestion();
  }

  createSurvey(id: string) {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '40%';
    dialogConfig.data = {
      isEdit: false
    };
    this.dialog.open(QuestionFormComponent, dialogConfig).afterClosed()
      .subscribe(resClose => {
        this.getAllQuestion();
      });
  }

  getAllQuestion() {
    this.questionService.getAllQuestion().subscribe(
      listQuest => {
        this.dataSource = new MatTableDataSource<Element>(listQuest);
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
      this.questionService.deleteQuestion(id).subscribe(
        resClose => {
          this.getAllQuestion();
        }
      );
    });
  }

  onEdit(id: string) {
    this.questionService.getQuestById(id).subscribe(
      questDetail => {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.width = '40%';
        dialogConfig.data = {
          isEdit: true,
          questDetail: JSON.stringify(questDetail)
        };
        this.dialog.open(QuestionFormComponent, dialogConfig).afterClosed()
          .subscribe(resClose => {
            if (resClose) {
              this.getAllQuestion();
            }
          });
      }
    );
  }

  exportsQuestions() {
    this.questionService.exportsQuestions();
  }

  changeView(isView) {
    this.isImport = isView;
  }
}
