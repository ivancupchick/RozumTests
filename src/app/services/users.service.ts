import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireAction, DatabaseSnapshot, AngularFireList } from '@angular/fire/database';
import { Observable, of } from 'rxjs';
import { take, map, catchError } from 'rxjs/operators';

export interface Mark {
  idTest: number;
  markValue: number;
}

export interface TakenTest {
  id: number;
  marks: Mark[];
  date: string; // TODO: refactor this please, create converter for db and for UI please
}

export interface IUserInfo {
  uid?: string;
  id?: number;
  role?: 'User' | 'Admin';
  name?: string;
  email?: string;
  photoUrl?: string;
  approved?: boolean;
  tests?: TakenTest[];
}

export class UserInfo implements IUserInfo {
  public uid: string;
  public id: number;
  public role: 'User' | 'Admin';
  public name: string;
  public email: string;
  public photoUrl: string;
  public approved: boolean;
  public tests: TakenTest[];

  constructor(options: IUserInfo) {
    this.uid = options.uid || '';
    this.id = options.id || 1;
    this.role = options.role || 'User';
    this.name = options.name || 'Anonymous';
    this.email = options.email || '';
    this.photoUrl = options.photoUrl || 'https://material.angular.io/assets/img/examples/shiba1.jpg';
    this.approved = options.approved || false;
    this.tests = options.tests || [];
  }

  approveUser() {
    this.approved = true;
  }

  takeTest(newTest: TakenTest) {
    const existingTest =  this.tests.find(test => test.id === newTest.id);

    if (existingTest) {
      existingTest.marks.push(newTest.marks[0]);
    } else {
      this.tests.push(newTest);
    }
  }

  deleteTest(id: number) {
    this.tests = this.tests.filter(test => test.id !== id);
  }
}

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
