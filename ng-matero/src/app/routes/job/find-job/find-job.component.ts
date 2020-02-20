import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { JobService } from '@core/services/job.service';
import { SignInService } from '@core/services/sign-in.service';
import { SignInPopupComponent } from 'app/routes/sign-in-popup/sign-in-popup.component';
import { Subscription } from 'rxjs';
import { Constant } from './../../../common/constant';
import { SearchJobComponent } from './../../../shared/components/search-job/search-job.component';

@Component({
  selector: 'app-find-job',
  templateUrl: './find-job.component.html',
  styleUrls: ['./find-job.component.scss']
})
export class FindJobComponent implements OnInit {

  @ViewChild('searchBar', { static: true }) searchBar: SearchJobComponent;

  listJob = [];
  isLoadSaveJob = [];
  listFilter = [{ id: 0, text: 'Ngày Đăng' }, { id: 1, text: 'Lương' }];
  filter = 0;
  totalItem: number;
  pager: any;
  pageCurrent = 1;
  private paramsSubscription: Subscription;

  constructor(
    private signIn: SignInService,
    private dialog: MatDialog,
    private jobService: JobService,
    public activatedRoute: ActivatedRoute
  ) { }

  /**
   * On init
   */
  ngOnInit() {
    // this.paramsSubscription = this.activatedRoute.queryParams.subscribe(res => {
    //   if (res && res.paramSearch) {
    //     const dataSearch = JSON.parse(decodeURIComponent(res.paramSearch)).dataSearch;
    //     this.textSearch = dataSearch.textSearch;
    //     this.careerId = dataSearch.career;
    //     this.locationId = dataSearch.location;
    //   }
    // });

    if (localStorage.getItem(Constant.FILTER_JOB) != null) {
      this.filter = JSON.parse(localStorage.getItem(Constant.FILTER_JOB));
    }

    this.searchJob();
  }

  /**
   * On destroy
   */
  // ngOnDestroy() {
  //   this.paramsSubscription.unsubscribe();
  // }

  /**
   * Search job
   * @param dataSearch any
   */
  searchJob(page?: number) {
    this.jobService.searchJob(page).subscribe(
      res => {
        this.listJob = res.data;
        this.pager = res.pager;
        this.totalItem = res.totalItem;
      }
    );
  }

  /**
   * Save or un save job
   * @param jobId job Id
   * @param isSave flag is save
   */
  saveOrUnSaveJob(jobId: number, saveJob: boolean, index: number) {
    if (!this.signIn.signedIn()) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.width = '600px';
      dialogConfig.maxWidth = '100%';
      dialogConfig.data = { labelHeader: 'để sử dụng chức năng này' };
      this.dialog.open(SignInPopupComponent, dialogConfig).afterClosed().subscribe(
        res => {
          if (res) {
            window.location.reload();
          }
        });
    } else {
      this.isLoadSaveJob[index] = true;
      this.listJob[index].saveJob = !saveJob;
      this.jobService.handlerSaveJob({ isSave: !saveJob, jobId }).subscribe(
        res => {
          this.isLoadSaveJob[index] = false;
          if (res && res.statusCode === 200) {
          }
        }
      );
    }
  }

  changeFilter(idFilter: number) {
    localStorage.setItem(Constant.FILTER_JOB, String(idFilter));
    this.searchJob();
  }

  changePage(page: number) {
    if (this.pageCurrent === page) {
      return;
    }
    this.pageCurrent = page;
    this.searchJob(page);
  }
}
