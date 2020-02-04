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
export class CareerService {

  baseUrl = environment.SERVER_URL;
  matcher = new MyErrorStateMatcher();

  constructor(
    private http: HttpClient,
    private common: Common
  ) {
  }

  getQuestCareer() {
    return this.http.get<any>(this.baseUrl + '/getQuestCareer')
      .pipe(map((res: any) => {
        let listCareer = [];
        if (res && res.statusCode === 200 && res.data) {
          listCareer = res.data;
        }
        return listCareer;
      }), catchError(err => {
        const error = err.error.message || err.statusText;
        this.common.messageExecute(err);
        return throwError(error);
      }));
  }

  getAllCareer() {
    return this.http.get<any>(this.baseUrl + '/getAllCareer')
      .pipe(map((res: any) => {
        let listCareer = [];
        if (res && res.statusCode === 200 && res.data) {
          listCareer = res.data;
        }
        return listCareer;
      }), catchError(err => {
        const error = err.error.message || err.statusText;
        this.common.messageExecute(err);
        return throwError(error);
      }));
  }

  deleteCareer(id: string) {
    return this.http.post<any>(this.baseUrl + '/deleteCareer', { _id: id })
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

  createCareer(career: any) {
    return this.http.post<any>(this.baseUrl + '/createCareer', career)
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

  getCareerById(id: string) {
    return this.http.get<any>(this.baseUrl + '/getCareerById', { params: { _id: id } })
      .pipe(map((res: any) => {
        if (res && res.statusCode === 200 && res.careerDetail) {
          return res.careerDetail;
        }
        this.common.messageExecute(res);
        return null;

      }), catchError(err => {
        const error = err.error.message || err.statusText;
        this.common.messageExecute(err);
        return throwError(error);
      }));
  }

  editCareer(career: any) {
    return this.http.post<any>(this.baseUrl + '/editCareer', career)
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
}
