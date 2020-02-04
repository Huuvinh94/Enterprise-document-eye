import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SurveyService } from '@core/services/survey.service';


@Component({
  selector: 'app-survey-sendmail',
  templateUrl: './survey-sendmail.component.html',
  styleUrls: ['./survey-sendmail.component.scss']
})
export class SurveySendMailComponent implements OnInit {

  @ViewChild('email', { static: true }) email: ElementRef;
  sendMailForm: FormGroup;
  loading: boolean;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public surveyService: SurveyService,
    public dialogRef: MatDialogRef<SurveySendMailComponent>,
    private fb: FormBuilder,
  ) {
    this.sendMailForm = this.fb.group({
      _id: [''],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    this.email.nativeElement.autofocus = true;
    this.sendMailForm.setValue(this.data);
  }

  /**
   * Event cancel
   */
  onBack() {
    this.dialogRef.close();
  }

  /**
   * Event submit send mail
   */
  onSubmit() {
    this.surveyService.sendMailSurvey(this.sendMailForm.value._id, this.sendMailForm.value.email).subscribe(
      res => {
        this.dialogRef.close();
      },
      err => {
      });
  }

}
