function createClass(classs: any, interfacee: any) { // test this please
  for (const key in interfacee) {
    if (interfacee.hasOwnProperty(key) && classs.hasOwnProperty(key)) {
      classs[key] = interfacee[key];
    }
  }
}

/*
list of UserGroup

Features:
- Create UserGroup (For Admin) // yes // need test
- Edit UserGroup (For Admin)
- Delete UserGroup // yes // need test (For Admin) (After that GroupId as field in UserInfo's must be deleted)
*/

export interface IUserGroup {
  name: string;
  description: string;
  deleted: boolean;
  approve: boolean;
}

export type UserGroup = IUserGroup & { id: number; };

/*
list of UserInfo

Features:
- Create UserInfo (related to Auth DB) (only UserInfo with new GroupName ot with existing GroupId) // yes // need test
- Approve UserInfo (For Admin) // yes // need test
- Edit UserInfo (For Admin)
- Delete UserInfo (sync with deleting from Auth DB) (For Admin) // yes // need test
  Features for fields
  - Add test to available tests
  - Add Course to courses
  - Take one of available tests
*/

export type IUserInfo = (MainUserInfo & { userGroupId: number; }) | (MainUserInfo & { userGroupName: string; });

export type UserInfo = ((MainUserInfo & { userGroupId: number; }) | (MainUserInfo & { userGroupName: string; })) & { id: number };

interface MainUserInfo {
  uid: string;
  role: 'User' | 'Admin';
  name: string;
  email?: string;
  photoUrl?: string;
  approved: boolean;
  courseIds: number[];
  availableTest: AvailableTest[];
  tests: TakenTest[];
  deleted: boolean;
}

export interface AvailableTest {
  subjectId: number;
  testId: number;
}

export interface ITakenTest {
  mark: number;
  date: string;
}

export class TakenTest {
  id: number;
  subjectId: number;
  mark: number;
  date: Date;
  deleted: boolean;

  constructor(id: number, options: ITakenTest) {
    this.id = id;

    const date: Date = new Date(+options.date);

    createClass(this, Object.assign({}, options, { date })); // test this please
  }
}

// export class UserInfo extends IUserInfo {
//   constructor(options: IUserInfo) { super(); createClass(this, options); }

  // approveUser() {
  //   this.approved = true;
  // }

  // takeTest(test: ITakenTest) {
  //   const newTest = new TakenTest(this.tests.length, test);

  //   const existingTest = this.tests.find(existTest => existTest.id === newTest.id);

  //   if (existingTest) {
  //     existingTest.mark = newTest.id;
  //     existingTest.date = newTest.date;
  //   } else {
  //     this.tests.push(newTest);
  //   }
  // }

  // deleteTest(id: number) {
  //   this.tests = this.tests.map(test => {
  //     if (test.id === id) {
  //       test.deleted = true;
  //     }

  //     return test;
  //   });
  // }
// }

/*
list of Subjects

  Features:
  - Create Subject
  - Edit Subject
  - Delete Subject
    Features for fields
    - Create Test
    - Edit Test (
      - Add Task
      - Edit Task (
        - Add Option
        - Edit Option
        - Delete Option
        - Set correct option or options
      )
      - Delete Task
    )
    - Delete Test

    - Create Course (Course it's some Test with different orderBy index)
    - Edit Course
    - Delete Course
*/

export type Subject = ISubject & { id: number };

export interface ISubject {
  name: string;
  description: string;
  tests: Test[];
  courses: Course[];
  deleted: boolean;
}

export interface Course {
  id: number;
  name: string;
  description: string;
  tests: (Test & { orderBy: number; })[];
}

export interface Test {
  id?: number;
  name: string;
  description: string;
  uidOfAthor: string;
  positiveMark: number;
  tasks: Task[];
  countForTaking: number;
  subjectId: number;
  time: number; // in minutes
  deleted: boolean;
}

export interface TaskOption {
  id: number;
  description: string;
}

export interface Task {
  id: number;
  description: string;
  options: TaskOption[];
  correctOptionIds: number[];
}
