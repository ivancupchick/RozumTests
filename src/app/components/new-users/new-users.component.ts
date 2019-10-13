import { Component, OnInit } from '@angular/core';
import { UsersService, UserInfo } from 'src/app/services/users.service';

@Component({
  selector: 'app-new-users',
  templateUrl: './new-users.component.html',
  styleUrls: ['./new-users.component.scss']
})
export class NewUsersComponent implements OnInit {
  users: UserInfo[];

  constructor(private usersService: UsersService) { }

  ngOnInit() {
    this.usersService.getUsers()
      .subscribe((res: UserInfo[]) => {
        this.users = res.filter(user => !user.approved);
      });
  }

  approveUser(uid: string) {
    console.log('approve', uid);

    this.usersService.approveUser(uid)
      .subscribe((res: boolean) => {
        console.log(res);
      });
  }

  delteUser(uid: string) {
    console.log('delete', uid);
  }
}
