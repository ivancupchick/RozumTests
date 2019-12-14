import { Injectable } from '@angular/core';
import { BaseListService } from './base-list.service';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/database/database';
import { UserInfo, TakenTest, IUserInfo } from '../services/entities';

@Injectable({
  providedIn: 'root'
})
export class UserInfosService extends BaseListService<UserInfo, IUserInfo> {
  protected listRef: AngularFireList<UserInfo> = this.db.list('users');

  constructor(db: AngularFireDatabase) {
    super(db);
  }

  protected getDBDataFromUI = (uiClass: IUserInfo, listWithValues: UserInfo[]): UserInfo => {
    return Object.assign({}, uiClass, { id: listWithValues ? listWithValues.length || 0 : 0 });
  }

  public approveUser(id: number) { // create support for uid: string
    return this.modifyListItem(id, user => {
        user.approved = true;
        return user;
      }
    );
  }

  public addAvailableTest(id: number, subjectId: number, testId: number) { // refactir that please
    return this.modifyListItem(id, user => {
      if (!user.availableTest.find(avId => avId.testId === testId && avId.subjectId === subjectId)) {
        user.availableTest.push({ testId, subjectId });
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

  createUser(user: IUserInfo) {
    const newUser = this.getDBDataFromUI(user, this.list);

    this.createListItem(newUser);
  }
}
