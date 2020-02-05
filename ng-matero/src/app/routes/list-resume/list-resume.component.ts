import { Component, OnInit } from '@angular/core';
import { ResumeService } from '@core/services/resume.service';
import { Resume } from './../../core/models/resume';

@Component({
  selector: 'app-new-resume',
  templateUrl: './list-resume.component.html',
  styleUrls: ['./list-resume.component.scss']
})
export class ListResumeComponent implements OnInit {

  listResume = new Array<Resume>();
  constructor(
    private resume: ResumeService
  ) { }

  ngOnInit() {
    this.resume.getListResume().subscribe(
      res => {
        this.listResume = res;
      }
    );
  }
}
