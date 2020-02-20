import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CareerService } from '@core/services/career.service';
import { LocationService } from '@core/services/location.service';
import { SelectDropdownComponent } from '../select-dropdown/select-dropdown.component';
import { Constant } from './../../../common/constant';

@Component({
  selector: 'app-search-job',
  templateUrl: './search-job.component.html',
  styleUrls: ['./search-job.component.scss']
})
export class SearchJobComponent implements OnInit, AfterViewInit {

  @ViewChild('career', { static: false }) career: SelectDropdownComponent;
  @ViewChild('location', { static: false }) location: SelectDropdownComponent;
  @Input() labelSearch = true;
  @Input() textSearch = '';
  @Input() careerId = '';
  @Input() locationId = '';
  @Output() handlerSearch: EventEmitter<any> = new EventEmitter<any>();
  listCareer = [];
  listLocation = [];

  constructor(
    private careerService: CareerService,
    private locationService: LocationService
  ) { }

  ngOnInit() {
    this.careerService.getAllCareer().subscribe(
      res => {
        // List career
        res.forEach(item => {
          this.listCareer.push({
            id: item.careerId,
            text: item.careerName
          });
        });
      });

    this.locationService.getAllLocation().subscribe(
      res => {
        // List location
        res.forEach(item => {
          this.listLocation.push({
            id: item.cityId,
            text: item.cityName
          });
        });
      }
    );
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (localStorage.getItem(Constant.RECENT_SEARCH) != null) {
        const dataSearch = JSON.parse(localStorage.getItem(Constant.RECENT_SEARCH));
        this.textSearch = dataSearch.textSearch;
        this.careerId = dataSearch.careerId;
        this.locationId = dataSearch.locationId;
      }
    }, 100);
  }

  /**
   * Find job
   */
  searchJob() {
    localStorage.setItem(Constant.RECENT_SEARCH, JSON.stringify({
      textSearch: this.textSearch,
      careerId: this.career._value,
      locationId: this.location._value,
    }));
    this.handlerSearch.emit();
  }
}
