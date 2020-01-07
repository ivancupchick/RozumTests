import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ModalContext } from 'src/app/modal/modal-context';
import { AuthService } from 'src/app/services/auth.service';
import { UserGroupsService } from 'src/app/server/user-groups.service';
import { UserGroup } from 'src/app/services/entities';

function equalsString(firstString: string, secondString: string) {
  return firstString && secondString && firstString.toLocaleLowerCase().includes(secondString.toLocaleLowerCase());
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.sass'],
  // providers: [
  //   UserGroupsService
  // ]
})
export class SignUpComponent implements OnInit, AfterViewInit {
  email: any;
  name: any;
  password: any;
  group: string;

  public isVisibleGroup = false;
  public availableGroups: UserGroup[] = [];
  public groups: UserGroup[] = [];

  @ViewChild('groupInput') groupInput: ElementRef<HTMLInputElement>;

  constructor(private context: ModalContext<SignUpComponent>,
              private authService: AuthService,
              private groupsService: UserGroupsService) { }

  ngOnInit() {
    this.groupsService.getList().subscribe((res) => {
      this.groups = res || [];
    });

    // console.log(this.groupInput);

    this.groupInput.nativeElement.addEventListener('input', (e) => {
      if (!this.group && !this.isVisibleGroup) {
        this.isVisibleGroup = false;
        return;
      }

      this.availableGroups = this.groups.filter((group) => equalsString(group.name, this.group));

      if (this.availableGroups.length === 0) {
        this.isVisibleGroup = false;
      } else {
        this.isVisibleGroup = true;
      }
    });

    this.groupInput.nativeElement.addEventListener('blur', (e) => {
      setTimeout(() => {
        this.isVisibleGroup = false;
      }, 500);
    });
  }

  ngAfterViewInit() {
    // console.log(this.groupInput);

    // this.groupInput.nativeElement.addEventListener('change', (res) => {
    //   console.log(res);
    // });
  }

  setGroupValue(value: UserGroup) {
    const group = this.groups.find(iGroup => equalsString(iGroup.name, value.name));

    if (!group) {
      return;
    }

    this.isVisibleGroup = false;
    this.group = group.name;
  }

  onSubmit(formData) {
    const group = this.groups.find(iGroup => equalsString(iGroup.name, this.group));

    if (formData.valid) {
      try {
        this.authService.createUserWithEmail(formData.value, group ? group : this.group)
          .subscribe(res => {
            console.log(res);
            if (res) {
              this.hide();
            } else {
              alert('Что-то пошло не так...');
            }
          }, error => {
            console.log(error);
          });
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
