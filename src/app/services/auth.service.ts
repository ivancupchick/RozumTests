import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { AngularFireAuth} from '@angular/fire/auth';
import { User, auth } from 'firebase/app';

import { Observable, from, of } from 'rxjs';
import { take, tap, concatMap, catchError } from 'rxjs/operators';
import { UserInfo, UserGroup, IUserInfo, IUserGroup } from './entities';
import { UserInfosService } from '../server/user-infos.service';
import { UserGroupsService } from '../server/user-groups.service';

@Injectable()
export class AuthService {
  user: Observable<User>;
  userId: string;

  linkUsers: AngularFireList<UserInfo>;
  users: UserInfo[] = [];
  userInfo: UserInfo;
  usersLength = 1;

  constructor(private afAuth: AngularFireAuth, public db: AngularFireDatabase, private usersService: UserInfosService,
              private userGroupsService: UserGroupsService) {
    this.linkUsers = db.list('users');
    this.user = afAuth.authState;

    this.user.subscribe( (user) => {
      if (user) {
        this.userId = user.uid;
      }
    });

    this.getUsersValueChanges()
      .subscribe((users: UserInfo[]) => {
        this.users = users || [];

        this.usersLength = users.length + 1;

        users.forEach(( userInfomation: UserInfo) => {
          if (this.userId === userInfomation.uid) {
            this.userInfo = userInfomation;
          }
        });
      });

    // this.userInfo = this.receiveUserInfo();
    // console.log(this.userInfo);
  }

  public getUserInfo(): Observable<UserInfo> {
    return Observable.create(obs => {
      this.user
        .subscribe(user => {
          this.usersService.getList()
            .pipe( take(1) )
            .subscribe((users: UserInfo[]) => {
              const userInfo = user ? users.find(userObs => userObs.uid === user.uid) : null;
              obs.next(userInfo || null);
            });
        });
    });
  }

  private pushUserInfoToDB(credential: auth.UserCredential,
                           name: string,
                           group: string | UserGroup): Observable<boolean> { // users: UserInfo[]
    let count = true; // we can delete this
    this.users.forEach( (user: UserInfo) => { // we can delete this
      if (user.uid === credential.user.uid) { // we can delete this
        count = false; // we can delete this
      } // we can delete this
    }); // we can delete this
    if (count) { // we can delete this
      const user: IUserInfo = {
        uid: credential.user.uid,
        name: credential.user.displayName || name,
        email: credential.user.email,
        photoUrl: credential.user.photoURL,
        role: 'User',
        approved: false,
        courseIds: [],
        availableTest: [],
        tests: [],
        userGroupId: (typeof group !== 'string') ? group.id : undefined,
        userGroupName: typeof group === 'string' ? group : undefined,
        deleted: false
      };

      if ((user as any).userGroupId === undefined) {
        delete (user as any).userGroupId;
      }

      if ((user as any).userGroupName === undefined) {
        delete (user as any).userGroupName;
      }

      if (typeof group === 'string') {
        const newGroup: IUserGroup = {
          name: group,
          description: ' ',
          deleted: false,
          approve: true // switch to false
        };

        this.userGroupsService.createListItem(newGroup).subscribe();
      }

      return this.usersService.createListItem(user)
        .pipe(
          tap((res => {
            if (res) {
              console.log('success');
            }
          }))
        );

      // this.linkUsers
      //   .push(user)
      //   .catch((error) => {
      //     console.log(error);
      //   })
      //   .finally(() => {
      //     console.log('end');
      //   });
    }
  }

  getUser(): any {
    return this.afAuth.authState;
  }

  loginWithEmail(email: string, password: string): Observable<any> {
    return from(this.afAuth.auth.signInWithEmailAndPassword(email, password));
  }

  // loginWithGoogle(): any {
  //   from(this.afAuth.auth.signInWithPopup( new auth.GoogleAuthProvider() )).subscribe(
  //     (credential) => {
  //       this.pushUserInfoToDB(credential);
  //     }, (error) => {
  //       throw new Error(error);
  //     }
  //   );
  // }

  // loginWithFacebook(): any {
  //   from(this.afAuth.auth.signInWithPopup( new auth.FacebookAuthProvider() )).subscribe(
  //     (credential) => {
  //       this.pushUserInfoToDB(credential);
  //     }, (error) => {
  //       throw new Error(error);
  //     }
  //   );
  // }

  public createUserWithEmail(options: { email: string, password: string, name: string }, group: string | UserGroup): Observable<boolean> {
    return from(this.afAuth.auth.createUserWithEmailAndPassword(options.email, options.password))
      .pipe(
        concatMap((credential) => {
          return this.pushUserInfoToDB(credential, name, group);
        }),
        catchError((error) => of(error))
      );
  }

  public getCurrentUserInfo(): UserInfo {
    return this.userInfo;
  }

  // public getUserInfo(): Observable<UserInfo> {
  //   return this.getUsersValueChanges()
  //     .pipe(
  //       map((users: UserInfo[]) => {
  //         const user = users.find(userInfomation => userInfomation.uid === this.userId);

  //         return user;
  //       })
  //     );
  // }

  public getUserInfoFromDBWithUID(uid: string): UserInfo {
    let userResult: UserInfo;
    this.users.forEach(user => {
      if (user.uid === uid) {
        userResult = user;
      }
    });
    return userResult;
  }

  public logOut(): void {
    this.userId = '';
    this.userInfo = null;
    this.afAuth.auth.signOut();
  }

  get currentUserObservable(): Observable<User> {
    return this.afAuth.authState;
  }

  getUsersValueChanges() {
    return this.linkUsers.valueChanges();
  }
}
