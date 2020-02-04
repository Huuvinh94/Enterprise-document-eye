import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { RoutesRoutingModule } from './routes-routing.module';
import { LoginComponent } from './sessions/login/login.component';
import { RegisterComponent } from './sessions/register/register.component';
import { DoSurveyComponent } from './survey/do-survey/do-survey.component';


const COMPONENTS = [DoSurveyComponent, DashboardComponent, LoginComponent, RegisterComponent, HomeComponent];
const COMPONENTS_DYNAMIC = [];

@NgModule({
  imports: [SharedModule, RoutesRoutingModule, MDBBootstrapModule.forRoot()],
  declarations: [...COMPONENTS, ...COMPONENTS_DYNAMIC],
  entryComponents: COMPONENTS_DYNAMIC,
})
export class RoutesModule { }
