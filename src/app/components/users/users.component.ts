import { Component, OnInit } from '@angular/core';
import { UserInfo, UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.sass']
})
export class UsersComponent implements OnInit {
  users: UserInfo[];

  constructor(private usersService: UsersService) { }

  ngOnInit() {
    this.usersService.getUsers()
      .subscribe((res: UserInfo[]) => {
        this.users = res.filter(user => !user.approved);
      });
  }
}
