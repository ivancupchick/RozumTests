import { Component, OnInit, Input } from '@angular/core';
import { TaskOption, Task, Test, unsignedTaskTestId, TaskType, TaakTypeEnum } from 'src/app/services/tests.service';

export function findPopertyWithValue(objec: any, prop: string, value: string | number) {
  if (objec && objec.hasOwnProperty(prop) && objec[prop] === value) {
    return objec;
  } else {
    for (const key in objec) {
      if (objec.hasOwnProperty(key)) {
        const objectChild = objec[key];
        if (typeof objectChild === 'object') {
          const result = findPopertyWithValue(objectChild, prop, value);

          if (result !== false) {
            return result;
          }
        }
      }
    }

    return false;
  }
}

export interface NewOption extends TaskOption {
  checked: boolean;
}

export interface NewTask extends Task {
  options: NewOption[];
}

export interface NewTest extends Test {
  tasks: NewTask[];
}

@Component({
  selector: 'app-test-form',
  templateUrl: './test-form.component.html',
  styleUrls: ['./test-form.component.sass']
})
export class TestFormComponent implements OnInit {
  @Input() test: NewTest;

  constructor() { }

  ngOnInit() {
    if (!this.test) {
      this.test = {
        id: null,
        name: '',
        description: '',
        uidOfAthor: '',
        tasks: [{
          id: 0,
          description: '',
          testId: null,
          options: [{
            id: 0,
            description: '',
            checked: false
          }],
          typeTask: TaakTypeEnum.checkbox,
          correctOptionIds: []
        }],
        time: 0
      };
    }
  }

  public isFormValid(): boolean {
    const isDescriptionNotValid = findPopertyWithValue(this.test, 'description', '');
    const isNameNotValid = findPopertyWithValue(this.test, 'name', '');
    const isTimeNotValid = findPopertyWithValue(this.test, 'time', 0);

    return !(isDescriptionNotValid || isNameNotValid || isTimeNotValid);
  }

  public getTest(): Test {
    const newTest: NewTest = Object.assign({}, this.test);

    // for (const key in newTest) {
    //   if (newTest.hasOwnProperty(key)) {
    //     if (Array.isArray(newTest[key]) && Array.isArray(this.test[key])) {
    //       newTest[key] = this.test[key].map(item => {
    //         if (Array.isArray(item)) {
    //           return item;
    //         } else {
    //           return Object.assign({}, item);
    //         }
    //       });
    //     } else {
    //       newTest[key] = Object.assign({}, this.test[key]);
    //     }
    //   }
    // }

    newTest.tasks.forEach(task => {
      task.options = task.options.map(option => {
        if (option.checked) {
          task.correctOptionIds.push(option.id);
        }

        delete option.checked;

        return Object.assign({}, option);
      });
    });

    newTest.tasks.forEach(task => {
      if (task.correctOptionIds.length > 1) {
        task.typeTask = TaakTypeEnum.checkbox;
      } else if (task.correctOptionIds.length === 1) {
        task.typeTask = TaakTypeEnum.radio;
      }
    });

    newTest.time *= (60 * 1000);

    return newTest as Test;
  }

  addTask() {
    this.test.tasks.push({
      id: this.test.tasks.length,
      description: '',
      testId: null,
      options: [{
        id: 0,
        description: '',
        checked: false
      }],
      typeTask: TaakTypeEnum.checkbox,
      correctOptionIds: []
    }); //  [taskIndex].options.push({ id: this.test.tasks[taskIndex].options.length } as NewOption);
  }

  addNewOption(taskIndex: number) {
    console.log( this.test.tasks[taskIndex]);
    this.test.tasks[taskIndex].options.push({ id: this.test.tasks[taskIndex].options.length } as NewOption);
  }

  deleteNewOption(taskIndex: number) {
    if (this.test.tasks[taskIndex].options.length <= 2) {
      return; // show error message
    }
    this.test.tasks[taskIndex].options = this.test.tasks[taskIndex].options.filter((option, index, array) => index !== (array.length - 1))
  }

  // addTask(formData: FormGroup) {
  //   // formData.forEach((value, key) => {
  //   //   console.log(value, key);
  //   // });
  //   // formData.

  //   this.tasks.push({
  //     id: this.tasks.length,
  //     description:
  //     // testId  after
  //     // typeTask preload

  //   } as Task);

  //   console.log(this.newOptions);

  //   // console.log(formData.value);
  //   // console.log(formData);
  // }

  public getCheckboxValue(task: Task, option: TaskOption) {
    return !!task.correctOptionIds.find(correctId => correctId === option.id) ? true : false;
  }
}
