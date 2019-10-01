import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/database';

export class Task {
  constructor(
      public id: number = 1,
      public name: string = '',
      public uidOfAthor: string = '',
      // public tasks: Task;
    ) { }
}

@Injectable()
export class TasksService {
  tasks: Task[];
  linkTasks: AngularFireList<Task> = this.db.list('tasks');

  constructor(private db: AngularFireDatabase) { }

  // public getTasksforce = false): Observable<UserInfo[]> {
  //   if (this.users && this.users.length > 0 && !force) {
  //     return of(this.users);
  //   } else {
  //     return this.linkUsers
  //       .valueChanges()
  //       .pipe(
  //         take(1),
  //         catchError((error) => {
  //           console.log(error);
  //           return of([]);
  //         }),
  //         map((res: UserInfo[]) => {
  //           if (!res) {
  //             return [];
  //           }
  //           this.users = res;
  //           return res;
  //         })
  //       );
  //   }
  // }
}
