import { Component, OnInit, Input } from '@angular/core';
import { Task, Test, TaskOption } from 'src/app/services/entities';

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

export interface NewTask {
  id: number;
  description: string;
  options: NewOption[];
  typeTask: 'checkbox';
}

export interface NewTest { // extends Test
  id?: number;
  name: string;
  description: string;
  uidOfAthor: string;
  positiveMark: number;
  countForTaking: number;
  subjectId: number;
  tasks: NewTask[];
  time: number; // in minutes
  deleted: boolean;
}

@Component({
  selector: 'app-test-form',
  templateUrl: './test-form.component.html',
  styleUrls: ['./test-form.component.sass']
})
export class TestFormComponent implements OnInit {
  @Input() set realTest(value: Test) {
    if (!value) {
      return;
    }

    const preparedTest: NewTest = {
      id: value.id,
      name: value.name,
      subjectId: value.subjectId, // need add field for subject
      positiveMark: value.positiveMark,
      description: value.description,
      uidOfAthor: value.uidOfAthor,
      countForTaking: value.countForTaking,
      tasks: value.tasks.map((task) => {
        return {
          id: task.id,
          description: task.description,
          options: task.options.map(option => {
            return {
              id: option.id,
              description: option.description,
              checked: task.correctOptionIds.findIndex(id => id === option.id) !== -1
            };
          }),
          typeTask: 'checkbox'
        } as NewTask;
      }),
      // [{
      //   id: 0,
      //   description: '',
      //   // testId: null,
      //   options: [{
      //     id: 0,
      //     description: '',
      //     checked: false
      //   }],
      //   typeTask: 'checkbox',
      //   correctOptionIds: []
      // }],
      time: value.time,
      deleted: value.deleted || false
    };

    this.test = preparedTest;
  }

  test: NewTest;
  @Input() set subjectId(value: number) {
    if (!value) {
      return;
    }

    this.test = {
      id: null,
      name: '',
      subjectId: value, // need add field for subject
      positiveMark: 8,
      description: '',
      uidOfAthor: '',
      countForTaking: 10,
      tasks: [{
        id: 0,
        description: '',
        // testId: null,
        options: [{
          id: 0,
          description: '',
          checked: false
        }],
        typeTask: 'checkbox',
        // correctOptionIds: []
      }],
      time: 1,
      deleted: false
    };
  }

  constructor() { }

  ngOnInit() {
    // if (!this.test) {

    // } else {
    //   // THI
    // }
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

    const test: Test = {
      id: newTest.id,
      name: newTest.name,
      description: newTest.description,
      uidOfAthor: newTest.uidOfAthor,
      positiveMark: newTest.positiveMark,
      tasks: newTest.tasks.map(task => {
        return {
          id: task.id,
          description: task.description,
          options: task.options.map(option => ({ id: option.id, description: option.description })),
          correctOptionIds: task.options
            .filter(option => option.checked)
            .map(option => option.id)
        };
      }),
      countForTaking: newTest.countForTaking,
      subjectId: newTest.subjectId,
      time: (newTest.time * 60 * 1000), // in minutes,
      deleted: newTest.deleted
    };

    // newTest.tasks.forEach(task => {
    //   task.options = task.options.map(option => {
    //     if (option.checked) {
    //       task.correctOptionIds.push(option.id);
    //     }

    //     delete option.checked;

    //     return Object.assign({}, option);
    //   });
    // });

    // newTest.tasks.forEach(task => {
    //   if (task.correctOptionIds.length > 1) {
    //     // task.typeTask = TaakTypeEnum.checkbox;
    //   } else if (task.correctOptionIds.length === 1) {
    //     // task.typeTask = TaakTypeEnum.radio;
    //   }
    // });

    return test;
  }

  addTask() {
    this.test.tasks.push({
      id: this.test.tasks.length,
      description: '',
      // testId: null,
      options: [{
        id: 0,
        description: '',
        checked: false
      }],
      typeTask: 'checkbox'
    }); //  [taskIndex].options.push({ id: this.test.tasks[taskIndex].options.length } as NewOption);
  }

  addNewOption(taskIndex: number) {
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
