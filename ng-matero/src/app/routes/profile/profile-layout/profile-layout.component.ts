import { Component, OnInit } from '@angular/core';
import { AuthService } from '@core';
import { User } from '@core/models';

@Component({
  selector: 'app-profile-layout',
  templateUrl: './profile-layout.component.html',
  styleUrls: ['./profile-layout.component.scss']
})
export class ProfileLayoutComponent implements OnInit {
  url = '';
  user: User;
  constructor(private auth: AuthService) { }
  ngOnInit() {
    this.user = this.auth.getCurrentUser();
  }

  onSelectFile(input: any) {
    if (input.target.files && input.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        $('#imagePreview').css('background-image', 'url(' + e.target.result + ')');
        $('#imagePreview').hide();
        $('#imagePreview').fadeIn(650);
      };
      reader.readAsDataURL(input.target.files[0]);
    }
  }
}
