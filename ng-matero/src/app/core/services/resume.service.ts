import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Common } from 'app/common/common';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ResumeService {

  constructor(
    private http: HttpClient,
    private common: Common
  ) { }

  getListResume() {
    return this.http.get<any>(environment.SERVER_URL + '/getListResume')
      .pipe(map((res: any) => {
        if (res && res.statusCode === 200 && res.data) {
          return res.data;
        }
        return [];
      }), catchError(err => {
        const error = err.error.message || err.statusText;
        this.common.messageExecute(err);
        return throwError(error);
      }));
  }
}
