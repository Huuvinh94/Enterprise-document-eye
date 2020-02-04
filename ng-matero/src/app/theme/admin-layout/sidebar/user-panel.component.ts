import { Component, OnInit } from '@angular/core';
import { AuthService } from '@core';
import { User } from '@core/models';

@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
})
export class UserPanelComponent implements OnInit {

  user: User;
  constructor(public auth: AuthService) { }

  ngOnInit() {
    this.user = this.auth.getCurrentUser();
  }
}
