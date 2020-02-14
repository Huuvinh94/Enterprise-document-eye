import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, HostListener, OnInit } from '@angular/core';
import { HomeService } from '@core/services/home.service';
import { RatingService } from '@core/services/rating.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { forkJoin } from 'rxjs';
import { Company } from '../../core/models/company';
import { CareerService } from './../../core/services/career.service';
import { LocationService } from './../../core/services/location.service';

@Component({
  selector: 'app-login',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  listCompany = new Array<Company>();
  listRating = [];
  isDesktopDevice = true;
  list: any;
  /**
   * Constructor home
   */
  constructor(
    private homeService: HomeService,
    private ratingService: RatingService,
    private careerService: CareerService,
    private locationService: LocationService,
    private breakpointObserver: BreakpointObserver,
    public deviceService: DeviceDetectorService,
  ) { }

  /**
   * Init
   */
  ngOnInit() {

    forkJoin([
      this.homeService.getTopCompany(),
      this.ratingService.getRating(),
      this.careerService.getAllCareer(),
      this.locationService.getAllLocation()
    ]).subscribe(
      res => {
        const [resListCompany, resListRating] = res;

        // List top company
        this.listCompany = resListCompany;

        // List user rating
        this.listRating = resListRating;
      }
    );

    if (this.deviceService.isMobile()) {
    }

    this.resize();
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
