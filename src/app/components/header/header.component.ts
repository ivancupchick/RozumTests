import { Component, OnInit } from '@angular/core';
import { UserInfo, AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  userId: number;
  userInfo: UserInfo;

  constructor(private router: Router, public authService: AuthService) {
    this.userInfo = this.authService.getCurrentUserInfo();
  }

  ngOnInit() {
  }

  openLogin() {
    // this.dialog.open(LoginComponent);
  }
  openSignup() {
    // this.dialog.open(SignupComponent);
  }

  linkToProfile() {
    if (!this.userInfo) {
      this.userInfo = this.authService.getCurrentUserInfo();
    }
    this.router.navigateByUrl(`profile/${this.userInfo.id}`);
  }

  logout() {
    this.authService.logOut();
    this.router.navigateByUrl('');
  }
}
