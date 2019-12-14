import { Injectable } from '@angular/core';

// Dont's use this please

// export class TaskOption {
//   constructor(
//     public id: number,
//     public description: string
//   ) { }
// }

// export class Task {
//   constructor(
//       public id: number = 1,
//       public testId: number = unsignedTaskTestId,
//       public options: TaskOption[],
//       public typeTask: 'checkbox' | 'radio',
//       public correctOptionIds: number[]
//     ) { }
// }

@Injectable()
export class TasksService {
  // tasks: Task[];
  // linkTasks: AngularFireList<Task> = this.db.list('tasks');

  constructor() { } // private db: AngularFireDatabase

  // public getTasks(force = false): Observable<Task[]> {
  //   if (this.tasks && this.tasks.length > 0 && !force) {
  //     return of(this.tasks);
  //   } else {s
  //     return this.linkTasks
  //       .valueChanges()
  //       .pipe(
  //         take(1),
  //         catchError((error) => {
  //           console.log(error);
  //           return of([]);
  //         }),
  //         map((res: Task[]) => {
  //           if (!res) {
  //             return [];
  //           }
  //           this.tasks = res;
  //           return res;
  //         })
  //       );
  //   }
  // }

  // public createTasks(tasks: Task[]): Observable<boolean> {
  //   return Observable.create(obs => {
  //     if (!tasks || !Array.isArray(tasks)) {
  //       obs.next(false);
  //     }

  //     this.linkTasks
  //       .push(tasks)
  //       .then(() => {
  //         obs.next(true);
  //         console.log('end');
  //       })
  //       .catch((error) => {
  //         obs.next(false);
  //         console.log(error);
  //       });
  //   }).pipe(
  //       take(1)
  //     );
  // }
}
