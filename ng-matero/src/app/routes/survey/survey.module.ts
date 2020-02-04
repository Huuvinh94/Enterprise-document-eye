import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { AnswerSurveyComponent } from './answer-survey/answer-survey.component';
import { CareerFormComponent } from './career-form/career-form.component';
import { CareerManagerComponent } from './career-manager/career-manager.component';
import { QuestionBankManagerImportComponent } from './question-bank-manager-import/question-bank-manager-import.component';
import { QuestionBankManagerComponent } from './question-bank-manager/question-bank-manager.component';
import { QuestionFormComponent } from './question-form/question-form.component';
import { SurveyBuilderComponent } from './survey-builder/survey-builder.component';
import { SurveyManagerComponent } from './survey-manager/survey-manager.component';
import { SurveyRoutingModule } from './survey-routing.module';
import { SurveySendMailComponent } from './survey-sendmail/survey-sendmail.component';
import { SurveyComponent } from './survey/survey.component';

const COMPONENTS = [SurveyManagerComponent, QuestionBankManagerComponent, CareerManagerComponent, QuestionBankManagerImportComponent];
const COMPONENTS_DYNAMIC = [AnswerSurveyComponent, SurveySendMailComponent, SurveyBuilderComponent, SurveyComponent, CareerFormComponent, QuestionFormComponent];

@NgModule({
  imports: [
    SharedModule,
    SurveyRoutingModule,
    MaterialFileInputModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_DYNAMIC
  ],
  entryComponents: COMPONENTS_DYNAMIC
})
export class SurveyModule { }
