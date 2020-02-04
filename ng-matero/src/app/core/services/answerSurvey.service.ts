import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';
import { environment } from '@env/environment';
import { Common } from 'app/common/common';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
}
@Injectable({
  providedIn: 'root'
})
export class AnswerSurveyService {

  baseUrl = environment.SERVER_URL;
  matcher = new MyErrorStateMatcher();

  constructor(
    private http: HttpClient,
    private common: Common
  ) {
  }

  saveAnswerSurvey(answerContent: string, id: any) {
    const answerSurvey = {
      surveyId: id,
      content: answerContent,
      dateDone: new Date()
    };
    return this.http.post<any>(this.baseUrl + '/saveAnswerSurvey', answerSurvey)
      .pipe(map(res => {
        this.common.messageExecute(res);
        if (res && res.statusCode === 200) {
          return res;
        }

        return null;
      }), catchError(err => {
        const error = err.error.message || err.statusText;
        this.common.messageExecute(err);
        return throwError(error);
      }));
  }

  getAnswerSurveyBySurveyId(id: string) {
    return this.http.get<any>(this.baseUrl + '/getAnswerSurveyBySurveyId', { params: { _id: id } })
      .pipe(map((res: any) => {
        let listAnswer = [];
        if (res && res.statusCode === 200 && res.listAnswer) {
          listAnswer = res.listAnswer;
        }
        return listAnswer;
      }), catchError(err => {
        const error = err.error.message || err.statusText;
        this.common.messageExecute(err);
        return throwError(error);
      }));
  }

  /**
   * Delete Answer Survey
   */
  deleteAnswerSurvey(id: string) {
    return this.http.post<any>(this.baseUrl + '/deleteAnswerSurvey', { _id: id })
      .pipe(map((res: any) => {
        this.common.messageExecute(res);
        if (res && res.statusCode === 200) {
          return res;
        }
        return null;

      }), catchError(err => {
        const error = err.error.message || err.statusText;
        this.common.messageExecute(err);
        return throwError(error);
      }));
  }
}
