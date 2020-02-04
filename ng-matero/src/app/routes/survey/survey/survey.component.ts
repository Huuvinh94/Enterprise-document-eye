import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import * as Survey from 'survey-angular';
@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss']
})
export class SurveyComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data) {
  }
  surveyJSON: any = {};

  ngOnInit() {
    if (this.data.content) {
      this.surveyJSON = this.data.content;
    }
    Survey.StylesManager.applyTheme('default');
    const survey = new Survey.Model(this.surveyJSON);
    survey.onComplete.add(sendDataToServer);
    Survey.SurveyNG.render('surveyElement', { model: survey });

    function sendDataToServer(result) {
      const resultAsString = JSON.stringify(result.data);
      alert(resultAsString);
    }
  }
}
