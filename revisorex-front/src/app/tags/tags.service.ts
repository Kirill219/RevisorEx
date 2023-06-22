import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {Tag} from "./tag.model";

@Injectable({
  providedIn: 'root'
})
export class TagsService {
  constructor(private http: HttpClient) {}

  getTags(): Observable<Tag[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Tag[]>(`${environment.apiUrl}/tags`, { headers });
  }

  createTag(tagTitle: string): Observable<Tag> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = { title: tagTitle };
    return this.http.post<Tag>(`${environment.apiUrl}/tags`, body, { headers });
  }

  deleteTag(tagId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = { id: tagId };
    return this.http.delete(`${environment.apiUrl}/tags`, { headers, body });
  }
}
