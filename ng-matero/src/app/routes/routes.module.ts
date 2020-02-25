import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { DetailJobComponent } from './job/detail-job/detail-job.component';
import { FindJobComponent } from './job/find-job/find-job.component';
import { ListResumeComponent } from './list-resume/list-resume.component';
import { RoutesRoutingModule } from './routes-routing.module';
import { LoginComponent } from './sessions/login/login.component';
import { RegisterComponent } from './sessions/register/register.component';
import { SignInPopupComponent } from './sign-in-popup/sign-in-popup.component';
import { DoSurveyComponent } from './survey/do-survey/do-survey.component';
import { UploadResumeComponent } from './upload-resume/upload-resume.component';

const COMPONENTS = [
  DoSurveyComponent,
  DashboardComponent,
  LoginComponent,
  RegisterComponent,
  HomeComponent,
  HeaderComponent,
  ListResumeComponent,
  FooterComponent,
  SignInPopupComponent,
  UploadResumeComponent,
  FindJobComponent,
  DetailJobComponent
];
const COMPONENTS_DYNAMIC = [SignInPopupComponent];

@NgModule({
  imports: [SharedModule, RoutesRoutingModule, MDBBootstrapModule.forRoot()],
  declarations: [...COMPONENTS, ...COMPONENTS_DYNAMIC],
  entryComponents: COMPONENTS_DYNAMIC,
})
export class RoutesModule { }
