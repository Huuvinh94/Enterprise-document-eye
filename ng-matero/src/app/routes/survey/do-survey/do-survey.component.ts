import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnswerSurveyService } from '@core/services/answerSurvey.service';
import { SurveyService } from '@core/services/survey.service';
import * as Survey from 'survey-angular';
@Component({
  selector: 'app-do-survey',
  templateUrl: './do-survey.component.html',
  styleUrls: ['./do-survey.component.scss']
})
export class DoSurveyComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    public surveyService: SurveyService,
    public answerSurveyService: AnswerSurveyService
  ) {
  }
  surveyJSON: any = {};

  ngOnInit() {
    const self = this;
    const idSurvey = this.route.snapshot.paramMap.get('id');
    this.surveyService.getSurveyById(idSurvey).subscribe(
      res => {
        Survey.StylesManager.applyTheme('default');
        // tslint:disable-next-line: no-string-literal
        const survey = new Survey.Model(JSON.parse(res['content']));
        survey.onComplete.add(sendDataToServer);
        Survey.SurveyNG.render('surveyElement', { model: survey });

        function sendDataToServer(result) {

          const resultAsString = result.data;
          survey.getAllQuestions().forEach(item => {
            // if user don't andwer then set ''
            if (resultAsString[item.name] === undefined) {
              resultAsString[item.name] = '';
            }
          });
          self.answerSurveyService.saveAnswerSurvey(JSON.stringify(resultAsString), idSurvey).subscribe(
            saveRes => {

            });
          // alert(resultAsString);
        }
      }
    );
  }
}
