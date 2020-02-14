import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialExtensionsModule } from '@ng-matero/extensions';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressRouterModule } from '@ngx-progressbar/router';
import { NgxPopperModule } from 'ngx-popper';
import { MaterialModule } from '../material.module';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { ErrorCodeComponent } from './components/error-code/error-code.component';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { SearchJobComponent } from './components/search-job/search-job.component';
import { SelectDropdownComponent } from './components/select-dropdown/select-dropdown.component';
import { TextSearchPipe } from './pipes/text-search.pipe';



const THIRD_MODULES = [
  MaterialModule,
  FlexLayoutModule,
  NgProgressModule,
  NgProgressRouterModule,
  NgSelectModule,
  FormlyModule,
  FormlyMaterialModule,
  NgxPopperModule,
  MaterialExtensionsModule,
];
const COMPONENTS = [
  BreadcrumbComponent,
  PageHeaderComponent,
  ErrorCodeComponent,
  ConfirmDialogComponent,
  SelectDropdownComponent,
  SearchJobComponent
];
const COMPONENTS_DYNAMIC = [ConfirmDialogComponent];
const DIRECTIVES = [];
const PIPES = [TextSearchPipe];

@NgModule({
  declarations: [...COMPONENTS, ...DIRECTIVES, ...PIPES, ...COMPONENTS_DYNAMIC],
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule, ...THIRD_MODULES],
  exports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    ...THIRD_MODULES,
    ...COMPONENTS,
    ...DIRECTIVES,
    ...PIPES,
  ],
  entryComponents: COMPONENTS_DYNAMIC,
})
export class SharedModule { }
