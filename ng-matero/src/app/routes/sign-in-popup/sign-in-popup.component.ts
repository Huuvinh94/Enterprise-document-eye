import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SignInService } from '@core/services/sign-in.service';

@Component({
  selector: 'app-sign-in-popup',
  templateUrl: './sign-in-popup.component.html',
  styleUrls: ['./sign-in-popup.component.scss']
})
export class SignInPopupComponent implements OnInit {

  loading: boolean;
  messageErrorSignIn = '';
  messageErrorSignUp = '';
  cols: number;
  rowHeight: string | number;
  labelHeader = 'mẫu CV';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public signInService: SignInService,
    private router: Router,
    private dialogRef: MatDialogRef<SignInPopupComponent>,
  ) { }

  /**
   * On init
   */
  ngOnInit() {
    this.signInService.signInForm.reset();
    this.signInService.signUpForm.reset();
    this.labelHeader = this.data.labelHeader;
  }

  /**
   * Sign in member
   */
  signIn() {
    if (this.signInService.signInForm.valid) {
      this.loading = true;
      this.signInService.signInHandler(this.signInService.signInForm.value).subscribe(
        res => {
          this.loading = false;
          if (res.statusCode !== 200) {
            this.messageErrorSignIn = res.statusText;
          } else {
            this.dialogRef.close(true);
            this.router.navigate(['/new-resume']);
          }
        },
        err => {
          this.loading = false;
        }
      );
    } else {
      this.signInService.signInForm.markAllAsTouched();
    }
  }

  /**
   * Sign up member
   */
  signUp() {
    if (this.signInService.signUpForm.valid) {
      this.loading = true;
      this.signInService.signUpHandler(this.signInService.signUpForm.value)
        .subscribe(
          res => {
            this.loading = false;
            if (res.statusCode !== 200) {
              this.messageErrorSignUp = res.statusText;

            } else {
              this.router.navigate(['/new-resume']);
            }
          }
        );
    } else {
      this.signInService.signUpForm.markAllAsTouched();
    }
  }

}
