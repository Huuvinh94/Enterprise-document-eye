import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { PreloaderService } from '@core';
import { ErrorInterceptor } from './interceptors/error-interceptor';
import { LoaderInterceptor } from './interceptors/loader-interceptor';
import { TokenInterceptor } from './interceptors/token-interceptor';
import { throwIfAlreadyLoaded } from './module-import-guard';

@NgModule({
  declarations: [],
  providers: [
    PreloaderService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
  ],
  imports: [CommonModule],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
