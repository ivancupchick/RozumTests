import { Component, OnInit } from '@angular/core';
import { UserInfosService } from 'src/app/server/user-infos.service';
import { UserInfo } from 'src/app/services/entities';

@Component({
  selector: 'app-new-users',
  templateUrl: './new-users.component.html',
  styleUrls: ['./new-users.component.scss']
})
export class NewUsersComponent implements OnInit {
  users: UserInfo[];

  constructor(private usersService: UserInfosService) { }

  ngOnInit() {
    this.usersService.getList()
      .subscribe((res: UserInfo[]) => {
        this.users = res.filter(user => !user.approved);
      });
  }

  approveUser(id: number) { // create support UID
    console.log('approve', id);

    this.usersService.approveUser(id)
      .subscribe((res: boolean) => {
        console.log(res);
      });
  }

  delteUser(id: number) { // create support UID
    console.log('delete', id);
  }
}
