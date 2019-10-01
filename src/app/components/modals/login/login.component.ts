import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ModalContext } from 'src/app/modal/modal-context';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {
  email: any;
  name: any;
  password: any;

  constructor(private authService: AuthService, private context: ModalContext<LoginComponent>) { }

  ngOnInit() {
  }

  onSubmit(formData) {
    this.authService.loginWithEmail(formData.value.email, formData.value.password)
      .subscribe(success => {
        console.log(success);
        this.hide();
      }, error => {
        console.log(error);
        // this.error = error;
      });
  }

  hide() {
    this.context.resolve();
  }
}
