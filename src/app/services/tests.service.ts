import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable, of } from 'rxjs';
import { take, catchError, map } from 'rxjs/operators';

export class Test {
  constructor(
      public id: number = 0,
      public name: string = '',
      public uidOfAthor: string = '',
      // public tasks: Task;
    ) { }
}

@Injectable()
export class TestsService {
  tests: Test[];
  linkTests: AngularFireList<Test> = this.db.list('tests');

  constructor(private db: AngularFireDatabase) { }

  public getTasks(force = false): Observable<Test[]> {
    if (this.tests && this.tests.length > 0 && !force) {
      return of(this.tests);
    } else {
      return this.linkTests
        .valueChanges()
        .pipe(
          take(1),
          catchError((error) => {
            console.log(error);
            return of([]);
          }),
          map((res: Test[]) => {
            if (!res) {
              return [];
            }
            console.log(res);
            this.tests = res;
            return res;
          })
        );
    }
  }

  public createTest(test: Test): Observable<boolean> {
    return Observable.create(obs => {
      this.linkTests
        .push(Object.assign({}, test, { id: (this.tests ? this.tests.length : 0)}))
        .then(() => {
          obs.next(true);
          console.log('end');
        })
        .catch((error) => {
          obs.next(false);
          console.log(error);
        });
    }).pipe(
        take(1)
      );
  }
}
