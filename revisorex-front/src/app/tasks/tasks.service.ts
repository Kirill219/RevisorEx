import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";
import { Task } from "./task.model";

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor(private http: HttpClient) {}

  getTasks(filters?: { type?: string; tag?: string; title?: string }): Observable<Task[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    let params = new HttpParams();

    if (filters) {
      if (filters.type) {
        params = params.set('type', filters.type);
      }

      if (filters.tag) {
        params = params.set('tag', filters.tag);
      }

      if (filters.title) {
        params = params.set('title', filters.title);
      }
    }
    return this.http.get<Task[]>(`${environment.apiUrl}/tasks`, { headers, params });
  }

  getMyTasks(filters?: { type?: string; tag?: string; title?: string }): Observable<Task[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    let params = new HttpParams();

    if (filters) {
      if (filters.type) {
        params = params.set('type', filters.type);
      }

      if (filters.tag) {
        params = params.set('tag', filters.tag);
      }

      if (filters.title) {
        params = params.set('title', filters.title);
      }
    }
    return this.http.get<Task[]>(`${environment.apiUrl}/myTasks`, { headers, params });
  }

  getTask(taskId: String): Observable<Task> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Task>(`${environment.apiUrl}/tasks/${taskId}`, { headers });
  }

  createTask(taskData: any): Observable<Task> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<Task>(`${environment.apiUrl}/tasks`, taskData, { headers });
  }

  addResult(taskId: string, formData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<any>(`${environment.apiUrl}/tasks/${taskId}/result`, formData, { headers });
  }

  updateTask(taskId: string, taskData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<any>(`${environment.apiUrl}/tasks/${taskId}`, taskData, { headers });
  }

  deleteTask(taskId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<any>(`${environment.apiUrl}/tasks/${taskId}`, { headers });
  }
}
