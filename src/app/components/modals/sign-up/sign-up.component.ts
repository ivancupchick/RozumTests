import { Component, OnInit } from '@angular/core';
import { ModalContext } from 'src/app/modal/modal-context';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.sass']
})
export class SignUpComponent implements OnInit {

  constructor(private context: ModalContext<SignUpComponent>, private authService: AuthService) { }

  ngOnInit() {
  }

  onSubmit(formData) {
    if (formData.valid) {
      try {
        this.authService.createUserWithEmail(formData.value.email, formData.value.password, formData.value.name);
      } catch (error) {
        console.log(error);
      }
    }

  /*
    if(formData.valid) {
      let result =
      if (!result) {
        this.hide();
      } else {
        this.error = result;
      }
    }
    */
  }

  hide() {
    this.context.resolve();
  }
}
