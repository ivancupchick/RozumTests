import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireAction, DatabaseSnapshot, AngularFireList } from '@angular/fire/database';
import { UserInfo } from './auth.service';
import { Observable, of } from 'rxjs';
import { take, map, catchError } from 'rxjs/operators';

@Injectable()
export class UsersService {
  users: UserInfo[];
  linkUsers: AngularFireList<UserInfo> = this.db.list('users');

  constructor(private db: AngularFireDatabase) {
    // this.linkUsers = db.list('users');
  }

  public getUsers(force = false): Observable<UserInfo[]> {
    if (this.users && this.users.length > 0 && !force) {
      return of(this.users);
    } else {
      return this.linkUsers
        .valueChanges()
        .pipe(
          take(1),
          catchError((error) => {
            console.log(error);
            return of([]);
          }),
          map((res: UserInfo[]) => {
            if (!res) {
              return [];
            }
            this.users = res;
            return res;
          })
        );
    }
  }

  approveUser(uid: string): Observable<boolean> {
    return Observable.create((obs) => {
      const sendApproveQuestion = (key: string) => {
        let approvedUser: UserInfo;
        this.users.forEach((user: UserInfo) => {
          if (user.uid === uid) { // may convert to string
            approvedUser = user;
          }
        });

        approvedUser.approved = true;
        this.linkUsers
          .update(key, Object.assign({}, approvedUser, { approved: true }))
          .then(
            (res) => {
              console.log(res);
              obs.next(true);
            },
            (error) => {
              console.log(error);
              obs.next(false);
            }
          );
      };

      this.linkUsers.snapshotChanges()
        .forEach((changes: AngularFireAction<DatabaseSnapshot<UserInfo>>[]) => {
          changes.forEach( (response: AngularFireAction<DatabaseSnapshot<UserInfo>>) => {
            if (response.payload.val().uid === uid) { // may convert to string
              sendApproveQuestion(response.key);
            }
          });
        });
    });
  }
}
