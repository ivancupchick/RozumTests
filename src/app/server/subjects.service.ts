import { Injectable } from '@angular/core';
import { BaseListService } from './base-list.service';
import { Subject, Test, AvailableTest, ISubject } from '../services/entities';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/database/database';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubjectsService extends BaseListService<Subject, ISubject> {
  protected listRef: AngularFireList<Subject> = this.db.list('subjects');

  constructor(db: AngularFireDatabase) {
    super(db);

    if (this.listRef) {
      this.listRef.valueChanges().subscribe((res: (Subject & { deleted: boolean })[]) => {
        console.log(res);
        this.list = res.filter(listItem => !listItem.deleted);
      });
    }
  }

  protected getDBDataFromUI = (uiClass: ISubject, listWithValues: Subject[]): Subject => {
    return Object.assign({}, uiClass, { id: listWithValues ? listWithValues.length || 0 : 0 });
  }

  public createTest(test: Test) { // create support for uid: string
    return this.modifyListItem(test.subjectId, subject => {
        test.id = subject.tests ? subject.tests.length : 0;

        if (subject.tests && Array.isArray(subject.tests)) {
          subject.tests.push(test);
        } else {
          subject.tests = [ test ];
        }

        return subject;
      }
    );
  }

  public modifyTest(test: Test) { // create support for uid: string
    return this.modifyListItem(test.subjectId, subject => {
        // test.id = subject.tests ? subject.tests.length : 0;

        if (!subject || !subject.tests) {
          return subject;
        }

        subject.tests = subject.tests.map(existTest => {
          if (existTest.id === test.id) {
            return test;
          } else {
            return existTest;
          }
        });

        // if (subject.tests && Array.isArray(subject.tests)) {
        //   subject.tests.push(test);
        // } else {
        //   console.log('Что-то пошло не так в subject.service.ts');
        // }

        return subject;
      }
    );
  }

  public getTests(availableTests: AvailableTest[], role: 'Admin' | 'User'): Observable<Test[]> {
    return Observable.create(obs => {
      const tests: Test[] = [];

      if (!this.list) {
        return of(tests);
      }

      this.list.forEach(subject => {
        subject.tests.forEach(subjectTest => {
          if (role === 'Admin') {
            tests.push(subjectTest);
            return;
          }

          const abailableTest = availableTests && availableTests.find(availableTest => {
            return availableTest.subjectId === subject.id && subjectTest.id && !subjectTest.deleted;
          });

          if (abailableTest) {
            tests.push(subjectTest);
          }
        });
      });

      obs.next(tests);
    });
  }

  public deleteTest(subjectId: number, testId: number) {
    return this.modifyListItem(subjectId, subject => {
      subject.tests = subject.tests.map(test => {
        if (test.id === testId) {
          test.deleted = true;
        }

        return test;
      });

      return subject;
    });
  }

  // public addAvailableTest(id: number, testId: number) {
  //   return this.modifyListItem(id, user => {
  //     if (!user.availableTestIds.find(avId => avId === id)) {
  //       user.availableTestIds.push(testId);
  //     }

  //     return user;
  //   });
  // }

  // public takeTest(id: number, testId: number, markValue: number) { // TODO: Add check for available
  //   console.log('TEST START');
  //   console.log(`${+(new Date())}`);
  //   console.log('TEST END');

  //   const test = new TakenTest(testId, {
  //     mark: markValue,
  //     date: `${+(new Date())}`  // refactor this ?????
  //   });

  //   return this.modifyListItem(id, user => {
  //     user.tests.push(test);

  //     return user;
  //   });
  // }
}
