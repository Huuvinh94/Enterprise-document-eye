import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { AuthService } from '@core';
import { Common } from 'app/common/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor {

    constructor(
        private injector: Injector,
        private common: Common,
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.injector.get(AuthService).getToken();

        if (token !== '') {
            request = request.clone({
                setHeaders: {
                    Authorization: 'Bearer ' + token,
                    Accept: 'application/json'
                }
            });
        }

        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    console.log('event--->>>', event);
                }
                return event;
            }),
            catchError(err => {
                if ([401, 403, 500].indexOf(err.status) !== -1) {
                    // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                    localStorage.clear();
                    // location.reload();
                }

                const error = err.error.message || err.statusText;
                this.common.messageExecute(err);
                return throwError(error);
            })
        );
    }
}
