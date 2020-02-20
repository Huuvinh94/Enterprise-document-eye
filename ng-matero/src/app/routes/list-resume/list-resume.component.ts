import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ResumeService } from '@core/services/resume.service';
import { SignInService } from '@core/services/sign-in.service';
import { Resume } from './../../core/models/resume';
import { SignInPopupComponent } from './../sign-in-popup/sign-in-popup.component';
@Component({
  selector: 'app-new-resume',
  templateUrl: './list-resume.component.html',
  styleUrls: ['./list-resume.component.scss']
})
export class ListResumeComponent implements OnInit {

  listResume = new Array<Resume>();
  constructor(
    private signIn: SignInService,
    private resume: ResumeService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit() {
    this.resume.getListResume().subscribe(
      res => {
        this.listResume = res;
      }
    );
  }

  viewDetailCv() {
    if (!this.signIn.signedIn()) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.width = '600px';
      dialogConfig.maxWidth = '100%';
      dialogConfig.data = {
        labelHeader: 'để sử dụng mẫu CV'
      };
      this.dialog.open(SignInPopupComponent, dialogConfig).afterClosed().subscribe(
        res => {
          if (res) {
            this.router.navigate(['/new-resume']);
          }
        }
      );
    } else {

    }
  }
}
