import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Common } from 'app/common/common';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class HomeService {
    constructor(
        private http: HttpClient,
        private common: Common
    ) { }

    getTopCompany() {
        return this.http.get<any>('/api/getTopCompany')
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
