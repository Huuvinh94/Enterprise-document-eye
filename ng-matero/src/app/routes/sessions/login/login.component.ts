import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@core';
import { Constant } from 'app/common/constant';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  labelInfoFile = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.labelInfoFile = Constant.LABEL_FILE_UPLOAD;
  }

  changeFileUpload(event: any) {

    const fileList: FileList = event.target.files;
    let fileName = Constant.LABEL_FILE_UPLOAD;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      fileName = file.name;
    }

    this.labelInfoFile = fileName;
  }
}
