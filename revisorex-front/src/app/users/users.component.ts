import { Component } from '@angular/core';
import {User} from "./user.model";
import {UsersService} from "./users.service";
import {forkJoin} from "rxjs";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
  users: User[] = [];
  titleFilter: string = '';
  filters: any = {};
  loading: boolean = true;

  constructor(private userService: UsersService) {}

  ngOnInit(): void {
    const users$ = this.userService.getUsers();

    forkJoin([users$]).subscribe(
      ([users]) => {
        this.users = users;
        this.loading = false;
      },
      (error) => {
        console.log('Error loading data:', error);
        this.loading = false;
      }
    );
  }

  loadUsers(filters?: {}): void {
    this.userService.getUsers(filters).subscribe(
      (users) => {
        this.users = this.searchTasksByTitle(users, this.titleFilter);;
        this.titleFilter = '';
      },
      (error) => {
        console.log('Error getting users:', error);
      }
    );
  }

  filterData(filterName: string, value: string) {
    this.titleFilter = '';
    let filters = { ...this.filters, [filterName]: value };
    this.loadUsers(filters);
  }

  searchTasksByTitle(users: User[], searchText: string): User[] {
    if (searchText !== '') {
      return users.filter(user =>
        user.fullName.toLowerCase().includes(searchText.toLowerCase())
      );
    } else {
      return users;
    }
  }
}
