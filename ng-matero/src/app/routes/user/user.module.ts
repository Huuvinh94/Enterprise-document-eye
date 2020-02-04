import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { UserFormComponent } from './user-form/user-form.component';
import { UserManagerComponent } from './user-manager/user-manager.component';
import { UserRoutingModule } from './user-routing.module';

const COMPONENTS = [UserManagerComponent];
const COMPONENTS_DYNAMIC = [UserFormComponent];

@NgModule({
  imports: [
    SharedModule,
    UserRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_DYNAMIC
  ],
  entryComponents: COMPONENTS_DYNAMIC
})
export class UserModule { }
