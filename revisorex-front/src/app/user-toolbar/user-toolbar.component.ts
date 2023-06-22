import { Component } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {User} from "../users/user.model";
import {environment} from "../../environments/environment";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-toolbar',
  templateUrl: './user-toolbar.component.html',
  styleUrls: ['./user-toolbar.component.scss']
})
export class UserToolbarComponent {
  user!: User;

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    this.getCurrentUser();
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }

  getCurrentUser(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get<User>(`${environment.apiUrl}/account`, { headers }).subscribe(
      (user: User) => {
        this.user = user;
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
