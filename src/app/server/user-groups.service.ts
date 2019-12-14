import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { UserGroup, IUserGroup } from '../services/entities';
import { BaseListService } from './base-list.service';

@Injectable({
  providedIn: 'root'
})
export class UserGroupsService extends BaseListService<UserGroup, IUserGroup> { // Add admin check
  protected listRef: AngularFireList<UserGroup> = this.db.list('userGroups');

  constructor(db: AngularFireDatabase) {
    super(db);
  }

  protected getDBDataFromUI = (uiClass: IUserGroup, listWithValues: UserGroup[]): UserGroup => {
    return Object.assign({}, uiClass, { id: listWithValues ? listWithValues.length || 0 : 0 });
  }
}
