import { Component, OnInit, ViewChild } from '@angular/core';
import { Task, TaskOption, TestsService, Test } from 'src/app/services/tests.service';
import { FormGroup } from '@angular/forms';
import { TestFormComponent } from '../shared/test-form/test-form.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-test',
  templateUrl: './create-test.component.html',
  styleUrls: ['./create-test.component.sass']
})
export class CreateTestComponent implements OnInit {
  // tasks: Task[] = [];
  // newOptions: NewOption[] = [];

  @ViewChild(TestFormComponent) form: TestFormComponent;

  constructor(private testsService: TestsService, private router: Router) { }

  ngOnInit() {
    // this.tasks = [];
  }

  createTest() {
    if (this.form.isFormValid()) {
      const test: Test = this.form.getTest(); // add type please

      this.testsService.createTest(test)
        .subscribe(res => {
          if (res) {
            alert('Тест успешно добавлен');

            this.router.navigateByUrl('');
          } else {
            alert('К сожелению что-то пошло не так');
          }
        }, (error) => {
          alert('К сожелению что-то пошло не так');
          alert(error);
        });
    } else {
      alert('Вы не ввели все поля');
    }
  }



  // addNewOption() {
  //   this.newOptions.push({ id: this.newOptions.length } as NewOption);
  // }

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

  // public getCheckboxValue(task: Task, option: TaskOption) {
  //   return !!task.correctOptionIds.find(correctId => correctId === option.id) ? true : false;
  // }



}
