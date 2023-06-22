import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {TasksList} from "./tasks-list.model";

@Injectable({
  providedIn: 'root'
})
export class TasksListsService {
  constructor(private http: HttpClient) {
  }

  getTasksLists(filters?: { priority?: string; title?: string }): Observable<TasksList[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    let params = new HttpParams();

    if (filters) {
      if (filters.priority) {
        params = params.set('priority', filters.priority);
      }

      if (filters.title) {
        params = params.set('title', filters.title);
      }
    }
    return this.http.get<TasksList[]>(`${environment.apiUrl}/tasksLists`, {headers, params});
  }

  getTasksList(taskListId: String): Observable<TasksList> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<TasksList>(`${environment.apiUrl}/tasksLists/${taskListId}`, { headers });
  }

  createTasksList(tasksListData: any): Observable<TasksList> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<TasksList>(`${environment.apiUrl}/tasksLists`, tasksListData, { headers });
  }

  deleteTasksList(id: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.delete<any>(`${environment.apiUrl}/tasksLists/${id}`, { headers });
  }

  updateTasksList(id: string, tasksListData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.put<any>(`${environment.apiUrl}/tasksLists/${id}`, tasksListData, { headers });
  }
}
