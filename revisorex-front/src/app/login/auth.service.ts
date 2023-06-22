import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    const url = `${environment.apiUrl}/login`;
    const body = { email, password };

    return this.http.post<any>(url, body);
  }
}
