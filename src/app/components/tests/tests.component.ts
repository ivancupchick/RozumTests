import { Component, OnInit } from '@angular/core';
import { Test, TestsService } from 'src/app/services/tests.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.scss']
})
export class TestsComponent implements OnInit {
  tests: Test[] = [];

  constructor(private testsService: TestsService, private router: Router) { }

  ngOnInit() {
    this.testsService.getTests()
      .subscribe((res: Test[]) => {
        this.tests = res || [];
      });
  }

  enterTest(test: Test) {
    this.router.navigateByUrl(`take-the-test?id=${test.id}`);
  }

  deleteTest(id: number) {
    this.testsService.deleteTest(id);
    this.router.navigateByUrl(this.router.url);
  }
}
