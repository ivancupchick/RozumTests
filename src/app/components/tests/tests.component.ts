import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubjectsService } from 'src/app/server/subjects.service';
import { Test } from 'src/app/services/entities';
import { AuthService } from 'src/app/services/auth.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.scss']
})
export class TestsComponent implements OnInit {
  tests: Test[] = [];

  constructor(private subjectsService: SubjectsService, private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.authService.getUserInfo()
      .pipe( take(1) )
      .subscribe(res => {
        this.subjectsService.getTests(res.availableTest, res.role)
          .subscribe((tests: Test[]) => {
            this.tests = tests || [];
          });
      });
  }

  enterTest(test: Test) {
    this.router.navigateByUrl(`take-the-test?id=${test.id}`);
  }

  deleteTest(id: number) {
    // this.subjectsService.deleteTest(id); // need to insert subjectId
    this.router.navigateByUrl(this.router.url);
  }
}
