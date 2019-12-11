import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new-subject',
  templateUrl: './new-subject.component.html',
  styleUrls: ['./new-subject.component.sass']
})
export class NewSubjectComponent implements OnInit {
  subjectId: number;

  constructor(private activeRouter: ActivatedRoute) { }

  ngOnInit() {
    this.activeRouter.queryParams.subscribe(res => {
      this.subjectId = res.id;
    });
  }
}
