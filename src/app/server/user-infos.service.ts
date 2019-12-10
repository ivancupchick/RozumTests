import { Injectable } from '@angular/core';
import { BaseListService } from './base-list.service';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/database/database';
import { UserInfo, TakenTest } from '../services/entities';

@Injectable({
  providedIn: 'root'
})
export class UserInfosService extends BaseListService<UserInfo, UserInfo> {
  protected listRef: AngularFireList<UserInfo> = this.db.list('users');

  constructor(db: AngularFireDatabase) {
    super(db);
  }

  protected getDBDataFromUI = (uiClass: UserInfo, listWithValues: UserInfo[]): UserInfo => {
    return Object.assign({}, uiClass, { id: listWithValues.length || 1 });
  }

  public approveUser(id: number) { // create support for uid: string
    return this.modifyListItem(id, user => {
        user.approved = true;
        return user;
      }
    );
  }

  public addAvailableTest(id: number, testId: number) {
    return this.modifyListItem(id, user => {
      if (!user.availableTestIds.find(avId => avId === id)) {
        user.availableTestIds.push(testId);
      }

      return user;
    });
  }

  public takeTest(id: number, testId: number, markValue: number) { // TODO: Add check for available
    console.log('TEST START');
    console.log(`${+(new Date())}`);
    console.log('TEST END');

    const test = new TakenTest(testId, {
      mark: markValue,
      date: `${+(new Date())}`  // refactor this ?????
    });

    return this.modifyListItem(id, user => {
      user.tests.push(test);

      return user;
    });
  }
}