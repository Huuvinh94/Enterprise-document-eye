import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Common } from 'app/common/common';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Constant } from './../../common/constant';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  constructor(
    private http: HttpClient,
    private common: Common
  ) { }

  searchJob(page: number = 0) {
    const recentSearch = JSON.parse(localStorage.getItem(Constant.RECENT_SEARCH));
    const filterJob = JSON.parse(localStorage.getItem(Constant.FILTER_JOB));
    const valSearch = {
      textSearch: '',
      careerId: '',
      locationId: '',
      filter: 0,
      page,
      arraySearchCareer: [],
      arraySearchLocation: []
    };

    if (recentSearch !== null) {
      valSearch.textSearch = recentSearch.textSearch;
      valSearch.careerId = recentSearch.careerId;
      valSearch.locationId = recentSearch.locationId;
    }

    if (filterJob !== null) {
      valSearch.filter = filterJob;
    }

    const arraySearch = JSON.parse(localStorage.getItem(Constant.ARR_SEARCH));

    valSearch.arraySearchLocation = (arraySearch === null || arraySearch.location === undefined) ? [] : arraySearch.location;
    valSearch.arraySearchCareer = (arraySearch === null || arraySearch.career === undefined) ? [] : arraySearch.career;

    return this.http.post<any>('/api/searchJob', valSearch)
      .pipe(map((res: any) => {
        if (res && res.statusCode === 200) {
          return res;
        }
        return [];
      }), catchError(err => {
        const error = err.error.message || err.statusText;
        this.common.messageExecute(err);
        return throwError(error);
      }));
  }

  /**
   * Handler save or un save job
   * @param params flag save and jobId
   */
  handlerSaveJob(params: object) {
    return this.http.post<any>('/api/saveOrUnSaveJob', params)
      .pipe(map((res: any) => {
        return res;
      }), catchError(err => {
        const error = err.error.message || err.statusText;
        this.common.messageExecute(err);
        return throwError(error);
      }));
  }
}
