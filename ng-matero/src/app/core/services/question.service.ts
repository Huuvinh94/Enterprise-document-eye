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
export class QuestionService {

  baseUrl = environment.SERVER_URL;
  userFormLogin: FormGroup;
  userFormCreate: FormGroup;
  matcher = new MyErrorStateMatcher();

  constructor(
    private http: HttpClient,
    private common: Common
  ) {
  }

  getAllQuestion() {
    return this.http.get<any>(this.baseUrl + '/getAllQuestion')
      .pipe(map((res: any) => {
        let listQuest = [];
        if (res && res.statusCode === 200 && res.data) {
          listQuest = res.data;
        }
        return listQuest;
      }), catchError(err => {
        const error = err.error.message || err.statusText;
        this.common.messageExecute(err);
        return throwError(error);
      }));
  }

  deleteQuestion(id: string) {
    return this.http.post<any>(this.baseUrl + '/deleteQuestion', { _id: id })
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

  createQuestion(question: any) {
    return this.http.post<any>(this.baseUrl + '/createQuestion', question)
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

  getQuestById(id: string) {
    return this.http.get<any>(this.baseUrl + '/getQuestById', { params: { _id: id } })
      .pipe(map((res: any) => {
        if (res && res.statusCode === 200 && res.questDetail) {
          return res.questDetail;
        }
        this.common.messageExecute(res);
        return null;

      }), catchError(err => {
        const error = err.error.message || err.statusText;
        this.common.messageExecute(err);
        return throwError(error);
      }));
  }

  editQuest(quest: any) {
    return this.http.post<any>(this.baseUrl + '/editQuest', quest)
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

  exportsQuestions() {
    window.open(this.baseUrl + '/exportQuestions');
  }

  readFileExcel(formData: FormData) {

    return this.http.post<any>(this.baseUrl + '/readFileExcel', formData)
      .pipe(map(res => {
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

  importQuestion(listQuest: any[]) {
    return this.http.post<any>(this.baseUrl + '/importQuestion', listQuest)
      .pipe(map(res => {
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
