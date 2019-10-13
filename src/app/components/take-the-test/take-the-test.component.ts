import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TestsService, Task } from 'src/app/services/tests.service';
import { UsersService } from 'src/app/services/users.service';
import { timer } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-take-the-test',
  templateUrl: './take-the-test.component.html',
  styleUrls: ['./take-the-test.component.sass']
})
export class TakeTheTestComponent implements OnInit {
  testId = 0;
  tasks: Task[] = [];

  counter = '00:00:00';
  notTime = false;


  constructor(
    private testsService: TestsService,
    private activeRouter: ActivatedRoute,
    private usersService: UsersService,
    private renderer: Renderer2,
    private elem: ElementRef,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.activeRouter.queryParams.subscribe(res => {
      this.testId = res.id;
    });

    this.testsService.getTests()
      .subscribe(res => {
        const curTest = res.find(test => `${test.id}` === `${this.testId}`) || null;

        if (curTest) {
          this.tasks = curTest ? curTest.tasks : [];

          this.setTimer(0.1);
        }
      });
  }

  setTimer(time: number) {

    const fullTime = time * 60;

    console.log(time);
    const timerr = timer(2000, 1000);

    timerr.subscribe(newTick => {
      let newTime = fullTime - newTick;

      if (newTime === 0) {
        this.counter = '00:00:00';
        this.notTime = true;

        this.finishTest();
      } else {
        const hours = Math.floor(newTime / 3600);
        newTime %= 3600;
        const minutes = Math.floor(newTime / 60);
        const seconds = newTime % 60;

        this.counter = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      }
    });
  }

  finishTest() {
    console.log('finish');

    let mark = 0;

    this.tasks.forEach((task, index) => {
      if (task.correctOptionIds.length === 0) {
        alert(`К сожалению задание ${index + 1} не имеет правильных ответов :(`);
      }

      task.options.forEach(option => {
        const input: HTMLInputElement = this.elem.nativeElement.querySelector(`.input-${task.id}-${option.id}`);
        const value = input ? input.checked : null;

        if (value && task.correctOptionIds.findIndex(id => id === option.id) !== -1) {
          mark += ((10 / this.tasks.length) / task.correctOptionIds.length);
        }
      });
    });

    const uid = this.authService.getCurrentUserInfo().uid;

    this.usersService.markTest(uid, this.testId, mark)
      .pipe( take(1) )
      .subscribe((res: boolean) => {
        if (res) {
          alert(`Тест успешно пройден, ваша оценка ${mark}`);
        } else {
          alert(`К сожалению во время отправки теста возникла проблема, покажите это окно учителю, ваша оценка: ${mark}`);
        }
      });
  }
}
