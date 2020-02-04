import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CareerManagerComponent } from './career-manager/career-manager.component';
import { QuestionBankManagerComponent } from './question-bank-manager/question-bank-manager.component';
import { SurveyManagerComponent } from './survey-manager/survey-manager.component';

const routes: Routes = [
  { path: 'survey-manager', component: SurveyManagerComponent },
  { path: 'question-bank-manager', component: QuestionBankManagerComponent },
  { path: 'career-manager', component: CareerManagerComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SurveyRoutingModule { }
