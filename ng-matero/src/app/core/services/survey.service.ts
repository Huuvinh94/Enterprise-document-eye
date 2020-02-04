import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm } from '@angular/forms';
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
export class SurveyService {

  baseUrl = environment.SERVER_URL;
  userFormLogin: FormGroup;
  userFormCreate: FormGroup;
  matcher = new MyErrorStateMatcher();

  constructor(
    private http: HttpClient,
    private common: Common
  ) {
  }

  /**
   * Get list survey
   */
  getListSurvey() {
    return this.http.get<any>(this.baseUrl + '/getListSurvey')
      .pipe(map((res: any) => {
        console.log(res);
        let listSurvey = [];
        if (res && res.statusCode === 200 && res.listSurvey) {
          listSurvey = res.listSurvey;
        }
        return listSurvey;
      }), catchError(err => {
        const error = err.error.message || err.statusText;
        this.common.messageExecute(err);
        return throwError(error);
      }));
  }

  /**
   * Delete survey
   */
  deleteSurvey(id: string) {
    return this.http.post<any>(this.baseUrl + '/deleteSurvey', { _id: id })
      .pipe(map((res: any) => {
        this.common.messageExecute(res);
        if (res && res.statusCode === 200 && res.userDetail) {
          return res;
        }
        return null;

      }), catchError(err => {
        const error = err.error.message || err.statusText;
        this.common.messageExecute(err);
        return throwError(error);
      }));
  }

  /**
   * Save survey
   */
  saveSurvey(survey: any) {
    return this.http.post<any>(this.baseUrl + '/saveSurvey', survey)
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

  /**
   * Edit survey
   * @param survey survey data
   */
  editSurvey(survey: any) {
    return this.http.post<any>(this.baseUrl + '/editSurvey', survey)
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

  /**
   * send mail
   * @param id id
   * @param emailReceive email receive
   */
  sendMailSurvey(id: string, emailReceive: string) {
    return this.http.post<any>(this.baseUrl + '/sendMailSurvey', { _id: id, email: emailReceive })
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


  getSurveyById(id: string) {
    return this.http.get<any>(this.baseUrl + '/getSurveyById', { params: { _id: id } })
      .pipe(map((res: any) => {
        let data = {};
        if (res && res.statusCode === 200 && res.surveyDetail) {
          data = res.surveyDetail;
        }
        return data;
      }), catchError(err => {
        const error = err.error.message || err.statusText;
        this.common.messageExecute(err);
        return throwError(error);
      }));
  }
}
