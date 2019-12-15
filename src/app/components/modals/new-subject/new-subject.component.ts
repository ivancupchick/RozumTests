import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalContext } from 'src/app/modal/modal-context';
import { SubjectsService } from 'src/app/server/subjects.service';
import { NgForm } from '@angular/forms';
import { Subject, ISubject } from 'src/app/services/entities';

@Component({
  selector: 'app-new-subject',
  templateUrl: './new-subject.component.html',
  styleUrls: ['./new-subject.component.sass']
})
export class NewSubjectComponent implements OnInit {
  subjectId: number;

  description: string;
  name: string;

  isLoading = false; // implement spinner

  constructor(private activeRouter: ActivatedRoute,
              private context: ModalContext<NewSubjectComponent>,
              private subjectsService: SubjectsService) { }

  ngOnInit() {
    this.activeRouter.queryParams.subscribe(res => {
      this.subjectId = res.id;
    });
  }

  onSubmit(formData: NgForm) {
    this.isLoading = true;

    const data: { name: string, description: string } = formData.value;

    const newSubject: ISubject = {
      name: data.name,
      description: data.description,
      deleted: false, // replace to service
      tests: [], // replace to service
      courses: [] // replace to service
    };

    this.subjectsService.createListItem(newSubject)
      .subscribe(res => {
        if (res) {
          this.isLoading = false;
          this.hide();
        }
      }, error => console.log(error));
  }

  hide() {
    this.context.resolve();
  }
}
