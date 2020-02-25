import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { JobService } from '@core/services/job.service';
import { SignInService } from '@core/services/sign-in.service';
import { Constant } from 'app/common/constant';
import { SignInPopupComponent } from 'app/routes/sign-in-popup/sign-in-popup.component';
import { SearchJobComponent } from './../../../shared/components/search-job/search-job.component';

@Component({
  selector: 'app-find-job',
  templateUrl: './find-job.component.html',
  styleUrls: ['./find-job.component.scss'],
})
export class FindJobComponent implements OnInit, OnDestroy {

  @ViewChild('searchBar', { static: false }) searchBar: SearchJobComponent;

  listJob = [];
  isLoadSaveJob = [];
  isLoadNotification = [];
  listFilter = [{ id: 0, text: 'Ngày Đăng' }, { id: 1, text: 'Lương' }];
  listLocation = [];
  listCareer = [];
  filter = 0;
  totalItem: number;
  pager: any;
  isShowNotification = false;

  // private paramsSubscription: Subscription;

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

    setTimeout(() => {
      this.listLocation = this.searchBar.listLocation;
      this.listCareer = this.searchBar.listCareer;
    });

    this.searchJob();
  }

  /**
   * On destroy
   */
  ngOnDestroy() {
    localStorage.removeItem(Constant.ARR_SEARCH);
  }

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
      });
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
            this.isLoadNotification[index] = true;
            setTimeout(() => {
              this.isLoadNotification[index] = false;
            }, 1000);
          }
        }
      );
    }
  }

  /**
   * Search when change value filter
   * @param filterId filter id change
   */
  changeFilter(filterId: number) {
    localStorage.setItem(Constant.FILTER_JOB, String(filterId));
    this.searchJob();
  }

  /**
   * Search when change page
   * @param page page change
   */
  changePage(page: number) {
    if (this.pager.currentPage === page) {
      return;
    }
    this.searchJob(page);
  }

  /**
   * Set checked value
   * @param checkId check id
   * @param nameCheck name checked
   */
  checked(checkId: number, nameCheck: string) {
    const arrSearch = JSON.parse(localStorage.getItem(Constant.ARR_SEARCH));

    if (arrSearch != null && arrSearch[nameCheck]) {
      return arrSearch[nameCheck].indexOf(checkId) !== -1;
    }

    return false;
  }

  /**
   * Event change check box
   * @param event event
   * @param checkId check id
   * @param nameCheck name checked
   */
  changeCheckbox(event: any, checkId: number, nameCheck: string) {
    const checked = event.source.checked;
    const arrSearch = JSON.parse(localStorage.getItem(Constant.ARR_SEARCH)) || {};
    if (checked) {
      arrSearch[nameCheck] = arrSearch[nameCheck] === undefined ? [] : arrSearch[nameCheck];
      arrSearch[nameCheck].push(checkId);
    } else {
      const index = arrSearch[nameCheck].indexOf(checkId);
      if (index !== -1) {
        arrSearch[nameCheck].splice(index, 1);
      }
    }

    localStorage.setItem(Constant.ARR_SEARCH, JSON.stringify(arrSearch));
    this.searchJob();
  }
}
