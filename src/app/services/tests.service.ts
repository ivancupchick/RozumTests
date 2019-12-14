import { Injectable } from '@angular/core';

// plese dont use this service

@Injectable()
export class TestsService {
  // tests: Test[];
  // testsRef: AngularFireList<Test> = this.db.list('tests');

  // lastId: number;

  // constructor(private db: AngularFireDatabase, private authService: AuthService) { }

  // public getTests(force = false): Observable<Test[]> {
  //   if (this.tests && this.tests.length > 0 && !force) {
  //     return of(this.tests);
  //   } else {
  //     return this.testsRef
  //       .valueChanges()
  //       .pipe(
  //         take(1),
  //         catchError((error) => {
  //           console.log(error);
  //           return of([]);
  //         }),
  //         map((res: Test[]) => {
  //           if (!res) {
  //             return [];
  //           }

  //           // console.log(res); // for presentation
  //           this.tests = res;

  //           let lastId = 0;

  //           this.tests.forEach(test => {
  //             if (test.id > lastId) {
  //               lastId = test.id;
  //             }
  //           });

  //           this.lastId = lastId || 0;

  //           return res;
  //         })
  //       );
  //   }
  // }

  // public createTest(test: Test): Observable<boolean> {
  //   return Observable.create(obs => {
  //     const newTest = Object.assign({}, test, { id: (this.lastId || (this.tests ? this.tests.length : 0))});

  //     this.testsRef
  //       .push(newTest)
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

  // deleteTest(id: number) {
  //   this.testsRef.snapshotChanges().forEach( changes => {
  //     changes.forEach( (response: AngularFireAction<DatabaseSnapshot<Test>>) => {
  //       if (response.payload.val().id === id)  {
  //         this.testsRef.remove(response.key);
  //       }
  //     });
  //   });
  // }
}
