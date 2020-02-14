import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, HostListener, OnInit } from '@angular/core';
import { Constant } from 'app/common/constant';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-upload-resume',
  templateUrl: './upload-resume.component.html',
  styleUrls: ['./upload-resume.component.scss']
})
export class UploadResumeComponent implements OnInit {

  labelInfoFile = '';
  isDesktopDevice = true;
  constructor(
    private breakpointObserver: BreakpointObserver,
    public deviceService: DeviceDetectorService,
  ) { }

  ngOnInit() {
    this.labelInfoFile = Constant.LABEL_FILE_UPLOAD;
    if (this.deviceService.isMobile()) {
      this.labelInfoFile = Constant.LABEL_FILE_UPLOAD_DEFAULT;
    }
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
