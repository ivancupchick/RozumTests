import { Component, OnInit } from '@angular/core';
import { Subject } from 'src/app/services/entities';
import { SubjectsService } from 'src/app/server/subjects.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { take } from 'rxjs/operators';
import { ModalService } from 'src/app/modal/modal.service';
import { ModalContainerComponent } from 'src/app/modal/modal-container/modal-container.component';
import { NewSubjectComponent } from '../modals/new-subject/new-subject.component';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.sass']
})
export class SubjectsComponent implements OnInit {
  subjects: Subject[] = [];

  constructor(private subjectsService: SubjectsService, private router: Router,
              private authService: AuthService, private modalService: ModalService) { }

  ngOnInit() {
    this.authService.getUserInfo()
      .pipe( take(1) )
      .subscribe(res => {
        this.subjectsService.getList()
          .subscribe((res2: Subject[]) => {
            this.subjects = res2 || [];
          });
      });
  }

  createTest(subject: Subject) {
    this.router.navigateByUrl(`new-test?id=${subject.id}`);
  }

  deleteTest(id: number) {
    // this.subjectsService.deleteTest(id); // need to insert subjectId
    this.router.navigateByUrl(this.router.url);
  }

  createSubject() {
    this.modalService.open(NewSubjectComponent, null, { hideOnBackdropClick: true, containerType: ModalContainerComponent });
  }
}
