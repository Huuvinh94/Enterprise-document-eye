import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { CareerService } from '@core/services/career.service';
import { QuestionService } from '@core/services/question.service';
import { Constant } from 'app/common/constant';
import { FileValidator } from 'ngx-material-file-input';
import { Common } from './../../../common/common';

@Component({
  selector: 'app-question-bank-manager-import',
  templateUrl: './question-bank-manager-import.component.html',
  styleUrls: ['./question-bank-manager-import.component.scss']
})
export class QuestionBankManagerImportComponent implements OnInit {
  dataSource = new MatTableDataSource<any>();;
  selectedRowIndex: any = -1;
  formDoc: FormGroup;
  displayedColumns = ['index', 'content', 'careerName'];
  listCareer = [];
  @Output() changeView: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(
    private _fb: FormBuilder,
    private questionService: QuestionService,
    public careerService: CareerService,
    private common: Common
  ) { }

  ngOnInit() {
    this.formDoc = this._fb.group({
      requiredFile: [
        undefined,
        [Validators.required, FileValidator.maxContentSize(Constant.maxSize)]
      ]
    });

    this.careerService.getQuestCareer().subscribe(res => {
      this.listCareer = res;
    });
  }

  /**
   * Event change input file
   * @param event event
   */
  changeFileInput(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      const formData: FormData = new FormData();
      formData.append('fileUpload', file, file.name);

      this.questionService.readFileExcel(formData)
        .subscribe(
          res => {
            this.dataSource = new MatTableDataSource<Element>(res.data);
          });
    }
  }

  /**
   * Hight line when selected row
   */
  selectionRow = (row: any, index: number) => {
    this.selectedRowIndex = index;
  }

  back() {
    this.changeView.emit(false);
  }

  save() {
    this.questionService.importQuestion(this.dataSource.data).subscribe(
      res => {
        if (res) {
          this.common.messageExecute(res);
          this.dataSource = new MatTableDataSource<Element>([]);
        }
      }
    ).unsubscribe();
  }
}
