import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { timer } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { take } from 'rxjs/operators';
import { SubjectsService } from 'src/app/server/subjects.service';
import { Task } from 'src/app/services/entities';
import { UserInfosService } from 'src/app/server/user-infos.service';

@Component({
  selector: 'app-take-the-test',
  templateUrl: './take-the-test.component.html',
  styleUrls: ['./take-the-test.component.sass']
})
export class TakeTheTestComponent implements OnInit { // refactor this class please
  testId = 0;
  tasks: Task[] = [];

  counter = '00:00:00';
  notTime = false;


  constructor(
    private subjectsService: SubjectsService,
    private activeRouter: ActivatedRoute,
    private usersService: UserInfosService,
    private renderer: Renderer2,
    private elem: ElementRef,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.activeRouter.queryParams.subscribe(res => {
      this.testId = res.id;
    });

    this.subjectsService.getTests(this.authService.userInfo.availableTest)
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

    const id = this.authService.getCurrentUserInfo().id;

    this.usersService.takeTest(id, this.testId, mark)
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
