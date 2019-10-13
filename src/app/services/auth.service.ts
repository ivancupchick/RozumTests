import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { AngularFireAuth} from '@angular/fire/auth';
import { User, auth } from 'firebase/app';

import { Observable, from, zip } from 'rxjs';
import { UserInfo, UsersService } from './users.service';
import { map, debounce, debounceTime, take } from 'rxjs/operators';

@Injectable()
export class AuthService {
  user: Observable<User>;
  userId: string;

  linkUsers: AngularFireList<UserInfo>;
  users: UserInfo[] = [];
  userInfo: UserInfo;
  usersLength = 1;

  constructor(private afAuth: AngularFireAuth, public db: AngularFireDatabase, private usersService: UsersService) {
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
          this.usersService.getUsers()
            .pipe( take(1) )
            .subscribe((users: UserInfo[]) => {
              const userInfo = user ? users.find(userObs => userObs.uid === user.uid) : null;
              obs.next(userInfo || null);
            });
        });
    });
  }

  private pushUserInfoToDB(credential: auth.UserCredential, name: string) { // users: UserInfo[]
    let count = true;
    this.users.forEach( (user: UserInfo) => {
      if (user.uid === credential.user.uid) {
        count = false;
      }
    });
    if (count) {
      const user = new UserInfo({
        uid: credential.user.uid,
        id: this.usersLength,
        name: credential.user.displayName || name,
        email: credential.user.email,
        photoUrl: credential.user.photoURL,
      });

      this.linkUsers
        .push(user)
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          console.log('end');
        });
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

  public createUserWithEmail(email: string, password: string, name: string) {
    from(this.afAuth.auth.createUserWithEmailAndPassword(email, password))
      .subscribe(
        (credential) => {
          this.pushUserInfoToDB(credential, name);
        }, (error) => {
          throw new Error(error);
        }
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
