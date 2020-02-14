import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CareerService } from '@core/services/career.service';
import { LocationService } from '@core/services/location.service';
import { forkJoin } from 'rxjs';
import { SelectDropdownComponent } from '../select-dropdown/select-dropdown.component';

@Component({
  selector: 'app-search-job',
  templateUrl: './search-job.component.html',
  styleUrls: ['./search-job.component.scss']
})
export class SearchJobComponent implements OnInit {

  @ViewChild('career', { static: false }) career: SelectDropdownComponent;
  @ViewChild('location', { static: false }) location: SelectDropdownComponent;
  @Input() labelSearch = true;
  @Output() handlerSearch: EventEmitter<any> = new EventEmitter<any>();
  textSearch = '';
  listCareer = [];
  listLocation = [];

  constructor(
    private careerService: CareerService,
    private locationService: LocationService
  ) { }

  ngOnInit() {
    forkJoin([
      this.careerService.getAllCareer(),
      this.locationService.getAllLocation()
    ]).subscribe(
      res => {
        const [resListCareer, resListLocation] = res;

        // List Career
        resListCareer.forEach(item => {
          this.listCareer.push({
            id: item.careerId,
            text: item.careerName
          });
        });

        resListLocation.forEach(item => {
          this.listLocation.push({
            id: item.cityId,
            text: item.cityName
          });
        });
      }
    );
  }

  /**
   * Find job
   */
  searchJob() {
    this.handlerSearch.emit({
      textSearch: this.textSearch,
      career: this.career._value,
      location: this.location._value,
    });
  }

}
