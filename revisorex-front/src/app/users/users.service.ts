import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import {User} from "./user.model";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) {}

  getUsers(filters?: { role?: string; fullName?: string }): Observable<User[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    let params = new HttpParams();

    if (filters) {
      if (filters.role) {
        params = params.set('role', filters.role);
      }

      if (filters.fullName) {
        params = params.set('fullName', filters.fullName);
      }
    }
    return this.http.get<User[]>(`${environment.apiUrl}/revisors`, { headers, params });
  }

  getCurrentUser(): Observable<User> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<User>(`${environment.apiUrl}/account`, { headers });
  }

  updateUser(userData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<any>(`${environment.apiUrl}/account`, userData, { headers });
  }

  deleteUser(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<any>(`${environment.apiUrl}/account`, { headers });
  }
}
