import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { UserInfo } from './auth.service';
import { Observable, of } from 'rxjs';
import { take, map, catchError } from 'rxjs/operators';

@Injectable()
export class UsersService {
  users: UserInfo[];

  constructor(public db: AngularFireDatabase) {
    // this.linkUsers = db.list('users');
  }

  public getUsers(force = false): Observable<UserInfo[]> {
    if (this.users && this.users.length > 0 && !force) {
      return of(this.users);
    } else {
      return this.db.list('users')
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

  // approveQuastion(id: number) {
  //   const sendApproveQuestion = (key: string) => {
  //     let approvedQuastion: Quastion;
  //     this.quastions.forEach((question: Quastion) => {
  //       if (question.id === id) {
  //         approvedQuastion = question;
  //       }
  //     });

  //     approvedQuastion.approved = true;
  //     this.db.list('quastions').update(key, {
  //       approved: true,
  //       title: approvedQuastion.title,
  //       id: approvedQuastion.id,
  //       tags: approvedQuastion.tags,
  //       description: approvedQuastion.description,
  //       author: approvedQuastion.author,
  //       dateOfCreation: approvedQuastion.dateOfCreation,
  //       answerID: approvedQuastion.answerID,
  //     });
  //   };

  //   this.db.list('quastions').snapshotChanges().forEach( changes => {
  //     changes.forEach( (response: AngularFireAction<DatabaseSnapshot<Quastion>>) => {
  //         if (response.payload.val().id === id)  {
  //         sendApproveQuestion(response.key);
  //       }
  //     });
  //   });
  // }
}
