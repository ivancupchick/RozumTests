import { Component, OnInit } from '@angular/core';
import { UserInfo, AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { ModalService } from 'src/app/modal/modal.service';
import { LoginComponent } from '../modals/login/login.component';
import { ModalContainerComponent } from 'src/app/modal/modal-container/modal-container.component';
import { SignUpComponent } from '../modals/sign-up/sign-up.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  userId: number;
  userInfo: UserInfo;

  constructor(private router: Router, public authService: AuthService, private modalService: ModalService) {
    this.userInfo = this.authService.getCurrentUserInfo();

    console.log(this.userInfo);

    if (!this.userInfo) {
      this.authService.getUserInfo()
        .subscribe((userInfo) => {
          this.userInfo = userInfo;
          console.log(this.userInfo);
        });
    }
  }

  ngOnInit() {
  }

  openLogin() {
    this.modalService.open(LoginComponent, null, { hideOnBackdropClick: true, containerType: ModalContainerComponent });
  }
  openSignup() {
    this.modalService.open(SignUpComponent, null, { hideOnBackdropClick: true, containerType: ModalContainerComponent });
  }

  linkToProfile() {
    if (!this.userInfo) {
      this.userInfo = this.authService.getCurrentUserInfo();
    }
    this.router.navigateByUrl(`profile/${this.userInfo.id}`);
  }

  logOut() {
    this.authService.logOut();
    this.router.navigateByUrl('');
  }
}
