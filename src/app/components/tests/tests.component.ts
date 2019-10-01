import { Component, OnInit } from '@angular/core';
import { Test, TestsService } from 'src/app/services/tests.service';

@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.scss']
})
export class TestsComponent implements OnInit {
  tests: Test[];

  constructor(private testsService: TestsService) { }

  ngOnInit() {
    this.testsService.getTasks()
      .subscribe((res: Test[]) => {
        this.tests = res || [];
      });
  }

  createTest() {
    console.log('create');
  }
}
