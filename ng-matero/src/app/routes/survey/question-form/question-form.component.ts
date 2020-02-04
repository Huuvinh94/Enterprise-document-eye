import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CareerService } from '@core/services/career.service';
import { DialogService } from '@core/services/dialog.service';
import { QuestionService } from '@core/services/question.service';


@Component({
  selector: 'app-question-form',
  templateUrl: './question-form.component.html',
  styleUrls: ['./question-form.component.scss']
})
export class QuestionFormComponent implements OnInit {

  @ViewChild('content', { static: true }) content: ElementRef;
  questionForm: FormGroup;
  loading: boolean;
  selectedCareer: any;
  listCareer: any = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public questionService: QuestionService,
    public careerService: CareerService,
    public dialogRef: MatDialogRef<QuestionFormComponent>,
    private fb: FormBuilder,
    private dialogService: DialogService,
  ) {
    this.questionForm = this.fb.group({
      _id: [''],
      content: ['', [Validators.required]],
      careerId: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.content.nativeElement.autofocus = true;
    this.careerService.getQuestCareer().subscribe(res => {
      this.listCareer = res;

      if (this.listCareer.length > 0) {
        this.selectedCareer = this.listCareer[0]._id;
      }
      // Mode edit
      if (this.data.isEdit) {
        this.questionForm.setValue(JSON.parse(this.data.questDetail));
      }
    });
  }

  onBack() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.questionForm.valid) {
      const strConfirm = !this.data.isEdit ? 'create' : 'edit';
      this.dialogService.openConfirmDialog('Are you sure ' + strConfirm + ' ?', () => {
        if (this.data.isEdit) {
          this.questionService.editQuest(this.questionForm.value)
            .subscribe(
              res => {
                if (res) {
                  this.dialogRef.close(true);
                }
              }
            );
        } else {
          this.loading = true;
          this.questionService.createQuestion(this.questionForm.value)
            .subscribe(
              res => {
                this.loading = false;
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
