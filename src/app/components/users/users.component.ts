import { Component, OnInit } from '@angular/core';
import { UserInfosService } from 'src/app/server/user-infos.service';
import { UserInfo } from 'src/app/services/entities';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.sass']
})
export class UsersComponent implements OnInit {
  users: UserInfo[];

  constructor(private usersService: UserInfosService) { }

  ngOnInit() {
    this.usersService.getList()
      .subscribe((res: UserInfo[]) => {
        this.users = res.filter(user => !user.approved);
      });
  }
}
