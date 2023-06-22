import {Component, ViewChild} from '@angular/core';
import {Tag} from "./tag.model";
import {TagsService} from "./tags.service";
import {User} from "../users/user.model";
import {UsersService} from "../users/users.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {NgbPopover} from "@ng-bootstrap/ng-bootstrap";
import {forkJoin} from "rxjs";

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent {
  @ViewChild('popover') popover!: NgbPopover;
  @ViewChild('popoverDelete') popoverDelete!: NgbPopover;
  tagForm = new FormGroup({
    title: new FormControl('', Validators.required)
  });
  user!: User;
  tags: Tag[] = [];
  errorMessage: string = '';
  loading: boolean = true;

  constructor(
    private tagService: TagsService,
    private userService: UsersService
    ) {}

  ngOnInit(): void {
    const currentUser$ = this.userService.getCurrentUser();
    const tags$ = this.tagService.getTags();

    forkJoin([currentUser$, tags$]).subscribe(
      ([currentUser, tags]) => {
        this.user = currentUser;
        this.tags = tags;
        this.loading = false;
      },
      (error) => {
        console.log('Error loading data:', error);
        this.loading = false;
      }
    );
  }

  loadTags(): void {
    this.tagService.getTags().subscribe(
      (tags: Tag[]) => {
        this.tags = tags;
      },
      (error) => {
        console.error('Failed to fetch tags', error);
      }
    );
  }

  getCurrentUser(): void {
    this.userService.getCurrentUser().subscribe(
      (user: User) => {
        this.user = user;
      },
      (error) => {
        console.error(error);
      })
  }

  createTag(): void {
    const tagTitle = this.tagForm.value.title;
    this.tagService.createTag(tagTitle!).subscribe(
      (tag: Tag) => {
        this.tags.push(tag);
        this.tagForm.reset();
        this.popover.close();
      },
      (error) => {
        this.errorMessage = 'Тег вже існує, створіть інший';
      }
    );
  }

  deleteTag(tagId: string): void {
    this.tagService.deleteTag(tagId).subscribe(
      () => {
        this.tags = this.tags.filter((tag: Tag) => tag._id !== tagId);
        this.popoverDelete.close();
      },
      (error) => {
        console.error('Failed to delete tag', error);
      }
    );
  }
}
