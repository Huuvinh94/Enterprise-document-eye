import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';
import { User } from '@core/models';
import { environment } from '@env/environment';
import { Common } from 'app/common/common';
import * as _ from 'lodash';
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
export class UserService {

  baseUrl = environment.SERVER_URL;
  userFormLogin: FormGroup;
  userFormCreate: FormGroup;
  matcher = new MyErrorStateMatcher();

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private common: Common,
  ) {
    this.userFormLogin = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  getListUser() {
    return this.http.get<any>(this.baseUrl + '/getListUser')
      .pipe(map((res: any) => {
        let listUser = [];
        if (res && res.statusCode === 200 && res.listUser) {
          listUser = res.listUser;
        }
        return listUser;
      }), catchError(err => {
        const error = err.error.message || err.statusText;
        this.common.messageExecute(err);
        return throwError(error);
      }));
  }

  deleteUser(id: string) {
    return this.http.post<any>(this.baseUrl + '/deleteUser', { _id: id })
      .pipe(map((res: any) => {
        // this.snackBar.messageExecute(res);
        if (res && res.statusCode === 200 && res.userDetail) {
          return res;
        }
        return null;

      }), catchError(err => {
        const error = err.error.message || err.statusText;
        // this.snackBar.messageExecute(err);
        return throwError(error);
      }));
  }

  editUser(user: any) {
    const userInfo = {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roleId: user.roleId,
      password: ''
    };

    if (user.password) {
      userInfo.password = user.password;
    }

    return this.http.post<any>(this.baseUrl + '/editUser', userInfo)
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

  getUserById(id: string) {
    return this.http.get<any>(this.baseUrl + '/getUserById', { params: { _id: id } })
      .pipe(map((res: any) => {
        if (res && res.statusCode === 200 && res.userDetail) {
          return res.userDetail;
        }
        this.common.messageExecute(res);
        return null;

      }), catchError(err => {
        const error = err.error.message || err.statusText;
        this.common.messageExecute(err);
        return throwError(error);
      }));
  }

  initFormCreateUser(flgInit: boolean) {
    let validatePass = [];
    if (flgInit) {
      validatePass = ['', [Validators.required, Validators.minLength(8)]];
    } else {
      validatePass = ['', [Validators.minLength(8)]];
    }
    this.userFormCreate = this.fb.group({
      _id: [''],
      email: ['', [Validators.required, Validators.email]],
      password: validatePass,
      passwordConfirm: [''],
      firstName: [''],
      lastName: [''],
      roleId: ['']
    },
      { validators: this.checkPassword }
    );
  }

  checkPassword(group: FormGroup) {
    const pass = group.get('password').value;
    const passConfirm = group.get('passwordConfirm').value;

    return pass === passConfirm ? null : { notSame: true };
  }

  setInitFormGroup(flgInit: boolean, userDetail: User) {
    this.initFormCreateUser(flgInit);
    if (flgInit) {
      return;
    }
    userDetail.password = null;
    userDetail.passwordConfirm = null;
    this.userFormCreate.setValue(_.omit(userDetail, 'roleName'));
  }

  getRoleList() {
    return this.http.get<any>(this.baseUrl + '/getAllRole')
      .pipe(map((res: any) => {
        if (res && res.statusCode === 200) {
          return res;
        }
      }), catchError(err => {
        const error = err.error.message || err.statusText;
        this.common.messageExecute(err);
        return throwError(error);
      }));
  }

  registerUser(user: User) {
    const userInfo = {
      email: user.email,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      roleId: user.roleId
    };

    return this.http.post<any>(this.baseUrl + '/registerUser', userInfo)
      .pipe(map(res => {
        this.common.messageExecute(res);
        if (res && res.statusCode === 200) {
          this.userFormCreate.reset();
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
