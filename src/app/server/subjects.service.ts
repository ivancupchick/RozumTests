import { Injectable } from '@angular/core';
import { BaseListService } from './base-list.service';
import { Subject, Test, AvailableTest } from '../services/entities';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/database/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubjectsService extends BaseListService<Subject, Subject> {
  protected listRef: AngularFireList<Subject> = this.db.list('subjects');

  constructor(db: AngularFireDatabase) {
    super(db);
  }

  protected getDBDataFromUI = (uiClass: Subject, listWithValues: Subject[]): Subject => {
    return Object.assign({}, uiClass, { id: listWithValues.length || 1 });
  }

  public createTest(test: Test) { // create support for uid: string
    return this.modifyListItem(test.subjectId, subject => {
        test.id = subject.tests.length;

        subject.tests.push(test);

        return subject;
      }
    );
  }

  public getTests(availableTests: AvailableTest[]): Observable<Test[]> {
    return Observable.create(obs => {
      const tests: Test[] = [];

      this.list.forEach(subject => {
        subject.tests.forEach(subjectTest => {
          const abailableTest = availableTests.find(availableTest => {
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
