import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { JobService } from '@core/services/job.service';
import { SignInService } from '@core/services/sign-in.service';
import { SignInPopupComponent } from 'app/routes/sign-in-popup/sign-in-popup.component';

@Component({
  selector: 'app-find-job',
  templateUrl: './find-job.component.html',
  styleUrls: ['./find-job.component.scss']
})
export class FindJobComponent implements OnInit {

  listJob = [];
  constructor(
    private signIn: SignInService,
    private dialog: MatDialog,
    private jobService: JobService
  ) { }

  ngOnInit() {
  }

  searchJob(dataSearch: any) {
    this.jobService.searchJob(dataSearch).subscribe(
      res => {
        this.listJob = res;
      }
    );
  }

  saveJob() {
    if (!this.signIn.signedIn()) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.width = '600px';
      dialogConfig.maxWidth = '100%';
      dialogConfig.data = { labelHeader: 'chức năng này' };
      this.dialog.open(SignInPopupComponent, dialogConfig);
    } else {

    }
  }
}
