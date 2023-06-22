import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {Comment} from "./comment.model";

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  constructor(private http: HttpClient) {}

  getComments(groupId: string): Observable<Comment[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Comment[]>(`${environment.apiUrl}/comments/${groupId}`, { headers });
  }

  createComment(groupId: string, commentData: any): Observable<Comment> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<Comment>(`${environment.apiUrl}/comments/${groupId}`, commentData, { headers });
  }

  deleteComment(id: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<any>(`${environment.apiUrl}/comments/${id}`, { headers });
  }
}
