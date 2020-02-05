import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from '@env/environment';
import { AuthLayoutComponent } from '../theme/auth-layout/auth-layout.component';
import { AdminLayoutComponent } from './../theme/admin-layout/admin-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { ListResumeComponent } from './list-resume/list-resume.component';
import { LoginComponent } from './sessions/login/login.component';
import { RegisterComponent } from './sessions/register/register.component';
import { DoSurveyComponent } from './survey/do-survey/do-survey.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'new-resume',
    component: ListResumeComponent
  },
  {
    path: 'dashboard',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: { title: 'Dashboard', titleI18n: 'dashboard' },
      },
      {
        path: 'design',
        loadChildren: () => import('./design/design.module').then(m => m.DesignModule),
        data: { title: 'Design', titleI18n: 'design' },
      },
      {
        path: 'material',
        loadChildren: () => import('./material/material.module').then(m => m.MaterialModule),
        data: { title: 'Material', titleI18n: 'material' },
      },
      {
        path: 'media',
        loadChildren: () => import('./media/media.module').then(m => m.MediaModule),
        data: { title: 'Media', titleI18n: 'media' },
      },
      {
        path: 'survey',
        loadChildren: () => import('./survey/survey.module').then(m => m.SurveyModule),
        data: { title: 'Survey', titleI18n: 'media' },
      },
      {
        path: 'user',
        loadChildren: () => import('./user/user.module').then(m => m.UserModule),
        data: { title: 'User', titleI18n: 'media' },
      },
      {
        path: 'forms',
        loadChildren: () => import('./forms/forms.module').then(m => m.FormsModule),
        data: { title: 'Forms', titleI18n: 'forms' },
      },
      {
        path: 'tables',
        loadChildren: () => import('./tables/tables.module').then(m => m.TablesModule),
        data: { title: 'Tables', titleI18n: 'tables' },
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
        data: { title: 'Profile', titleI18n: 'profile' },
      },
      {
        path: 'sessions',
        loadChildren: () => import('./sessions/sessions.module').then(m => m.SessionsModule),
        data: { title: 'Sessions', titleI18n: 'sessions' },
      },
      {
        path: 'helpers',
        loadChildren: () => import('./helpers/helpers.module').then(m => m.HelpersModule),
      },
      {
        path: 'extensions',
        loadChildren: () => import('./extensions/extensions.module').then(m => m.ExtensionsModule),
      },
    ],
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent, data: { title: 'Login', titleI18n: 'login' } },
      {
        path: 'register',
        component: RegisterComponent,
        data: { title: 'Register', titleI18n: 'register' },
      },
    ],
  },
  // { path: '**', redirectTo: 'dashboard' },
  {
    path: 'do-survey/:id',
    component: DoSurveyComponent,
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: environment.useHash,
    }),
  ],
  providers: [
    { provide: LocationStrategy, useClass: PathLocationStrategy },
  ],
  exports: [RouterModule],
})
export class RoutesRoutingModule { }
