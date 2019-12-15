import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SubjectsService } from 'src/app/server/subjects.service';
import { Test } from 'src/app/services/entities';
import { TestFormComponent } from '../shared/test-form/test-form.component';

@Component({
  selector: 'app-edit-test',
  templateUrl: './edit-test.component.html',
  styleUrls: ['./edit-test.component.sass']
})
export class EditTestComponent implements OnInit {
  subjectId: number;
  test: Test;

  @ViewChild(TestFormComponent) form: TestFormComponent;

  constructor(private activatedRoute: ActivatedRoute, private subjectsService: SubjectsService, private router: Router) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(res => {
      this.subjectId = typeof res.id === 'string' ? +res.id || 0 : res.id;
      const testId: number = typeof res.testId === 'string' ? +res.testId || 0 : res.testId;

      this.subjectsService.getList().subscribe(res2 => {
        const subject = res2.find(res21 => res21.id === this.subjectId);

        const test = subject.tests.find(testtt => testtt.id === testId);

        this.test = test;
      });
    });
  }

  editTest() {
    if (this.form.isFormValid()) {
      const test: Test = this.form.getTest();

      this.subjectsService.modifyTest(test)
        .subscribe(res => {
          if (res) {
            alert('Тест успешно добавлен');

            this.router.navigateByUrl('');
          } else {
            // alert('К сожелению что-то пошло не так');
          }
        }, (error) => {
          // alert('К сожелению что-то пошло не так');
          console.log(error);
        });
    } else {
      alert('Вы не ввели все поля');
    }
  }

}
