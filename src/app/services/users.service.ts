import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireAction, DatabaseSnapshot, AngularFireList } from '@angular/fire/database';
import { Observable, of } from 'rxjs';
import { take, map, catchError } from 'rxjs/operators';
import { UserInfo } from './entities';



@Injectable()
export class UsersService {
  users: UserInfo[];
  linkUsers: AngularFireList<IUserInfo> = this.db.list('users');

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
          map((res: IUserInfo[]) => {
            if (!res) {
              return [];
            }

            const users: UserInfo[] = res.map(user => new UserInfo(user));

            this.users = users;
            return users;
          })
        );
    }
  }

  approveUser(uid: string) {
    return this.modifyUser(
      uid,
      user => {
        user.approveUser();
        return user;
      }
    );
  }

  private modifyUser(uid: string, convertUser: (user: UserInfo) => UserInfo): Observable<boolean> {
    return Observable.create((obs) => {
      this.findUserKey(uid)
        .subscribe(keyAndUser => {
          const user = convertUser(new UserInfo(keyAndUser.user));

          this.linkUsers
            .update(keyAndUser.key, user)
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
        });
    });
  }

  private findUserKey(uid: string): Observable<{ key: string, user: UserInfo }> {
    return this.linkUsers.snapshotChanges()
      .pipe(
        take(1),
        map((changes: AngularFireAction<DatabaseSnapshot<UserInfo>>[]) => {
          const result = changes.find(change => change.payload.val().uid === uid);
          const user: UserInfo = result ? result.payload.val() : null;

          return {
            key: result ? result.key : '',
            user
          };
        })
      );
  }

  // setTestTime(uid: string, time: Date) {
  //   console.log(time);
  //   const startTime: number = +time.toString();
  //   console.log(startTime);
  // }

  markTest(uid: string, testId: number, markValue: number) {
    const mark: Mark = {
      idTest: testId,
      markValue
    };

    return this.modifyUser(uid, user => {
      user.takeTest({
        id: testId,
        marks: [ mark ],
        date: (new Date()).toString() // refactor this please
      });

      return user;
    });
  }
}
