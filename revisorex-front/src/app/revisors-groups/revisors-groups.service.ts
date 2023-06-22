import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {RevisorsGroup} from "./revisors-group.model";

@Injectable({
  providedIn: 'root'
})
export class RevisorsGroupsService {

  constructor(private http: HttpClient) { }

  getRevisorsGroups(): Observable<RevisorsGroup[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<RevisorsGroup[]>(`${environment.apiUrl}/revisorsGroups`, {headers});
  }

  getRevisorsGroup(id: string): Observable<RevisorsGroup> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<RevisorsGroup>(`${environment.apiUrl}/revisorsGroups/${id}`, { headers });
  }

  createRevisorsGroup(groupData: any): Observable<RevisorsGroup> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<RevisorsGroup>(`${environment.apiUrl}/revisorsGroups`, groupData, { headers });
  }

  updateRevisorsGroup(id: string, groupData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<any>(`${environment.apiUrl}/revisorsGroups/${id}`, groupData, { headers });
  }

  deleteRevisorsGroup(id: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<any>(`${environment.apiUrl}/revisorsGroups/${id}`, { headers });
  }
}
