import { Injectable } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth} from '@angular/fire/auth';
import { User, auth } from 'firebase/app';

import { Observable, from } from 'rxjs';

export class UserInfo {
  constructor(
      public uid: string = '',
      public id: number = 0,
      public role: 'User' | 'Admin' = 'User',
      public name: string = 'Anonymous',
      public email: string = '',
      public photoUrl: string = 'https://material.angular.io/assets/img/examples/shiba1.jpg',
      public approved: boolean = false
    ) { }
}

@Injectable()
export class AuthService {
  user: Observable<User>;
  userId: string;

  linkUsers: any;
  users: UserInfo[] = [];
  userInfo: UserInfo;
  usersLength = 1;

  constructor(private afAuth: AngularFireAuth, public db: AngularFireDatabase) {
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

  private pushUserInfoToDB(credential: auth.UserCredential, name: string) { // users: UserInfo[]
    let count = true;
    this.users.forEach( (user: UserInfo) => {
      if (user.uid === credential.user.uid) {
        count = false;
      }
    });
    if (count) {
      this.linkUsers
        .push({
          uid: credential.user.uid,
          id: this.usersLength || 1,
          role: 'User',
          name: credential.user.displayName || name || 'Anonymous',
          email: credential.user.email,
          photoUrl: credential.user.photoURL || 'https://material.angular.io/assets/img/examples/shiba1.jpg',
          approved: false
        })
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

  public getUserInfo(): Observable<UserInfo> {
    return Observable.create(obs => {
      this.getUsersValueChanges()
        .subscribe((users: UserInfo[]) => {
          users.forEach(( userInfomation: UserInfo) => {
            if (this.userId === userInfomation.uid) {
              obs.next(userInfomation);
            }
          });
        });
    });
  }

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
