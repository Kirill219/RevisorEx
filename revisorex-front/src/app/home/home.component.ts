import { Component } from '@angular/core';
import {User} from "../users/user.model";
import {UsersService} from "../users/users.service";
import {forkJoin} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  currentUser!: User;
  loading: boolean = true;

  constructor(private userService: UsersService) { }

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
}
