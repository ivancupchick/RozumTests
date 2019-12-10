import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase, AngularFireAction, DatabaseSnapshot } from '@angular/fire/database/database';
import { Observable, of } from 'rxjs';
import { take, map } from 'rxjs/operators';

@Injectable()
export class BaseListService<TMainClass, TUIClass> {
  protected list: TMainClass[];
  protected listRef: AngularFireList<TMainClass>; // = this.db.list('userGroups');

  constructor(protected db: AngularFireDatabase) {
    this.listRef.valueChanges().subscribe((res: (TMainClass & { deleted: boolean })[]) => {
      this.list = res.filter(listItem => !listItem.deleted);
    });
  }

  protected getDBDataFromUI: (uiClass: TUIClass, listWithValues: TMainClass[]) => TMainClass;

  protected getList(): Observable<TMainClass[]> {
    return this.list ? of(this.list) : this.listRef.valueChanges().pipe( take(1) );
  }

  protected createListItem(uiClass: TUIClass): Observable<boolean> { // true - success, false - error
    return Observable.create(obs => {
      const newGroup = this.getDBDataFromUI(uiClass, this.list);

      this.listRef
        .push(newGroup)
        .then(() => {
          obs.next(true);
          console.log('User Group successfully added.');
        })
        .catch((error) => {
          obs.next(false);
          console.log(error);
        });
    }).pipe(
        take(1)
      );
  }

  protected deleteListItem(id: number): Observable<boolean>  { // refactor that please
    return this.modifyListItem(id, (item: any) => Object.assign({}, item, { deleted: true }));

    // return Observable.create((obs) => {
    //   if (!this.list) {
    //     obs.next(false);
    //   }

    //   const listItem = this.list.find((item: (TMainClass & { id: number; })) => item.id === id);

    //   if (!listItem) {
    //     obs.next(false);
    //   }

    //   this.findUserKey(id)
    //     .subscribe(keyAndUser => {
    //       (listItem as any).deleted = true;

    //       this.listRef
    //         .update(keyAndUser.key, listItem)
    //         .then(
    //           (res) => {
    //             console.log(res);
    //             obs.next(true);
    //           },
    //           (error) => {
    //             console.log(error);
    //             obs.next(false);
    //           }
    //         );
    //     });
    // });
  }

  protected modifyListItem(id: number, convertUser: (user: TMainClass) => TMainClass): Observable<boolean>  { // refactor that please
    return Observable.create((obs) => {
      if (!this.list) {
        obs.next(false);
      }

      const listItem = this.list.find((item: (TMainClass & { id: number; })) => item.id === id);

      if (!listItem) {
        obs.next(false);
      }

      this.findUserKey(id)
        .subscribe(keyAndUser => {
          const updatedItem = convertUser(listItem);

          this.listRef
            .update(keyAndUser.key, updatedItem)
            .then(
              (res) => {
                console.log(res);
                obs.next(true);
              },
              (error) => {
                console.log(error);
                obs.next(false);
              }
            );
        });
    });
  }

  protected findUserKey(id: number): Observable<{ key: string, listItem: TMainClass }> {
    return this.listRef.snapshotChanges()
      .pipe(
        take(1),
        map((changes: AngularFireAction<DatabaseSnapshot<TMainClass>>[]) => {
          const result = changes.find(change => (change.payload.val() as any).id === id); // refactor that
          const listItem: TMainClass = result ? result.payload.val() : null;

          return {
            key: result ? result.key : '',
            listItem
          };
        })
      );
  }
}
