import {Component, ViewChild} from '@angular/core';
import {NgbPopover} from "@ng-bootstrap/ng-bootstrap";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "../../users/user.model";
import {TasksList} from "../../tasks-lists/tasks-list.model";
import {ActivatedRoute, Router} from "@angular/router";
import {TasksListsService} from "../../tasks-lists/tasks-lists.service";
import {UsersService} from "../../users/users.service";
import {TasksService} from "../../tasks/tasks.service";
import {RevisorsGroupsService} from "../revisors-groups.service";
import {RevisorsGroup} from "../revisors-group.model";
import {CommentsService} from "../comments.service";
import {Comment} from "../comment.model";
import {forkJoin} from "rxjs";

@Component({
  selector: 'app-revisors-group',
  templateUrl: './revisors-group.component.html',
  styleUrls: ['./revisors-group.component.scss']
})
export class RevisorsGroupComponent {
  @ViewChild('popover') popover!: NgbPopover;
  @ViewChild('popoverDelete') popoverDelete!: NgbPopover;
  groupForm = new FormGroup({
    title: new FormControl('', Validators.required),
    tasksLists: new FormArray([], Validators.required),
    revisors: new FormArray([], Validators.required),
  });
  groupId!: string | null;
  reviorsGroup!: RevisorsGroup;
  currentUser!: User;
  tasksLists!: TasksList[];
  users!: User[];
  errorMessage: string = '';
  listsNames: string[] = [];
  usersNames: string[] = [];
  commentsData!: Comment[];
  commentTitle: string = '';
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private tasksListService: TasksListsService,
    private revisorsGroupsService: RevisorsGroupsService,
    private userService: UsersService,
    private commentsService: CommentsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.groupId = this.route.snapshot.paramMap.get('id');
    const group$ = this.revisorsGroupsService.getRevisorsGroup(this.groupId!);
    const currentUser$ = this.userService.getCurrentUser();
    const users$ = this.userService.getUsers();
    const tasksLists$ = this.tasksListService.getTasksLists();
    const comments$ = this.commentsService.getComments(this.groupId!);

    forkJoin([group$, currentUser$, users$, tasksLists$, comments$]).subscribe(
      ([group, currentUser, users, tasksLists, comments]) => {
        this.reviorsGroup = group;
        this.currentUser = currentUser;
        this.users = users.filter(user => user.company === this.currentUser.company &&
          user._id !== this.currentUser._id);
        this.tasksLists = tasksLists.filter(list => list.mainRevisor._id === this.currentUser._id);
        this.commentsData = comments;
        this.loading = false;
      },
      (error) => {
        console.log('Error loading data:', error);
        this.loading = false;
      }
    );
  }

  loadGroupDetails(groupId: string): void {
    this.revisorsGroupsService.getRevisorsGroup(groupId).subscribe(
      (goup: RevisorsGroup) => {
        this.reviorsGroup = goup;
      },
      (error) => {
        console.log('Error loading tasks:', error);
      }
    );
  }

  loadCurrentUser(): void {
    this.userService.getCurrentUser().subscribe(
      (user: User) => {
        this.currentUser = user;
      },
      (error) => {
        console.error(error);
      })
  }

  loadTasksLists(filters?: {}): void {
    this.tasksListService.getTasksLists(filters).subscribe(
      (tasksLists) => {
        this.tasksLists = tasksLists.filter(list => list.mainRevisor._id === this.currentUser._id);
      },
      (error) => {
        console.log('Error getting tasks lists:', error);
      }
    );
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (data) => {
        this.users = data.filter(user => user.company === this.currentUser.company &&
          user._id !== this.currentUser._id);
      },
      (error) => {
        console.log('Error getting users:', error);
      }
    );
  }

  loadComments(): void {
    this.commentsService.getComments(this.groupId!).subscribe(
      (comments: Comment[]) => {
        this.commentsData = comments;
      },
      (error) => {
        console.log('Error loading comments:', error);
      }
    );
  }

  createComment(): void {
    const commentData = {
      title: this.commentTitle
    };
    this.commentsService.createComment(this.groupId!, commentData).subscribe(
      (createdComment: Comment) => {
        this.commentTitle = '';
        this.loadComments();
      },
      (error) => {
        console.log('Error creating comment:', error);
      }
    );
  }

  deleteComment(commentId: string): void {
    this.commentsService.deleteComment(commentId).subscribe(
      () => {
        this.loadComments();
      },
      (error) => {
        console.log('Error deleting comment:', error);
      }
    );
  }

  updateGroup(): void {
    const groupData = this.groupForm.value;
    this.revisorsGroupsService.updateRevisorsGroup(this.groupId!, groupData).subscribe(
      () => {
        this.popover.close()
        this.loadGroupDetails(this.groupId!);
      },
      (error) => {
        this.errorMessage = 'Помилка серверу, спробуйте ще';
      }
    );
  }

  deleteGorup(): void {
    this.revisorsGroupsService.deleteRevisorsGroup(this.groupId!).subscribe(
      () => {
        this.popoverDelete.close();
        this.router.navigate(['/revisorsGroups']);
      },
      (error) => {
        console.error('Failed to delete tag', error);
      }
    );
  }

  get formLists(): FormArray {
    return this.groupForm.get('tasksLists') as FormArray;
  }

  setLists(id: string, title: string): void {
    if (!this.listsNames.includes(title)) {
      this.listsNames.push(title);
      this.formLists.push(new FormControl(id, Validators.required));
    }
  }

  get formUsers(): FormArray {
    return this.groupForm.get('revisors') as FormArray;
  }

  setUsers(id: string, title: string): void {
    if (!this.usersNames.includes(title)) {
      this.usersNames.push(title);
      this.formUsers.push(new FormControl(id, Validators.required));
    }
  }

  reset(): void {
    this.groupForm.controls.title.setValue('');
    this.formUsers.clear();
    this.formLists.clear();
    this.usersNames = [];
    this.listsNames = [];
    this.errorMessage = '';
  }
}
