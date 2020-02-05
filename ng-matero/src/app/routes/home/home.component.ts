import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, HostListener, OnInit } from '@angular/core';
import { HomeService } from '@core/services/home.service';
import { RatingService } from '@core/services/rating.service';
import { Constant } from 'app/common/constant';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Company } from '../../core/models/company';

@Component({
  selector: 'app-login',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  labelInfoFile = '';
  listCompanyTopTrending = new Array<Company>();
  listRating = [];
  isDesktopDevice = true;

  /**
   * Constructor home
   */
  constructor(
    private homeService: HomeService,
    private ratingService: RatingService,
    private breakpointObserver: BreakpointObserver,
    public deviceService: DeviceDetectorService,
  ) { }

  /**
   * Init
   */
  ngOnInit() {
    this.labelInfoFile = Constant.LABEL_FILE_UPLOAD;

    this.homeService.getCompanyTopTrending().subscribe(
      res => {
        this.listCompanyTopTrending = res;
      }
    );

    this.ratingService.getRating().subscribe(
      res => {
        this.listRating = res;
      }
    );

    if (this.deviceService.isMobile()) {
      this.labelInfoFile = Constant.LABEL_FILE_UPLOAD_DEFAULT;
    }

    this.resize();
  }

  /**
   * Call when change file upload
   * @param event event
   */
  changeFileUpload(event: any) {

    const fileList: FileList = event.target.files;
    let fileName = Constant.LABEL_FILE_UPLOAD;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      fileName = file.name;
    }

    this.labelInfoFile = fileName;
  }

  /**
   * Change layout when resize window
   */
  private resize() {
    this.breakpointObserver
      .observe(['screen and (min-width: 481px) and (max-width: 959px)'])
      .subscribe(state => {

        let checkResize = true;
        if (state.matches || this.deviceService.isMobile()) {
          checkResize = false;
        }
        this.isDesktopDevice = checkResize;
      });
  }

  /**
   * On resize window
   */
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.resize();
  }

}
