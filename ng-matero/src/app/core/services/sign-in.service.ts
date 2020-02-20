import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Member } from '@core/models/member';
import { environment } from '@env/environment';
import { Common } from 'app/common/common';
import { Constant } from 'app/common/constant';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return control.parent.errors && (invalidCtrl || invalidParent);
  }
}

@Injectable({
  providedIn: 'root'
})
export class SignInService {

  signInForm: FormGroup;
  signUpForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  currentUser: Observable<Member>;
  private currentUserSubject: BehaviorSubject<Member>;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private common: Common
  ) {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });

    this.signUpForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordConfirm: [''],
    }, { validators: this.checkPassword });

    this.currentUserSubject = new BehaviorSubject<Member>(this.getCurrentUser());
    this.currentUser = this.currentUserSubject.asObservable();
  }

  signedIn() {
    return !!this.getToken();
  }

  getToken() {
    const info = localStorage.getItem(Constant.INFO_LOGIN);
    if (info != null && info !== undefined) {
      return JSON.parse(atob(info)).token;
    }

    return null;
  }

  signInHandler(member: Member) {
    const memberInfo = {
      email: member.email,
      password: member.password
    };

    return this.http.post<any>(environment.SERVER_URL + '/signIn', memberInfo)
      .pipe(map((res: any) => {
        if (res && res.statusCode === 200 && res.info) {
          localStorage.setItem(Constant.INFO_LOGIN, res.info);

          this.currentUserSubject.next(this.getCurrentUser());
        }
        return res;

      }), catchError(err => {
        const error = err.error.message || err.statusText;
        this.common.messageExecute(err);
        return throwError(error);
      }));
  }

  signUpHandler(member: Member) {
    const userInfo = {
      email: member.email,
      name: member.name,
      password: member.password
    };

    return this.http.post<any>(environment.SERVER_URL + '/signUp', userInfo)
      .pipe(map(res => {
        if (res && res.statusCode === 200 && res.info) {
          localStorage.setItem(Constant.INFO_LOGIN, res.info);

          this.currentUserSubject.next(this.getCurrentUser());
        }

        return res;
      }), catchError(err => {
        const error = err.error.message || err.statusText;
        this.common.messageExecute(err);
        return throwError(error);
      }));
  }

  handlerSignOut() {
    localStorage.clear();
    window.location.reload();
  }

  getCurrentUser() {
    const info = localStorage.getItem(Constant.INFO_LOGIN);
    if (info !== null && info !== undefined) {
      return JSON.parse(atob(info)).member;
    }
    return null;
  }

  private checkPassword(group: FormGroup) {
    const pass = group.get('password').value;
    const passConfirm = group.get('passwordConfirm').value;

    return pass === passConfirm ? null : { notSame: true };
  }
}
