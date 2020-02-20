import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SignInService } from '@core/services/sign-in.service';
import { SignInPopupComponent } from '../sign-in-popup/sign-in-popup.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    public signIn: SignInService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  signInPopup() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '600px';
    dialogConfig.maxWidth = '100%';
    this.dialog.open(SignInPopupComponent, dialogConfig).afterClosed().subscribe(
      res => {
        if (res) {
          window.location.reload();
        }
      }
    );
  }
}
