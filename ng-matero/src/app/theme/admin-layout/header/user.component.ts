import { Component, OnInit } from '@angular/core';
import { AuthService } from '@core';
import { User } from '@core/models';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
})
export class UserComponent implements OnInit {

  user: User;
  constructor(public auth: AuthService) { }

  ngOnInit() {
    this.user = this.auth.getCurrentUser();
  }
}
