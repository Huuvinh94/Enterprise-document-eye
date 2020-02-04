import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@core/models';
import { environment } from '@env/environment';
import { Common } from 'app/common/common';
import { Constant } from 'app/common/constant';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject: BehaviorSubject<User>;
  private baseUrl = environment.SERVER_URL;
  public currentUser: Observable<User>;
  constructor(
    private http: HttpClient,
    private common: Common,
    private router: Router
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(this.getCurrentUser());
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  handlerLoginUser(user: User) {
    const userInfo = {
      email: user.email,
      password: user.password
    };

    return this.http.post<any>(this.baseUrl + '/login', userInfo)
      .pipe(map((res: any) => {
        if (res && res.statusCode === 200 && res.info) {
          localStorage.setItem(Constant.INFO_LOGIN, res.info);

          this.currentUserSubject.next(this.getCurrentUser());
        } else {
          this.common.messageExecute(res);
        }

        return this.getCurrentUser();
      }), catchError(err => {
        const error = err.error.message || err.statusText;
        this.common.messageExecute(err);
        return throwError(error);
      }));
  }

  handlerLogout() {
    this.common.openConfirmDialog('Bạn muốn đăng xuất?', () => {
      localStorage.clear();
      this.router.navigate(['/auth/login']);
    });
  }

  getCurrentUser() {
    const info = localStorage.getItem(Constant.INFO_LOGIN);
    if (info !== null && info !== undefined) {
      return JSON.parse(atob(info)).user;
    }
    return null;
  }

  getToken() {
    const info = localStorage.getItem(Constant.INFO_LOGIN);
    if (info !== null && info !== undefined) {
      return JSON.parse(atob(info)).token;
    }
    return null;
  }

  loggedIn() {
    return !!this.getToken();
  }
}
