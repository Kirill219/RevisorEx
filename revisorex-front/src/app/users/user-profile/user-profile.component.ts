import {Component, ViewChild} from '@angular/core';
import {User} from "../user.model";
import {UsersService} from "../users.service";
import {NgbPopover} from "@ng-bootstrap/ng-bootstrap";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {forkJoin} from "rxjs";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {
  @ViewChild('popover') popover!: NgbPopover;
  @ViewChild('popoverDelete') popoverDelete!: NgbPopover;
  userForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });
  currentUser!: User;
  errorMessage: string = '';
  loading: boolean = true;

  constructor(
    private userService: UsersService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const user$ = this.userService.getCurrentUser();

    forkJoin([user$]).subscribe(
      ([user]) => {
        this.currentUser = user;
        this.loading = false;
      },
      (error) => {
        console.log('Error loading data:', error);
        this.loading = false;
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

  updateCurrentUser(): void {
    const userData = this.userForm.value;
    this.userService.updateUser(userData).subscribe(
      (user: User) => {
        this.popover.close();
        this.loadCurrentUser();
      },
      (error) => {
        this.errorMessage = 'Помилка серверу, спробуйте ще'
      })
  }

  deleteCurrentUser(): void {
    this.userService.deleteUser().subscribe(
      () => {
        this.router.navigate(['']);
      },
      (error) => {
        console.error(error);
      })
  }

  reset(): void {
    this.userForm.reset();
    this.errorMessage = '';
  }
}
