import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {Hotel} from "./hotel.model";

@Injectable({
  providedIn: 'root'
})
export class HotelsService {
  constructor(private http: HttpClient) {}

  getHotels(filters?: { city?: string; region?: string; title?: string }): Observable<Hotel[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    let params = new HttpParams();

    if (filters) {
      if (filters.city) {
        params = params.set('city', filters.city);
      }

      if (filters.region) {
        params = params.set('region', filters.region);
      }

      if (filters.title) {
        params = params.set('title', filters.title);
      }
    }
    return this.http.get<Hotel[]>(`${environment.apiUrl}/hotels`, { headers, params });
  }

  deleteHotel(hotel: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = { id: hotel };
    return this.http.delete(`${environment.apiUrl}/hotels`, { headers, body });
  }

  createHotel(hotelData: any): Observable<Hotel> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<Hotel>(`${environment.apiUrl}/hotels`, hotelData, { headers });
  }
}
